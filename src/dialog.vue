<template>
    <div>
        <el-dialog @close="modelValue = false" v-model="modelValue" title="提示" width="500px">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="modelValue = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import {reactive, useTemplateRef, watch, toRaw } from 'vue'
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus'
const formRef = useTemplateRef<FormInstance>('formRef')
const modelValue = defineModel<boolean>('modelValue', {
    required: true,
    default: false
})
const form = reactive({
    id: '',
    name: '',
    price: ''
})

watch(modelValue, (newvalue) => {
    if (newvalue) {
        formRef.value?.resetFields()
    }
})

const rules = {
    name: [
        {
            required: true,
            message: '请输入商品名称',
            tigger: 'blur'
        }
    ],
    price: [
        {
            required: true,
            message: '请输入商品价格',
            tigger: 'blur'
        }
    ],
}

const feedBack = (row: any) => {
    setTimeout(() => {
        Object.assign(form, row)
    }, 100)
}

defineExpose({
    feedBack
})

const submitForm = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            const body = toRaw(form)
            if (body.id) {
                fetch('http://localhost:3000/commodity',{
                    method:'put',
                    headers:{
                        'content-type': 'application/json',
                        'authorization':localStorage.getItem('token') as string
                    },
                    body:JSON.stringify(body)
                }).then(res =>{
                    return res.json()
                }).then(res =>{
                    if(res.code == 200) {
                        ElMessage.success(res.msg)
                        modelValue.value = false
                    }
                })
            } else {
                Reflect.deleteProperty(body, 'id')
                fetch('http://localhost:3000/commodity', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                        'authorization':localStorage.getItem('token') as string
                    },
                    body: JSON.stringify(body)
                }).then(res =>{
                    return res.json()
                }).then(res =>{
                    if(res.code == 200) {
                        ElMessage.success(res.msg)
                        modelValue.value = false
                    }
                })
            }
            console.log(body)
        }
    })
}
</script>