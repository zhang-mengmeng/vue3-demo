<template>
    <div class="login">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>用户注册</span>
                </div>
            </template>
            <el-form ref="form" :rules="rules" :model="formInline" class="demo-form-inline">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="formInline.username" placeholder="请输入用户名称" clearable />
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input v-model="formInline.password" placeholder="请输入用户密码" clearable show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register" style="width: 100%;">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { reactive,ref } from "vue"
import type { FormItemRule,FormInstance  } from "element-plus";
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import CryptoJS from 'crypto-js'
const router = useRouter()
const form = ref<FormInstance>()
type From = {
    username:string,
    password:string
}

type Rules = {
    [K in keyof From]?:Array<FormItemRule>
}

const formInline = reactive<From>({
    username: '',
    password: ''
})

const rules = reactive<Rules>({
    username:[
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 5,  message: '用户名最少为5位', trigger: 'blur' },
    ],
    password:[
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 5,  message: '用户名最少为5位', trigger: 'blur' },
    ]
})


const key = CryptoJS.enc.Base64.parse('uiTDvlckuR0qHfLC1Q8/wzyGQ5XUmzW3BiX4OrD1OFM='); // 32 字节的密钥
const iv = CryptoJS.enc.Base64.parse('GjOOkc4jKf6lgms+kuYuIA==');   // 16 字节的 IV
const plaintext = (data:string) =>{
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}
// 注册按钮
const register = () => {
    form.value?.validate((validate)=>{
        if(validate){
            fetch('http://localhost:3000/user/register',{
                method:'post',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify({
                    username:plaintext(formInline.username),
                    password:plaintext(formInline.password)
                })
            }).then(res =>{
                return res.json()
            }).then(data =>{
                if(data.code == 200) {
                    ElMessage.success(data.msg + ' ' + `${'跳转到登录页'}`)
                    router.push({
                        name:'login'
                    })
                }else {
                    ElMessage.error(data.msg)
                }
            })
        }else {
            ElMessage.error('请输入完整必填项')
        }
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
.card-header{
    text-align: center;
}
</style>