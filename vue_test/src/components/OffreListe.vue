<script setup>
    import { ref } from 'vue';
    const listItems = ref([]);
    async function getData() {
        const res = await fetch("http://localhost:3000/api/offres");
        const finalRes = await res.json();
        listItems.value = finalRes;
    }
    getData()
</script>
<template>
    <div>
        <h1> Liste des offres</h1>
        <table border="1">
            <thead>
                <tr>
                    <th scope="col">Num</th>
                    <th scope="col">orga</th>
                    <th scope="col">etat</th>
                    <th scope="col">date</th>
                    <th scope="col">pieces</th>
                    <th scope="col">nb_pieces</th>
                    <th scope="col">offre</th>
                    <th scope="col">intitule</th>
                    <th scope="col">statut</th>
                    <th scope="col">resp</th>
                    <th scope="col">type</th>
                    <th scope="col">lieu</th>
                    <th scope="col">rythme</th>
                    <th scope="col">salaire</th>
                    <th scope="col">description</th>
                    <th scope="col">Nom</th>
                    <th scope="col">siren</th>
                    <th scope="col">type</th>
                    <th scope="col">siegeSocial</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in listItems">
                    <td>{{ item.numero }}</td>
                    <td>{{ item.organisation }}</td>
                    <td>{{ item.etat }}</td>
                    <td>{{ item.dateValidite }}</td>
                    <td>{{ item.pieces }}</td>
                    <td>{{ item.nombrePieces }}</td>
                    <td>{{ item.offre }}</td>
                    <td>{{ item.intitule }}</td>
                    <td>{{ item.statut }}</td>
                    <td>{{ item.responsable }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.lieu }}</td>
                    <td>{{ item.rythme }}</td>
                    <td>{{ item.salaire }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ item.siren }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{item.siegeSocial}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>