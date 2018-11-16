const express=require("express")
const sha1=require("sha1")
const app=express()

app.use((req,res,next)=>{
  /*console.log(req.method)*/
  if(req.method==="GET"){
     // get 请求方式
    /*
      1. 搭建开发者服务器, 使用中间件接受请求
      2. 默认localhost:3000访问本地服务器， 需要一个互联网能够访问的域名地址
        借助ngrok工具，能将本地地址映射为互联网能访问的域名地址
      3. 测试号管理页面填写服务器配置：
        url：通过ngrok映射的地址   http://3389687c.ngrok.io
        token：参与微信签名加密的参数， 自己定义，尽量复杂
      4. 验证微信服务器有效性
        目的：验证消息来自于微信服务器， 同时返回一个特定参数给微信服务器（告诉微信服务器我这里准备ok）
      - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
      - 将排序后的参数拼接在一起，进行sha1加密
      - 加密后的到的就是微信签名，将其与微信发送过来的微信签名对比，
        - 如果一样，说明消息来自于微信服务器，返回echostr给微信服务器
        - 如果不一样，说明消息不是微信服务器发送过来的，返回error
    * */
     /*
     * { signature: 'f7de86354c88924d48159723b73d843ece8512ed', 微信签名
        echostr: '7153434016337559407', 微信后台生成随机字符串
        timestamp: '1542368623', 时间戳
        nonce: '527926167' }  微信后台生成随机数字

        微信签名 signature 是 timestamp nonce token 按大小 字母编号排序后 拼接成一个字符串
        然后通过sha1 加密得来的结果  所以判断发送请求的服务器是否是微信服务器
        只需要验证 他们三个加密的结果 与signature是否相等即可
     * */
     const config={
       appID:"wxf34878c2dbeb98c0",
       appsecret:"f709d496b0c74a0f70ab259ee386d003",
       Token:"atguiguHY0810"
     }
     const {signature,echostr,timestamp,nonce}=req.query
     const {Token}=config
     const str = sha1(  [Token,timestamp,nonce].sort().join("")  )
     if(str===signature){
         // 意味着这是微信服务器发送过来的请求
         console.log("ok")
         res.send(echostr)
     }else{
        // 不是微信服务器发送过来的请求
        res.send("error")
     }



  }



})



app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)

})

