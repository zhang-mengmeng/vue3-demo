import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
const FS = fs.readFileSync(path.join(process.cwd(), './user.json'), 'utf-8',)

const FSDATA = (data) => {
    let listdata = JSON.parse(FS)
    listdata.push(data)
    FSPUSH(JSON.stringify(listdata))
}

const FSPUSH = (data) => {
    fs.writeFileSync(path.join(process.cwd(), './user.json'), data)
}

const router = express.Router()

router.post('/register', (req, res) => {
    const key = Buffer.from('uiTDvlckuR0qHfLC1Q8/wzyGQ5XUmzW3BiX4OrD1OFM=', 'base64')
    const iv = Buffer.from('GjOOkc4jKf6lgms+kuYuIA==', 'base64')

    let de = crypto.createDecipheriv('aes-256-cbc', key, iv)
    de.update(req.body.username, 'hex', 'utf-8')

    let dee = crypto.createDecipheriv('aes-256-cbc', key, iv)
    dee.update(req.body.password, 'hex', 'utf-8')
    let body = {
        username: de.final('utf-8'),
        password:dee.final('utf-8')
    }
    if (FS.length <= 0) {
        FSPUSH(JSON.stringify([body]))
        return res.json({
            code: 200,
            msg: '注册成功'
        })
    } else {
        let filelist = JSON.parse(FS)
        let a = true
        filelist.forEach((item, index) => {
            if (item.username == body.username) {
                res.json({
                    code: 201,
                    msg: '用户名已被注册'
                })
                a = false
            }
        });
        if (a) {
            FSDATA(body)
            res.json({
                code: 200,
                msg: '注册成功'
            })
        }
    }
})

router.get('/getinfo',(req,res) =>{
    let token = req.headers.authorization
    jwt.verify(token,key,(err,decode)=>{
        if(err) {
            res.json({
                code:403,
                msg:'无权限'
            })
        }else {
            res.json({
                route:[
                    {
                        path:'/commodity',
                        name:'Commodity',
                        component:'commodity.vue',
                        meta:{
                            title:'商品管理'
                        }
                    }
                ]
            })
        }
    })
})

let key = 'zhangmeng'

router.post('/login',(req,res) =>{
    const { username, password } = req.body
    let loginlist = JSON.parse(FS)
    loginlist.forEach((item) =>{
        if(item.username == username && item.password == password) {
            res.json({
                code:200,
                token:jwt.sign({username:username},key,{expiresIn:'1h'}),
                msg:'登录成功'
            })
        }else{
            res.json({
                code:500,
                msg:'登录失败'
            })
        }
    })
})


export default router