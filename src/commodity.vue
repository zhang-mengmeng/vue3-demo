<template>

    <el-card>
        <el-form ref="fromRef" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="商品ID">
                <el-input v-model="formInline.id" placeholder="请输入商品ID" clearable />
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="formInline.name" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="商品价格">
                <el-input v-model="formInline.price" placeholder="请输入商品价格" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
                <el-button type="primary" @click="onaborts">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button style="margin-bottom: 10px;" @click='dialogVisible = true'>新增</el-button>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="商品ID" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="price" label="商品价格" />
            <el-table-column prop="dt" label="创建时间" />
            <el-table-column prop="address" label="操作">
                <template #default="scoped">
                    <div>
                        <el-button @click="handleEdit(scoped.$index, scoped.row)" link type="primary" size="small">
                            修改
                        </el-button>
                        <el-button link type="primary" size="small"
                            @click="handledel(scoped.$index, scoped.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <Dialogvue ref="dialogref" v-model="dialogVisible"></Dialogvue>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus'
import Dialogvue from './dialog.vue'
const dialogVisible = ref(false)
const dialogref = useTemplateRef<InstanceType<typeof Dialogvue>>('dialogref')
const fromRef = useTemplateRef<FormInstance>('fromRef')
const tableData = ref([])
const formInline = reactive({
    id: '',
    name: '',
    price: '',
})

const onSubmit = () => {
    const queryParams = new URLSearchParams(formInline).toString();
    fetch(`http://localhost:3000/commodity?${queryParams}`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            'authorization':localStorage.getItem('token') as string
        },
    }).then(res => {
        return res.json()
    }).then(res => {
        tableData.value = res.data
        console.log(res.data)
    })
}
onSubmit()
const handleEdit = (index: number, data: Object) => {
    dialogref.value?.feedBack(data)
    dialogVisible.value = true
}
type Data = {
    id: string,
    name: string,
    price: number
}
const handledel = (index: number, data: Data) => {
    const id = data.id
    console.log(id)
    fetch(`http://localhost:3000/commodity/${id}`, {
        method: 'delete',
        headers: {
            "Content-Type": "application/json",
            'authorization':localStorage.getItem('token') as string
        }
    }).then(res => {
        return res.json()
    }).then(res => {
        if (res.code == 200) {
            ElMessage.success(res.msg)
            setTimeout(() => {
                onSubmit()
            }, 500)
        }
        console.log(res)
    })
}

const onaborts = () => {
    formInline.id = ''
    formInline.name = ''
    formInline.price = ''
    setTimeout(() => {
        onSubmit()
    }, 500)
}

watch(dialogVisible, (newValue) => {
    if (!newValue) {
        setTimeout(() => {
            onSubmit()
        }, 500)
    }
})

</script>
<style scoped>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}
</style>