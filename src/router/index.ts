import { createRouter,createWebHistory,RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path:'/',
        name:'login',
        component:()=>import('../login.vue')
    },
    {
        path:'/register',
        name:'Register',
        component:()=>import('../register.vue')
    },
    {
        path:'/A',
        name:'AA',
        component:()=>import('../A.vue')
    },
    {
        path:'/B',
        name:'BB',
        component:()=>import('../B.vue')
    },
    {
        path:'/index',
        name:'da',
        component:()=>import('../index.vue'),
        children:[
            {
                path:'/home',
                name:'Home',
                component:()=>import('../home.vue')
            },
        ]
    },
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

console.log(router)

export default router