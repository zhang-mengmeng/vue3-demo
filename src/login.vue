<template>
    <div class="login">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>用户登录</span>
                </div>
            </template>
            <el-form ref="from" :rules="rules" :model="formInline" class="demo-form-inline">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="formInline.username" placeholder="请输入用户名称" clearable />
                </el-form-item>
                <el-form-item label="用户密码"  prop="password">
                    <el-input v-model="formInline.password" show-password placeholder="请输入用户密码" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login" style="width: 100%;">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="userregister" >用户注册</el-button>
                    <el-button type="text"  >忘记密码</el-button>
                </el-form-item>
               
            </el-form>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref} from "vue"
import { useRouter } from "vue-router";
import JSEncrypt from 'jsencrypt'
import type { FormItemRule,FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus'
const router = useRouter()
const from = ref<FormInstance>()
type formtype = {
    username:string,
    password:string
}

type Rules = {
    [K in keyof formtype]?:Array<FormItemRule>
}

const formInline = reactive<formtype>({
    username: '',
    password: ''
})

const rules = reactive<Rules>({
    username:[
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    ],
    password:[
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    ]
})


// 登录按钮
const login = () => {
    from.value?.validate((validata)=>{
        if(validata) {
            fetch('http://localhost:3000/user/login',{
                method:'post',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify(formInline)
            }).then(res =>{
                return res.json()
            }).then(res =>{
                if(res.code == 200) {
                    ElMessage.success(res.msg)
                    localStorage.setItem('token',res.token)
                    router.push({
                        path:'/index'
                    })

                }
            })
        }
    })

}

// 用户注册
const userregister = () => {
    router.push({
        name: 'Register'
    })
}


</script>
<style scoped lang="less">
.login {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-header {
    text-align: center;
}
</style>