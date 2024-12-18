import express from 'express'
import fs from 'fs'
import path from 'node:path'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
const router = express.Router()
const fslist = fs.readFileSync(path.join(process.cwd(), './commodity.json'))
function generateProductId() {
    const timestamp = Date.now(); // 当前时间戳
    const randomNum = Math.floor(Math.random() * 1000); // 0-999 的随机数
    return `PID${timestamp}${randomNum}`;
  }

let key = 'zhangmeng'

router.post('/',(req,res) =>{
    let token = req.headers.authorization
    jwt.verify(token,key,(err,decode) =>{
        if(err) {
            res.json({
                code:403,
                msg:'无权限'
            })
        }else {
            if (fslist.length == 0) {
                fs.writeFileSync(path.join(process.cwd(), './commodity.json'), JSON.stringify([{
                    id:generateProductId(),
                    name: req.body.name,
                    price: req.body.price,
                    dt:dayjs().format('YYYY-MM-DD HH:mm:ss')
                }]))
            }else {
                let product = JSON.parse(fslist)
                product.push({
                    id:generateProductId(),
                    name: req.body.name,
                    price: req.body.price,
                    dt:dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                fs.writeFileSync(path.join(process.cwd(), './commodity.json'), JSON.stringify(product))
            }
            res.json({
                code: 200,
                msg: '新增成功'
            })
        }
    })
})
router.get('/',(req,res) =>{
    let token = req.headers.authorization
    jwt.verify(token,key,(err,decode)=>{
        if(err) {
            res.json({
                code:200,
                msg:'无权限'
            })
        }else{
            const { name, price,id} = req.query
            let list = JSON.parse(fslist)
            const result = list.filter((item) =>{
                let numbers = true
                if(name) {
                    numbers = item.name.includes(name)
                }
                if(id) {
                    numbers = item.id.includes(id)
                }
                if(price) {
                    numbers = item.price.includes(price)
                }
                return numbers
            })
            res.json({
                code: 200,
                data: result
            })
        }
    })
})

router.delete('/:id',(req,res) =>{
    let token = req.headers.authorization
    jwt.verify(token,key,(err,decode)=>{
        if(err) {
            res.json({
                code:403,
                msg:'暂无权限'
            })
        }else {
            const datalist = JSON.parse(fslist)
            const id = req.params.id
            datalist.forEach((item,index) =>{
                if(item.id == id) {
                    datalist.splice(index,1)
                }
            })
            fs.writeFileSync(path.join(process.cwd(), './commodity.json'), JSON.stringify(datalist))
            res.json({
                code:200,
                msg:'删除成功'
            })
        }
    })
})

router.put('/',(req,res) =>{
    let token = req.headers.authorization
    jwt.verify(token,key,(err,decode)=>{
        if(err){
            res.json({
                code:403,
                msg:'暂无权限'
            })
        }else {
            const { id, name, price } = req.body
            const datalist = JSON.parse(fslist)
            datalist.forEach((item,index) =>{
                if(item.id == id) {
                    item.name = name
                    item.price = price
                }
            })
            fs.writeFileSync(path.join(process.cwd(), './commodity.json'), JSON.stringify(datalist))
            res.json({
                code:200,
                msg:'修改成功'
            })
        }
    })
})




export default router