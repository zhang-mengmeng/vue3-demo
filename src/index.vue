import router from './router/index';
<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                    default-active="2" text-color="#fff" @open="handleOpen" @close="handleClose" router>
                    <el-menu-item index="/home">
                        <el-icon><icon-menu /></el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-menu-item :index="item.path" v-for="(item, index) in list" :key="index">
                        <el-icon>
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="border-bottom: 1px solid gray;">
                    <div style="display: flex; justify-content: space-between;align-items: center;height: 100%;">
                        <p>左侧内容</p>
                        <el-button @click="tuichu">退出</el-button>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { reactive } from 'vue';
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const router = useRouter()



const list: any[] = reactive([])

const getinfo = () => {
    fetch('http://localhost:3000/user/getinfo', {
        method: 'get',
        headers: {
            'authorization': localStorage.getItem('token') as string
        },
    }).then(res => {
        return res.json()
    }).then((res) => {
        const parentRoute = router.options.routes.find(route => route.name == 'da')
        if (parentRoute && Array.isArray(res.route)) {
            res.route.forEach((v: any) => {
                parentRoute.children?.push({
                    path: v.path,
                    name: v.name,
                    meta: v.meta,
                    component: () => import(`../src/${v.component}`)
                })
            })
            router.addRoute(parentRoute)
        }
        list.push(...res.route)
    })
}
getinfo()


const tuichu = () =>{
    localStorage.clear()
    router.push({
        name:'login'
    })
}
</script>
<style scoped>
.el-menu-vertical-demo {
    height: 100vh;
    background-color: #545c64;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>