const sha1=require("sha1")
const {getUserData,xmlParse,formatMessage}=require("../tools")
const reply=require("./reply")
const template=require("./template")
const config=require("../config")

module.exports=()=>{
  return async(req,res,next)=>{
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
        const options=reply(finalMessage)
        const resMessage=template(options)

        res.send(resMessage)

      }else{
        res.end("error")
      }
  }
}


