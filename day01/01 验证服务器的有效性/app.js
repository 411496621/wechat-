const express=require("express")
const sha1=require("sha1")

const app=express()

/*
* { signature: '691ec177c00ea90b93d45aec4b14367eada09fd3',
  echostr: '3603885438751698426',
  timestamp: '1542352370',
  nonce: '1285322370' }
* */
const config={
  appID:"wxf34878c2dbeb98c0",
  appsecret:"f709d496b0c74a0f70ab259ee386d003",
  Token:"atguiguHY0810"

}

app.use((req,res,next)=>{
   const {signature,echostr,timestamp,nonce}=req.query
   const {Token}=config
   const str=sha1( [Token,timestamp,nonce].sort().join("") )
   if(str===signature){
       console.log("yes")
       res.send(echostr)
   }else{
       res.send("error")
   }




})


app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)
})
