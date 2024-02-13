<template>
    <div>
        <div class="card">
            <div class="card-header">
                Detalles Del Producto
            </div>
            <div class="card-body">
                    <img :style="{ height: '200px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg" class="img-thumbnail" alt="...">
                    <img :style="{ height: '200px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg" class="img-thumbnail" alt="...">
                <div class="mb-3">
                    <label for="name" class="form-label">Nombre:</label>
                    <label v-text="name" class="form-control"></label>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Descripción:</label>
                    <label v-text="description" class="form-control"></label>
                </div>
                <label for="description" class="form-label">Precio:</label>
                <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <label v-text="price" class="form-control"></label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import {useRoute} from 'vue-router';

export default {
    data() {
        return {
            foto: '',
            name: '',
            description: '',
            price: '',
            url: 'http://127.0.0.1:8000/api/products'
        }
    },
    mounted(){
        const route = useRoute();
        this.id = route.params.id;
        this.url += '/'+this.id;
        this.getEstudiante();

    },
    methods: {
        getEstudiante(){
            fetch(this.url)
                .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error(response.status);
            })
                .then(data => {
                this.foto = data.product.foto;
                this.name = data.product.name;
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