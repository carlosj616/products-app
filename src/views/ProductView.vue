<template>
    <div>
        <div class="card">
            <div class="card-header">
                Detalles Del Producto
            </div>
            <div class="card-body">
                <div class="row g-3 mb-3">
                    <div class="col-auto">
                        <img :style="{ height: '150px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg"
                            class="img-thumbnail" alt="...">
                        <img :style="{ height: '150px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg"
                            class="img-thumbnail" alt="...">
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <div class="input-group">
                            <label for="inputName" class="input-group-text">Nombre: </label>
                            <input type="text" v-model="name" class="form-control" id="name" disabled>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="input-group">
                            <label for="inputCategory" class="input-group-text">Categoria: </label>
                            <input type="text" v-model="category" class="form-control" id="name" disabled>
                        </div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <label for="description" class="form-label">Descripcion:</label>
                        <input type="text" v-model="description" class="form-control" id="description" disabled>
                    </div>
                    <div class="col-sm">
                        <label for="inputFechaInicio" class="form-label">Disponible desde:</label>
                        <input type="datetime-local" id="fecha-inicio" v-model="fechaInicio" class="form-control" disabled>
                    </div>
                    <div class="col-sm">
                        <label for="inputFechaFin" class="form-label">Hasta:</label>
                        <input type="datetime-local" id="fecha-fin" v-model="fechaFin" class="form-control" disabled>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <span v-for="(tag, index) in tags" :key="index" class="badge bg-secondary fs-6 me-1">{{ tag }}</span>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="text" v-model="price" class="form-control" id="price" disabled>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
            foto: '',
            name: '',
            category: '',
            description: '',
            price: '',
            tags: [],
            fechaInicio: null,
            fechaFin: null,
            url: import.meta.env.VITE_API_URL + '/api/products'
        }
    },
    mounted() {
        const route = useRoute();
        this.id = route.params.id;
        this.url += '/' + this.id;
        this.getProduct();

    },
    methods: {
        getProduct() {
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
                    this.tags = data.product.tags ? data.product.tags.split(',') : [];
                    this.fechaInicio = data.product.fecha_inicio;
                    this.fechaFin = data.product.fecha_fin;
                    console.log(data);
                })
                .catch(err => {
                    console.error("ERROR: ", err.message);
                });

        }

    }
}
</script>