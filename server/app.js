import express from 'express'
import user from './user.js'
import commodity from './commodity.js'
const app = express()

app.use('*',(req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','content-type,authorization')
    res.setHeader('Access-Control-Allow-Methods','DELETE,PUT')
    next()
})

app.use(express.json())

app.use('/user',user)
app.use('/commodity',commodity)
app.listen(3000,()=>{
    console.log('服务启动成功')
})