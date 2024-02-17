<template>
    <div>
        <div class="card">
            <div class="card-header">
                Registrar Producto
            </div>
            <div class="card-body">
                <form @submit="saveProduct">
                    <img :style="{ height: '200px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg"
                        class="img-thumbnail" alt="...">
                    <img :style="{ height: '200px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg"
                        class="img-thumbnail" alt="...">

                    <div class="mb-3">
                        <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" class="form-control">
                    </div>
                    <div class="input-group mb-3">
                        <label for="inputName" class="input-group-text">Nombre: </label>
                        <input type="text" v-model="name" class="form-control" id="name"
                            placeholder="Nombre del producto ..."
                            :class="[v$.name.$error ? 'is-invalid' : '', v$.name.$dirty && !v$.name.$error ? 'is-valid' : '']">
                        <div class="input-group-append" style="margin-left: 100px;"></div>
                        <label for="inputCategory" class="input-group-text">Categoria: </label>
                        <select v-model="selectedCategory" class="form-select" aria-label="Default select example"
                            :class="[v$.selectedCategory.$error ? 'is-invalid' : '', v$.selectedCategory.$dirty && !v$.selectedCategory.$error ? 'is-valid' : '']">
                            <option :value="null">Seleccionar...</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                    <div class="input-group mb-3">
                        <div v-for="error of v$.name.$errors" :key="error.$uid" class="text-danger">
                            {{ error.$message }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <input type="text" v-model="description" class="form-control" id="description"
                            placeholder="Descripción ...">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="text" v-model="price" class="form-control" id="price" placeholder="Precio..."
                            :class="[v$.price.$error ? 'is-invalid' : '', v$.price.$dirty && !v$.price.$error ? 'is-valid' : '']">
                    </div>
                    <div v-for="error of v$.price.$errors" :key="error.$uid" class="text-danger">
                        {{ error.$message }}
                    </div>
                    <button class="btn btn-primary mt-3">Registrar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, alphaNum } from '@vuelidate/validators';

const alphaNumWithSpaces = helpers.regex(/^[a-zA-Z0-9 ]+$/);
const customNumber = helpers.regex(/^\d+(\.\d{1,2})?$/);

export default {
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            foto: '',
            name: '',
            categories: [],
            selectedCategory: null,
            description: '',
            price: ''
        }
    },
    mounted() {
        this.getCategories();
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage('Por favor, complete este campo.', required),
                alphaNumWithSpaces: helpers.withMessage('Este campo solo permite letras y números.', alphaNumWithSpaces)
            },
            price: {
                required: helpers.withMessage('Por favor, complete este campo.', required),
                customNumber: helpers.withMessage('El precio debe ser un número con máximo dos dígitos decimales.', customNumber)
            },
            selectedCategory: {
                required: helpers.withMessage('Por favor, seleccione una categoría.', required)
            }
        }
    },
    methods: {
        async saveProduct() {
            event.preventDefault();
            const result = await this.v$.$validate()
            if (!result) {
                console.log("Error Validacion");
                return
            }

            var miFoto = document.getElementById('fotoimg');
            this.foto = miFoto.src;
            const productData = {
                foto: this.foto,
                name: this.name,
                description: this.description,
                price: this.price,
                categoryId: this.selectedCategory
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
                        window.location.href = '/products';
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
        previsualizarFoto(event) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function () {
                var miFoto = document.getElementById('fotoimg');
                miFoto.src = reader.result;
                this.foto = miFoto.src
            }
        },
        getCategories() {
            fetch('http://127.0.0.1:8000/api/categories')
                .then(response => response.json())
                .then(data => {
                    this.categories = data;
                })
                .catch(error => {
                    console.error('Error al obtener categorias:', error);
                });
        }

    }
}
</script>