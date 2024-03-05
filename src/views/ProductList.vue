<template>
    <div>
        <div class="row mb-2 mt-4">
            <div class="col-sm-4">
                <div class="input-group align-items-center">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-transparent border-0 rounded-left">
                            <font-awesome-icon :icon="['fas', 'search']" class="fa-lg" />
                        </span>
                    </div>
                    <input type="text" v-model="searchQuery" @input="debouncedSearch" class="form-control rounded-right"
                        placeholder="Search...">
                </div>
            </div>
            <div class="col-sm-2 position-relative">
                <input type="date" v-model="startDate" class="form-control" @change="debouncedSearch"
                    :class="[v$.startDate.$error ? 'is-invalid' : '', v$.startDate.$dirty && !v$.startDate.$error ? 'is-valid' : '']">
                <div v-for="error of v$.startDate.$errors" :key="error.$uid" class="invalid-tooltip">
                    {{ error.$message }}
                </div>
            </div>
            <div class="col-sm-2 position-relative">
                <input type="date" v-model="endDate" class="form-control" @change="debouncedSearch"
                    :class="[v$.endDate.$error ? 'is-invalid' : '', v$.endDate.$dirty && !v$.endDate.$error ? 'is-valid' : '']">
                <div v-for="error of v$.endDate.$errors" :key="error.$uid" class="invalid-tooltip">
                    {{ error.$message }}
                </div>
            </div>
            <div class="col-sm-2">
                <button class="btn btn-light" @click="resetFilters"><font-awesome-icon
                        :icon="['fas', 'filter-circle-xmark']" class="fa-lg" /></button>
            </div>
            <div class="col-sm-1">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Download
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click.prevent="generarReportePDF">PDF</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="generarReporteExcel">Excel</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products.data" :key="index"
                    :class="{ 'table-info': isInDateRange(product.fecha_inicio, product.fecha_fin) }">
                    <td>{{ product.id }}</td>
                    <td>
                        <img :style="{ height: '50px', width: 'auto' }" v-if="product.foto" :src="product.foto" id="fotoimg"
                            class="img-thumbnail" alt="...">
                        <img :style="{ height: '50px', width: 'auto' }" v-else src="../assets/sin-imagen.jpg" id="fotoimg"
                            class="img-thumbnail" alt="...">
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category.name }}</td>
                    <td :style="{ maxWidth: '200px' }" class="text-truncate">{{ product.description }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <RouterLink :to="{ path: '/product/view/' + product.id }" class="btn btn-primary"><font-awesome-icon
                                icon="fa-regular fa-eye" class="fa-sm" /></RouterLink>
                        &nbsp
                        <RouterLink :to="{ path: '/product/edit/' + product.id }" class="btn btn-primary"><font-awesome-icon
                                icon="fa-solid fa-pen-to-square" class="fa-sm" /></RouterLink>
                        &nbsp
                        <button class="btn btn-danger" @click="deleteProduct(product.id)"><font-awesome-icon
                                icon="fa-solid fa-trash-can" class="fa-sm" /></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-10">
                <nav>
                    <ul class="pagination pagination justify-content-end">
                        <li class="page-item" :class="{ 'disabled': !products.prev_page_url }">
                            <a class="page-link" href="#" aria-label="Previous"
                                @click.prevent="fetchProducts(products.prev_page_url)">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item" v-for="page in products.last_page" :key="page"
                            :class="{ 'active': page === products.current_page }">
                            <a class="page-link" href="#">{{ page
                            }}</a>
                        </li>
                        <li class="page-item" :class="{ 'disabled': !products.next_page_url }">
                            <a class="page-link" href="#" aria-label="Next"
                                @click.prevent="fetchProducts(products.next_page_url)">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="col-2">
                <div class="input-group">
                    <label for="per_page" class="input-group-text">Filas por página: </label>
                    <select class="form-select form-select-sm" v-model="products.per_page" @change="debouncedSearch">
                        <option value="3">3</option>
                        <option value="7">7</option>
                        <option value="12">12</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { RouterLink } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, alphaNum, minValue } from '@vuelidate/validators';
import { debounce } from 'lodash';

export default {
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            searchQuery: '',
            startDate: null,
            endDate: null,
            products: {
                data: [],
                current_page: 1,
                last_page: 1,
                next_page_url: null,
                prev_page_url: null,
                path: '',
                per_page: 3,
            }
        };
    },
    mounted() {
        this.fetchProducts('http://127.0.0.1:8000/api/products');
        console.log(this.products)
    },
    validations() {
        return {
            startDate: {
                required: helpers.withMessage('Por favor, seleccione una fecha de inicio.', required)
            },
            endDate: {
                required: helpers.withMessage('Por favor, seleccione una fecha de fin.', required),
                minValue: helpers.withMessage('La fecha de fin debe ser mayor o igual a la fecha de inicio.', (value) => {
                    const startDate = new Date(this.startDate);
                    const endDate = new Date(value);
                    return endDate >= startDate;
                })
            }
        }
    },
    methods: {
        getProducts(url = 'http://127.0.0.1:8000/api/products') {
            fetch(url)
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
        debouncedSearch: debounce(function () {
            let url = `http://127.0.0.1:8000/api/products`;

            if (this.searchQuery) {
                url += `?search=${encodeURIComponent(this.searchQuery)}&per_page=${this.products.per_page}`;
            }

            if (this.startDate || this.endDate) { // Pendiente de probar el && en la condicion!!!.
                this.v$.$validate();

                if (!this.v$.startDate.$invalid && !this.v$.endDate.$invalid) {
                    const startDateParam = encodeURIComponent(this.startDate);
                    const endDateParam = encodeURIComponent(this.endDate);

                    if (url.includes('?')) {
                        url += `&startDate=${startDateParam}&endDate=${endDateParam}&per_page=${this.products.per_page}`;
                    } else {
                        url += `?startDate=${startDateParam}&endDate=${endDateParam}&per_page=${this.products.per_page}`;
                    }
                }
            }

            this.fetchProducts(url);

        }, 300),
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
        fetchProducts(url) {
            console.log(url);
            if (url.includes('?')) {
                url += `&per_page=${this.products.per_page}`;
            } else {
                url += `?per_page=${this.products.per_page}`;
            }
            fetch(url)
                .then(response => {
                    if (response.ok)
                        return response.json();
                    throw new Error(response.status);
                })
                .then(data => {
                    this.products = data;
                    console.log(this.products)
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        isInDateRange(startDate, endDate) {
            const currentDate = new Date();
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            return currentDate >= startDate && currentDate <= endDate;
        },
        resetFilters() {
            this.searchQuery = '';
            this.startDate = null;
            this.endDate = null;
            this.v$.$reset();
            this.getProducts();
        },
        generarReportePDF() {
            if (this.products.data.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay productos para generar el reporte.',
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
                return;
            }

            fetch('http://127.0.0.1:8000/api/products/reporte-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.products.data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al generar el reporte');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                    const filename = `products_${timestamp}.pdf`;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error al generar el reporte:', error);
                });
        },
        generarReporteExcel() {
            if (this.products.data.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay productos para generar el reporte.',
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                });
                return;
            }

            fetch('http://127.0.0.1:8000/api/products/reporte-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.products.data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al generar el reporte');
                    }
                    return response.arrayBuffer();
                })
                .then(buffer => {
                    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                    const filename = `products_${timestamp}.xlsx`;
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error al generar el reporte:', error);
                });
        }
    },
    components: { RouterLink }
}
</script>
