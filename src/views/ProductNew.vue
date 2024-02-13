<template>
    <div>
        <div class="card">
            <div class="card-header">
                Registrar Producto
            </div>
            <div class="card-body">
                <form @submit="saveProduct" >
                    <img :style="{ height: '200px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg" class="img-thumbnail" alt="...">
                    <img :style="{ height: '200px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg" class="img-thumbnail" alt="...">

                    <div class="mb-3">
                        <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" class="form-control">
                    </div>
                    <div class="mb-3">
                        <input type="text" v-model="name" class="form-control" id="name"
                            placeholder="Nombre del producto ...">
                    </div>
                    <div class="mb-3">
                        <input type="text" v-model="description" class="form-control" id="description"
                            placeholder="Descripción ...">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">$</span>
                        <input type="text" v-model="price" class="form-control" id="price" placeholder="Precio...">
                    </div>
                    <button class="btn btn-primary">Registrar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            foto: '',
            name: '',
            description: '',
            price: ''
        }
    },
    methods: {
        saveProduct() {
            event.preventDefault(); 
            var miFoto = document.getElementById('fotoimg');
            this.foto =miFoto.src;
            const productData = {
                foto: this.foto,
                name: this.name,
                description: this.description,
                price: parseFloat(this.price)
            };

            const url = 'http://127.0.0.1:8000/api/products';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al guardar el producto');
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
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
                        text: 'Hubo un error al guardar el producto',
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