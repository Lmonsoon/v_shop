import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('../components/contet/Login.vue');
const Home = () =>
    import ('../components/contet/Home.vue');
Vue.use(VueRouter)
const Welcome = () =>
    import ('../views/Welcome.vue')
const User = () =>
    import ('../views/user/User.vue')
const Log = () =>
    import ('../views/login/Log.vue')
const Roles = () =>
    import ('../views/login/Roles')
const Cate = () =>
    import ('../views/goods/Cate')
const Params = () =>
    import ('../views/goods/Params')
const List = () =>
    import ('../views/goods/List')
const Add = () =>
    import ('../views/goods/Add')
const Order = () =>
    import ('../views/order/Order')
const Report = () =>
    import ('../views/report/Report')
const routes = [{
        path: '/',
        redirect: '/login'

    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [{
                path: '',
                redirect: 'Welcome'
            },
            {
                path: 'Welcome',
                name: 'Welcome',
                component: Welcome
            },
            {
                path: 'users',
                name: 'User',
                component: User
            },
            {
                path: 'rights',
                name: 'Log',
                component: Log
            },
            {
                path: 'roles',
                name: 'Roles',
                component: Roles
            },
            {
                path: 'categories',
                name: 'Cate',
                component: Cate
            },
            {
                path: 'params',
                name: 'Params',
                component: Params
            },
            {
                path: 'goods',
                name: 'List',
                component: List,

            },
            {
                path: 'goods/add',
                name: 'Add',
                component: Add
            },
            {
                path: 'orders',
                name: 'Order',
                component: Order
            },
            {
                path: 'reports',
                name: 'Report',
                component: Report
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    //${//to and from are Route Object,next() must be called to resolve the hook}
    if (to.path === '/login') return next();
    const tokenStr = sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})
export default router