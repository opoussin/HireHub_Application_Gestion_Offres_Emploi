# Rapport de sécurité SR10

Ce rapport de sécurité a pour objectif d'analyser les vulnérabilités potentielles présentes sur le site développé pour l’UV SR10 en Node.js. L'étude se concentrera sur trois exemples de vulnérabilités couramment rencontrées dans les applications web. Chaque vulnérabilité sera diagnostiquée pour comprendre son impact potentiel sur l'application, puis des méthodes de protection appropriées seront exposées. Lorsque c’est possible, des correctifs éventuels seront implémentés pour renforcer la sécurité de notre application. 

## Injection (SQL, OS et LDAP)

### Problème

Les attaques d'injection se produisent lorsque des données non fiables ou non validées sont insérées de manière malveillante dans des requêtes SQL, des commandes du système d'exploitation (OS) ou des requêtes LDAP. Cela permet à un attaquant d'exécuter du code indésirable, d'accéder à des données sensibles, de prendre le contrôle du système ou d'effectuer d'autres actions malveillantes. Les trois types d’injections sont donc : 

- Injection SQL : L'injection SQL se produit lorsqu'un attaquant insère des instructions SQL malveillantes dans des entrées utilisateur qui sont ensuite exécutées par la base de données. Cela peut permettre à l'attaquant d'accéder, de modifier ou de supprimer des données, voire de prendre le contrôle total de la base de données.
- Injection OS : L'injection OS se produit lorsque des commandes système du système d'exploitation sont insérées de manière malveillante dans des entrées utilisateur.
- Injection LDAP : L'injection LDAP se produit lorsqu'un attaquant insère des instructions malveillantes dans des requêtes LDAP. Cela peut permettre à l'attaquant de récupérer des informations sensibles, de contourner les mécanismes d'authentification ou de provoquer d'autres comportements indésirables dans le système d'annuaire.

### Exploitation de la faille :

- Injection SQL :  En rentrant : xxxx’ or ‘a’=‘a dans une zone d’input de formulaire (celui de recherche d’offres filtrées sur la page d’accueil candidat par exemple), les ‘ permettant de faire echapper la requete, a =a renvoyant par défaut toutes les valeurs de la BDD. Dans l’exemple de la page d’accueil candidat, cela permettrait d’afficher toutes les offres, même celles archivées. Cette manipulation n’est pas réalisable sur notre site car nous avons codé depuis le début avec des requêtes préparées.
- Un autre exemple d’injection SQL pourrait être l’insertion de “**10; DROP UTILISATEURS---”,** ce qui renverrait la requête SQL suivante :
    
     **SELECT * FROM UTILISATEUR WHERE mail = 10; DROP UTILISATEURS--**
    
    ce qui permettrait à l’attaquant de détériorer la base de données. 
    
- Injection OS et injection LDAP : Nous ne somme pas concernés par ce type d’injections.


### Solution :

1. Validation des entrées utilisateur : Il est nécessaire que toutes les entrées utilisateur soit correctement validées et échappées avant d'être utilisées dans des requêtes SQL. La validation doit être stricte et rejeter toutes les entrées non autorisées. Cette sécurité impacte le niveau de contrôle de données
2. Utilisation de requêtes préparées ou de mécanismes d'ORM. Cette sécurité impacte le niveau de la base données.
3. Privilèges d'accès appropriés : Il est nécessaire que les utilisateurs aient uniquement les privilèges d'accès nécessaires à leurs opérations. 

### Implémentation :

1. Validation des entrées utilisateur : Grâce au package escapeHtml déjà présent, nous avons échappé toutes les données provenant de formulaires en direction de la base de données. Nous avons aussi rendu tout les champs de formulaires obligatoires, et précisé certains formats ( liste déroulante, test du format du numéro de téléphone à l’inscription, test du format de l’adresse mail à l’inscription avec Bootstrap…)
2. Utilisation de requêtes préparées : Nous avons mis en place dès le début des requêtes SQL préparées de la manière suivante: 
    
    En implémentant des query placeholders, indiqué par les ?, l’interface va automatiquement échapper le contenu des variables à insérer avant de les placer dans la query.
    
    ```jsx
    updateUser: function (mail, nom, prenom, telephone, callback) {
            var sql = mysql.format("UPDATE UTILISATEUR SET nom =?, prenom=?, telephone=? WHERE mail=?", [nom, prenom, telephone, mail]);
            db.query(sql, function (err) {
                    if (err) return callback(false);
                    callback(true);
                });
        },
    ```
    
    sr10/myapp/Modele/Candidat.js, [25,36]
    
3. Privilèges d'accès appropriés : Nous avons implémenté 3 niveaux d’accès, détaillés plus bas. ( partie Violation de contrôle d’accès)

## Violation de gestion d’authentification

### Problème :

La violation de gestion d'authentification concerne le processus d'identification et de vérification des utilisateurs légitimes qui accèdent à un site web. Une mauvaise gestion de l'authentification peut permettre à des individus mal intentionnés de contourner les mécanismes de sécurité et de compromettre l'intégrité et la confidentialité des données.

### Exploitation de la faille :

- Mauvaise gestion des mots de passe : mot de passe peu complexe et stockés de manière non sécurisées, sensibles au injection SQL lors de la connexion (voir ci-dessus)
- Mauvaise gestion des sessions
- Attaque par brut force  : Permettre à un attaquant d'essayer de manière répétée différentes combinaisons de mots de passe jusqu'à ce qu'il en trouve un valide.
- Non suppression de compte par défaut d’administration, dont les mots de passe sont facilement devinables

### Solution :

1. Utilisation de mots de passe forts : L’application doit exiger des utilisateurs la création de mots de passe solides, combinant des caractères alphanumériques, des symboles et une longueur suffisante pour résister aux attaques par force brute.
2. Stockage sécurisé des mots de passe : Les mots de passe doivent être stockés de manière sécurisée en utilisant des techniques de hachage robustes et des algorithmes de chiffrement forts.
3. Protection contre les attaques par force brute : L’application doit mettre en place des mécanismes de protection contre les attaques par force brute, telles que le verrouillage du compte après un certain nombre de tentatives infructueuses de connexion.
4. Gestion des sessions : Les sessions d'utilisateur doivent être gérées de manière sécurisée, en utilisant des identifiants de session uniques, des délais d'expiration appropriés et une invalidation correcte des sessions après la déconnexion.

### Implémentation

1. Exigence d’un mot de passe au format recommandé par la CNIL lors de l’inscription. La vérification se fait dans la route grâce à cette formule RegEx :
    
    ```jsx
    //requete post '/inscription'
    const cnilPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{12,}$/;
      if (cnilPasswordRegex.test(mdp)) {
     //suite du code de création de compte
    ```
    
    sr10/myapp/routes/index.js, [100, 103]
    
2. Stockage sécurisé : Les mots de passe sont cryptés à la création du compte dans la BDD grâce au module bcrypt et la fonction de hachage suivante : 
    
    ```jsx
    generateHash: function (plaintextPassword, callback) {
        bcrypt.hash(plaintextPassword, 10, function (err, hash) {
          // call the function that Store hash in the database
          callback(hash);
        });
      },
    ```
    
    sr10/myapp/Modele/pass.js, [3,8]
    
    Cela rend la lecture des mots de passe en clair impossible.
    
3. Protection contre les attaques par force brute : Un verrouillage du compte après un certain nombre de tentatives infructueuses de connexion serait nécessaire pour éviter de genre d’attaque, par exemple avec le package **express-rate-limit**, nous ne l’avons malheuresement pas implémenté.
4. Gestion des sessions : Nous gérons les sessions avec Express session, ce qui permet un stockage sécurisé des informations de sessions en utilisant un cookie crypté ainsi qu’une gestion sécurisée des ID de sessions qui sont uniques. Un délai d’expiration de 1 heure est imposé, et la session est détruite après la déconnexion.
    
    ```jsx
    // création de la session
    init: () => {
        const generateRandomKey = (length) => {
            return crypto.randomBytes(length).toString('hex');
          };
          
        const keyLength = 32; // Longueur de la clé en octets
        const randomKey = generateRandomKey(keyLength);
        return sessions({
            
          secret: randomKey,
          saveUninitialized: true,
          cookie: {httpOnly: true, maxAge: 3600 * 1000 }, // 60 minutes
          resave: false,
        });
      },
    ```
    
    sr10/myapp/Modele/session.js, [5,20]
    

## Violation de contrôle d’accès

La violation de contrôle d'accès est une vulnérabilité qui survient lorsque les mécanismes de sécurité d'une application web ne sont pas correctement mis en œuvre, permettant ainsi à des utilisateurs non autorisés d'accéder à des ressources, des fonctionnalités ou des informations sensibles. Cette vulnérabilité peut conduire à des atteintes à la confidentialité, à la manipulation de données et à des violations de la politique de sécurité.

### Exploitation de la faille :

- Modification d’une URL pour accéder à des pages dont l’utilisateur ne possède pas l’accès
    - Entrer /recrut/recruteur pour accéder à la page d’accueil des recruteurs sans avoir les accès
    - Entrer l’URL : recrut/supp_offre/5 en tant que recruteur qui a accès à ce chemin, mais dont l’offre n°5 n’appartient pas aux organisations dont il fait partie. Cela permettrait de supprimer les offres d’autres organisations

### Solutions :

1. Validation des autorisations : Vérifier si l’application effectue une validation adéquate des autorisations pour les actions sensibles, les pages restreintes et les fonctionnalités réservées aux utilisateurs authentifiés. 
2. Mettre en place un gestion des sessions et des identifiants d'accès, utiliser des jetons d’authentification
3. Vérifier que les URL ne peuvent pas être devinées ou manipulées pour contourner les contrôles d'accès.

### Implémentation :

1. Validation des autorisations : Nous avons créé différents type d’accès : recruteur, admin et candidat, donnant accès à des pages précises. Nous avons créé un middleware que nous importons dans les routes pour vérifier le statut de l’utilisateur à chaque utilisation d’une route recruteur ou administrateur. Ce middleware vérifie également que l’utilisateur est connecté, afin d’empécher l’accès au site à des personnes non authentifiées.
    
    ```jsx
    module.exports = {
        isAdminMiddleware : (req,res, next) =>{
          console.log("admin middleware");
            if(req.session.type>=3){
              return next();
            }else{
              res.redirect('/users/candidat');
            };
          },
    
          isRecruteurMiddleware : (req,res, next) =>{
            if(req.session.orga.length != 0){
              return next();
            }else{
              res.redirect('/users/candidat');
            };
          },
    
          isLoggedMiddleware : (req,res, next) =>{
            if(req.session.userid){
              return next();
            }else{
              res.redirect('/');
            };
          },
    
    };
    ```
    
    sr10/myapp/middleware.js
    
    [https://gitlab.utc.fr/cgommard/sr10/-/blob/main/myapp/middleware.js#L1](https://gitlab.utc.fr/cgommard/sr10/-/blob/main/myapp/middleware.js#L1)
    
2. Gestion des sessions : Nous gérons les sessions avec Express session, ce qui permet un stockage sécurisé des informations de sessions en utilisant un cookie crypté ainsi qu’une gestion sécurisée des ID de sessions. Nous n’utilisons pas de jetons d’authentification (Express Session utilise des cookies signés pour stocker l'identifiant de session sur le client), mais nous aurions pu implémenter cette fonctionnalité avec Passeport.js.
3. Contrôle des URL : En plus du middleware contrôlant si l’utilisateur possède les accès à certaines routes, certaines routes sont individuellement protégées pour éviter qu’une manipulation de l’URL. En reprenant l’exemple de recrut/supp_offre/5 , si le recruteur remplace 5 par le numéro d’une offre existante mais n’appartenant pas à une de ses organisations ou si l’offre n’exsite pas, la route redirige vers la page d’accueil du recruteur.
    
    ```jsx
    recruteurModel.readOffre(numero, function (offre) {
        if (offre && offre.legnth > 0) {
          //verification de l'appartenance à l'organisation
          let appartient = false;
          req.session.orga.forEach((org) => {
    
            if (org.organisation == offre.organisation) {
              appartient = true;
            }
          })
          if (appartient) {
            // verifie que l'offre appartient bien à une des entreprises de l'utilisateur  
            recruteurModel.deleteOffre(numero, function (result) {
    ```
    
    sr10/myapp/routes/recrut.js [89, 103]
    
    [https://gitlab.utc.fr/cgommard/sr10/-/blob/main/myapp/routes/recrut.js#L89](https://gitlab.utc.fr/cgommard/sr10/-/blob/main/myapp/routes/recrut.js#L89)
    

## Conclusion

Concernant l'injection, il a été constaté que le site est sécurisé contre les injections SQL grâce à l'utilisation de requêtes préparées. 

En ce qui concerne la violation de gestion d'authentification, des mesures de sécurité appropriées ont été implémentées. Le site exige des mots de passe forts lors de l'inscription et stocke les mots de passe de manière sécurisée en utilisant le hachage bcrypt. Cependant, il n'y a pas de mécanisme de protection contre les attaques par force brute, ce qui constitue une piste d’amélioration.

Enfin, en ce qui concerne la violation de contrôle d'accès, des autorisations appropriées ont été mises en place pour restreindre l'accès aux ressources sensibles. Des middlewares vérifient le statut de l'utilisateur et ses privilèges avant d'autoriser l'accès aux routes restreintes. Les routes faisant passer des paramètres dans l’URL sont contrôlées afin de contrôler l’accès aux données et les cas où la donnée n’existe pas ont été traités.
