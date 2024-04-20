<template>
    <div>
        <div class="card">
            <div class="card-header">
                Registrar Producto
            </div>
            <div class="card-body">
                <form @submit="saveProduct">
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-auto">
                            <img :style="{ height: '150px', width: 'auto' }" v-if="this.foto" :src="this.foto" id="fotoimg"
                                class="img-thumbnail" alt="...">
                            <img :style="{ height: '150px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg"
                                id="fotoimg" class="img-thumbnail" alt="...">
                        </div>
                        <div class="col-auto">
                            <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg"
                                class="form-control">
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <div class="input-group">
                                <label for="inputName" class="input-group-text">Nombre: </label>
                                <input type="text" v-model="name" class="form-control" id="name"
                                    placeholder="Nombre del producto ..."
                                    :class="[v$.name.$error ? 'is-invalid' : '', v$.name.$dirty && !v$.name.$error ? 'is-valid' : '']">
                            </div>
                            <div v-for="error of v$.name.$errors" :key="error.$uid" class="text-danger">
                                {{ error.$message }}
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="input-group">
                                <label for="inputCategory" class="input-group-text">Categoria: </label>
                                <select v-model="selectedCategory" class="form-select" aria-label="Default select example"
                                    :class="[v$.selectedCategory.$error ? 'is-invalid' : '', v$.selectedCategory.$dirty && !v$.selectedCategory.$error ? 'is-valid' : '']">
                                    <option :value="null">Seleccionar...</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">{{
                                        category.name
                                    }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <label for="description" class="form-label">Descripcion:</label>
                            <input type="text" v-model="description" class="form-control" id="description"
                                placeholder="Descripción ...">
                        </div>
                        <div class="col-sm">
                            <label for="inputFechaInicio" class="form-label">Disponible desde:</label>
                            <input type="datetime-local" id="fecha-inicio" v-model="fechaInicio" class="form-control">
                        </div>
                        <div class="col-sm">
                            <label for="inputFechaFin" class="form-label">Hasta:</label>
                            <input type="datetime-local" id="fecha-fin" v-model="fechaFin" class="form-control"
                                :class="[v$.fechaFin.$error ? 'is-invalid' : '', v$.fechaFin.$dirty && !v$.fechaFin.$error ? 'is-valid' : '']">
                            <div v-for="error of v$.fechaFin.$errors" :key="error.$uid" class="text-danger">
                                {{ error.$message }}
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <div class="input-group">
                                <label for="inputtag" class="input-group-text">Etiquetas: </label>
                                <vue-tags-input v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags" />
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="text" v-model="price" class="form-control" id="price" placeholder="Precio..."
                                    :class="[v$.price.$error ? 'is-invalid' : '', v$.price.$dirty && !v$.price.$error ? 'is-valid' : '']">
                            </div>
                            <div v-for="error of v$.price.$errors" :key="error.$uid" class="text-danger">
                                {{ error.$message }}
                            </div>
                        </div>
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
import { helpers, required, alphaNum, minValue } from '@vuelidate/validators';
import VueTagsInput from "@sipec/vue3-tags-input";

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
            price: '',
            tag: '',
            tags: [],
            fechaInicio: null,
            fechaFin: null
        }
    },
    mounted() {
        this.getCategories();
        this.setFechaActual();
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
            },
            fechaFin: {
                required: helpers.withMessage('Por favor, seleccione una fecha de fin.', required),
                minValue: helpers.withMessage('La fecha de fin debe ser mayor o igual a la fecha de inicio.', (value) => {
                    const startDate = new Date(this.fechaInicio);
                    const endDate = new Date(value);
                    return endDate >= startDate;
                })
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
            const tagsString = this.tags.map(tag => tag.text).join(',');
            const productData = {
                foto: this.foto,
                name: this.name,
                description: this.description,
                price: this.price,
                categoryId: this.selectedCategory,
                tags: tagsString,
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFin
            };

            const url = import.meta.env.VITE_API_URL + '/api/products';

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
            fetch(import.meta.env.VITE_API_URL + '/api/categories')
                .then(response => response.json())
                .then(data => {
                    this.categories = data;
                })
                .catch(error => {
                    console.error('Error al obtener categorias:', error);
                });
        },
        setFechaActual() {
            const nowUtc = new Date();
            nowUtc.setHours(nowUtc.getHours() - 5);
            const formattedDate = nowUtc.toISOString().slice(0, 16);
            this.fechaInicio = formattedDate;
        }
    },
    components: {
        VueTagsInput,
    },
}
</script>