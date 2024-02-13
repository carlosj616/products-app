import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import ProductNew from '../views/ProductNew.vue'
import ProductEdit from '../views/ProductEdit.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: ProductList
    },
    {
      path: '/new',
      name: 'new',
      component: ProductNew
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: ProductEdit
    },
    {
      path: '/view/:id',
      name: 'view',
      component: ProductView
    }
  ]
})

export default router
