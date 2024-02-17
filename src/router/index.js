import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ProductList from '../views/ProductList.vue'
import ProductNew from '../views/ProductNew.vue'
import ProductEdit from '../views/ProductEdit.vue'
import ProductView from '../views/ProductView.vue'
import CategoryList from '../views/CategoryList.vue'
import CategoryNew from '../views/CategoryNew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/products',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/product/new',
      name: 'ProductNew',
      component: ProductNew
    },
    {
      path: '/product/edit/:id',
      name: 'ProductEdit',
      component: ProductEdit
    },
    {
      path: '/product/view/:id',
      name: 'ProductView',
      component: ProductView
    },
    {
      path: '/categories',
      name: 'CategoryList',
      component: CategoryList
    },
    {
      path: '/category/new',
      name: 'CategoryNew',
      component: CategoryNew
    }
  ]
})

export default router
