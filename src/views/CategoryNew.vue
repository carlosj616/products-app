<template>
    <div>
        <div class="card">
            <div class="card-header">
                Registrar Categoria
            </div>
            <div class="card-body">
                <form @submit="saveCategory">
                    <div class="mb-3">
                        <input type="text" v-model="name" class="form-control" id="name"
                            placeholder="Nombre de la categoria ..."
                            :class="[v$.name.$error ? 'is-invalid' : '', v$.name.$dirty && !v$.name.$error ? 'is-valid' : '']">
                        <div v-for="error of v$.name.$errors" :key="error.$uid" class="text-danger">
                            {{ error.$message }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <input type="text" v-model="description" class="form-control" id="description"
                            placeholder="Descripción ..."
                            :class="[v$.description.$error ? 'is-invalid' : '', v$.description.$dirty && !v$.description.$error ? 'is-valid' : '']">
                        <div v-for="error of v$.description.$errors" :key="error.$uid" class="text-danger">
                            {{ error.$message }}
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
import { required, helpers } from '@vuelidate/validators';

const alphaNumWithSpaces = helpers.regex(/^[a-zA-Z0-9 ]+$/);

export default {
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            name: '',
            description: ''
        }
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage('Por favor, complete este campo.', required),
                alphaNumWithSpaces: helpers.withMessage('Este campo solo permite letras y números.', alphaNumWithSpaces)
            },
            description: {
                required: helpers.withMessage('Por favor, complete este campo.', required)
            }
        }
    },
    methods: {
        async saveCategory() {
            event.preventDefault();
            const result = await this.v$.$validate()
            if (!result) {
                console.log("Error Validacion");
                return
            }

            const categoryData = {
                name: this.name,
                description: this.description
            };

            const url = 'http://127.0.0.1:8000/api/categories';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al guardar la categoria');
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/categories';
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al guardar la categoria',
                    });
                });
        }

    }
}
</script>