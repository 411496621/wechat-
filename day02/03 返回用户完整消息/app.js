const express=require("express")
const sha1=require("sha1")
const {getUserData,xmlParse,formatMessage}=require("./tools")
const template=require("./reply")

const app=express()

app.use(async (req,res,next)=>{

   //console.log(req.query)
   const config={
     appID:"wxf34878c2dbeb98c0",
     appsecret:"f709d496b0c74a0f70ab259ee386d003",
     token:"atguiguHY0810"
   }
   const {signature,echostr,timestamp,nonce} =req.query
   const str= sha1([timestamp,nonce,config.token].sort().join(""))
   if(req.method==="GET"){
      if(str===signature){
         // 是微信服务器发过来的响应
        console.log("ok")
        res.end(echostr)
      }else{
         // 不是微信服务器发过来的响应
         res.end("error")
      }

   }else if(req.method==="POST"){
       if(str!==signature){
          res.end("error")
          return
       }
       // 解析用户发送过来的消息
       const xml=await getUserData(req)
      /*
        <xml><ToUserName><![CDATA[gh_1f68b5af50b7]]></ToUserName>
        <FromUserName><![CDATA[oq9AG1h4tqNe6Vw_iLdevp_ICELE]]></FromUserName>
        <CreateTime>1542379669</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[ 11]]></Content>
        <MsgId>6624470236820419705</MsgId>
        </xml>
      * */
       const message=await xmlParse(xml)
       //console.log(message)
       const finalMessage=formatMessage(message)
       // 获取到对象形式的用户的信息
       // 根据用户发送的消息内容的不同 返回不同的内容
       let options={
           toUserName:finalMessage.FromUserName,
           fromUserName:finalMessage.ToUserName,
           createTime:Date.now(),
           msgType:"text"
       }

       let content="你在说什么,我听不懂"
       if(finalMessage.Content==="1"){
            content="具体课程请查看尚硅谷官网"
       }else if(finalMessage.Content==="2"){
            content="德玛西亚"
       }else if(finalMessage.Content.includes("爱")){
            content="么么哒"
       }else if(finalMessage.Content==="3"){
              options.msgType="news"
              options.title="测试一下"
              options.description="myTest"
              options.picUrl="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542436281363&di=952c6e909a58bfa7605d15ef04967ca1&imgtype=0&src=http%3A%2F%2Fwx1.sinaimg.cn%2Forj360%2Fc30a9e68gy1frsa4knexzj21e00rsdnq.jpg"
              options.url="http://atguigu.com"
       }
       options.content=content
       const resMessage=template(options)
       res.send(resMessage)

   }else{
        res.end("error")
   }

})


app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)
})
