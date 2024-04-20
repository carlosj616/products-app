<template>
    <table class="table table-hover table-bordered">
        <thead>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(category, index) in categories" :key="index">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td :style="{ maxWidth: '200px' }" class="text-truncate" >{{ category.description }}</td>
                <td>
                    <button class="btn btn-danger" @click="deleteCategory(category.id)" ><font-awesome-icon icon="fa-solid fa-trash-can" class="fa-sm" /></button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import Swal from 'sweetalert2';
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            categories: null
        };
    },
    mounted() {
        this.getCategories();
    },
    methods: {
        getCategories() {
            fetch(import.meta.env.VITE_API_URL + "/api/categories")
                .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error(response.status);
            })
                .then(data => {
                this.categories = data;
            })
                .catch(err => {
                console.error("ERROR: ", err.message);
            });
        },
        deleteCategory(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarla!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${import.meta.env.VITE_API_URL}/api/categories/${id}`;
                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar la categoria');
                        }
                        Swal.fire('¡Eliminada!', 'La categoria ha sido eliminada.', 'success').then(() => {
                            this.getCategories();
                        });
                    })
                        .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Se produjo un error al eliminar la categoria.', 'error');
                    });
                }
            });
        }
    },
    components: { RouterLink }
}
</script>