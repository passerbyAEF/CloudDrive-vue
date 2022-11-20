import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './src/App.vue'

let routes = [
    {
        path: '/',
        component: () => import('Main@/Main.vue'),
        mode: "history"
    },
    {
        path: '/login',
        component: () => import('Login@/App.vue'),
        mode: "history"
    },
]

let router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

createApp(App).use(router).mount('#app')
