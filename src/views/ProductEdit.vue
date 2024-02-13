<template>
    <div>
        <div class="card">
            <div class="card-header">
                Editar Producto
            </div>
            <div class="card-body">
                <form @submit="editProduct" >
                    <img :style="{ height: '200px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg" class="img-thumbnail" alt="...">
                    <img :style="{ height: '200px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg" class="img-thumbnail" alt="...">
                    <div class="mb-3">
                        <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Nombre:</label>
                        <input type="text" v-model="name" class="form-control" id="name"
                            placeholder="Nombre del producto ...">
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Descripción:</label>
                        <input type="text" v-model="description" class="form-control" id="description"
                            placeholder="Descripcion ...">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">$</span>
                        <input type="text" v-model="price" class="form-control" id="price" placeholder="Precio...">
                    </div>
                    <button class="btn btn-primary">Actualizar</button>
                </form>
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
            
        },
        editProduct() {
            event.preventDefault(); 
            var miFoto = document.getElementById('fotoimg');
            this.foto =miFoto.src;
            const productData = {
                foto: this.foto,
                name: this.name,
                description: this.description,
                price: parseFloat(this.price)
            };

            fetch(this.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al actualizar el producto');
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizacion exitosa',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/';
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al actualizar el producto',
                    });
                });
        },
        previsualizarFoto(event){
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function(){
                var miFoto = document.getElementById('fotoimg');
                miFoto.src = reader.result;
                this.foto = miFoto.src
            }
        }

    }
}
</script>