const routes = [
    { path: '/', component: httpVueLoader('./src/pages/home.vue'), name:"home" },
    { path: '/list', component: httpVueLoader('./src/pages/list.vue'), name:"list" },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: routes
})

// router.beforeEach((to,from,next)=>{
//     if (to.fullPath != "/" && localStorage.getItem("userId") == null){
//         next({path:'/'})
//     }else {
//         next()
//     }
// })
const { version } = Vue;

var vueElem = Vue.createApp({
    data(){
        return{
            version: version
        }
    }
})

vueElem.use(router);
vueElem.mount('#app');
