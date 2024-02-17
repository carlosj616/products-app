<template>
    <div>
        <div class="card">
            <div class="card-header">
                Detalles Del Producto
            </div>
            <div class="card-body">
                    <img :style="{ height: '200px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg"
                        class="img-thumbnail" alt="...">
                    <img :style="{ height: '200px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg"
                        class="img-thumbnail" alt="...">

                    <div class="mb-3">
                        <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" class="form-control">
                    </div>
                    <div class="input-group mb-3">
                        <label for="inputName" class="input-group-text">Nombre: </label>
                        <input type="text" v-model="name" class="form-control" id="name">
                        <div class="input-group-append" style="margin-left: 100px;"></div>
                        <label for="inputCategory" class="input-group-text">Categoria: </label>
                        <input type="text" v-model="category" class="form-control" id="name">
                    </div>
                    <div class="mb-3">
                        <input type="text" v-model="description" class="form-control" id="description">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="text" v-model="price" class="form-control" id="price">
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
            foto: '',
            name: '',
            category: '',
            description: '',
            price: '',
            url: 'http://127.0.0.1:8000/api/products'
        }
    },
    mounted() {
        const route = useRoute();
        this.id = route.params.id;
        this.url += '/' + this.id;
        this.getEstudiante();

    },
    methods: {
        getEstudiante() {
            fetch(this.url)
                .then(response => {
                    if (response.ok)
                        return response.json();
                    throw new Error(response.status);
                })
                .then(data => {
                    this.foto = data.product.foto;
                    this.name = data.product.name;
                    this.category = data.product.category.name;
                    this.description = data.product.description;
                    this.price = data.product.price;
                    console.log(data);
                })
                .catch(err => {
                    console.error("ERROR: ", err.message);
                });

        }

    }
}
</script>