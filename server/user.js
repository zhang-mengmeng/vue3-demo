import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
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

const now = dayjs();
function getTimeOfDay(time) {
    const hour = time.hour();
  
    if (hour >= 5 && hour < 12) {
      return '早上';
    } else if (hour >= 12 && hour < 14) {
      return '中午';
    } else if (hour >= 14 && hour < 18) {
      return '下午';
    } else {
      return '晚上';
    }
  }
  
  // 获取时间段
  const timeOfDay = getTimeOfDay(now);
  
  console.log(`当前时间段是：${timeOfDay}`);

  router.get('/sse',(req,res)=>{
    res.writeHead(200,{
        'content-type':'text/event-stream'
    })
    const txt = timeOfDay+'好,现在是北京时间'+dayjs().format('YYYY-MM-DDTHH:mm:ss')
    const arr = txt.split('')
    let currnet = 0
    let timer = setInterval(()=>{
        if(currnet<arr.length) {
            res.write(`enent: time\n`)
            res.write(`data:${arr[currnet]}\n\n`)
            currnet ++
        }else{
            clearInterval(timer)
        }
    },300)
  })

export default router