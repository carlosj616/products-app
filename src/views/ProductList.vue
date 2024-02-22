<template>
    <table class="table table-hover table-bordered">
        <thead>
            <tr>
                <th>Id</th>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(product, index) in products" :key="index" :class="{ 'table-info': isInDateRange(product.fecha_inicio, product.fecha_fin) }">
                <td>{{ product.id }}</td>
                <td>
                    <img :style="{ height: '50px', width: 'auto' }" v-if="product.foto" :src="product.foto" id="fotoimg" class="img-thumbnail" alt="...">
                    <img :style="{ height: '50px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg" class="img-thumbnail" alt="...">
                </td>
                <td>{{ product.name }}</td>
                <td>{{  product.category.name  }}</td>
                <td :style="{ maxWidth: '200px' }" class="text-truncate" >{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>
                    <RouterLink :to="{path:'/product/view/'+product.id}" class="btn btn-info"><font-awesome-icon icon="fa-regular fa-eye" class="fa-sm" /></RouterLink>
                    &nbsp
                    <RouterLink :to="{path:'/product/edit/'+product.id}" class="btn btn-warning"><font-awesome-icon icon="fa-solid fa-pen-to-square" class="fa-sm" /></RouterLink>
                    &nbsp
                    <button class="btn btn-danger" @click="deleteProduct(product.id)" ><font-awesome-icon icon="fa-solid fa-trash-can" class="fa-sm" /></button>
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
            products: null
        };
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        getProducts() {
            fetch("http://127.0.0.1:8000/api/products")
                .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error(response.status);
            })
                .then(data => {
                this.products = data;
            })
                .catch(err => {
                console.error("ERROR: ", err.message);
            });
        },
        deleteProduct(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarlo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `http://127.0.0.1:8000/api/products/${id}`;
                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar el producto');
                        }
                        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success').then(() => {
                            this.getProducts();
                        });
                    })
                        .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Se produjo un error al eliminar el producto.', 'error');
                    });
                }
            });
        },
        isInDateRange(startDate, endDate) {
            // Función para verificar si la fecha actual está dentro del rango de fechas
            const currentDate = new Date();
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);
            console.log('currentDate:', currentDate);
            return currentDate >= startDate && currentDate <= endDate;
        }
    },
    components: { RouterLink }
}
</script>
