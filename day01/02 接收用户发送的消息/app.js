const express=require("express")
const sha1=require("sha1")
const {getUserData,parserXml,formatMessage}=require("./tools")


const app=express()

app.use(async (req,res,next)=>{
  /*console.log(req.method)*/
  // get 请求方式
  const config={
    appID:"wxf34878c2dbeb98c0",
    appsecret:"f709d496b0c74a0f70ab259ee386d003",
    Token:"atguiguHY0810"
  }
  const {signature,echostr,timestamp,nonce}=req.query
  const {Token}=config
  const str = sha1(  [Token,timestamp,nonce].sort().join("")  )
  //console.log(req.query)


  if(req.method==="GET"){

     if(str===signature){
         // 意味着这是微信服务器发送过来的请求
         console.log("ok")
         res.end(echostr)
     }else{
        // 不是微信服务器发送过来的请求
        res.end("error")
     }
  }else if(req.method==="POST"){
      // POST请求方式
      // 需要解析微信服务器发送过来的请求参数 以前的内置中间件和第三方中间件都无法做到了
      // 所以需要靠 req对象的一个方法实现 而且里面读的还是Buffer数据
      if(str!==signature){
        // 不是来自微信服务器的请求
        res.end("error")
        return
      }
      const xml=await getUserData(req)
      console.log(xml)  // 得到xml数据 需要将xml 数据转换成js对象
      /*
      <xml><ToUserName><![CDATA[gh_1f68b5af50b7]]></ToUserName>
      <FromUserName><![CDATA[oq9AG1h4tqNe6Vw_iLdevp_ICELE]]></FromUserName>
      <CreateTime>1542371804</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[111]]></Content>
      <MsgId>6624436456902636651</MsgId>
      </xml>
      *
      * */
      const data = await parserXml(xml)
      console.log(data)
      // 通过parserXml得到的对象 仍然需要格式化一样
      const finalData=formatMessage(data)
      let content="你在说什么,我听不懂"

      // 根据用户的输入结果 设置不同的回复信息
      if(finalData.Content==="1"){
          content="大杀四方"
      }else if(finalData.Content==="2"){
          content="德玛西亚"
      }else if(finalData.Content.includes("爱")){
          content="么么哒"
      }
      /*
       <xml>
             <ToUserName>< ![CDATA[toUser] ]></ToUserName>
             <FromUserName>< ![CDATA[fromUser] ]></FromUserName>
             <CreateTime>1348831860</CreateTime>
             <MsgType>< ![CDATA[text] ]></MsgType>
             <Content>< ![CDATA[this is a test] ]></Content>
             <MsgId>1234567890123456</MsgId>
       </xml>
      * */
      // 返回响应的时候 数据格式要是xml形式
      const resultMessage=`<xml>
                         <ToUserName><![CDATA[${finalData.FromUserName}]]></ToUserName>
                         <FromUserName><![CDATA[${finalData.ToUserName}]]></FromUserName>
                         <CreateTime>${Date.now()}</CreateTime>
                         <MsgType><![CDATA[text]]></MsgType>
                         <Content><![CDATA[${content}]]></Content>
                         </xml>`


      res.send(resultMessage)


  }else{
     // 其他请求方式
     res.end("error")
  }

})



app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)

})

