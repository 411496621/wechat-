const express=require("express")
const handleRequest=require("./reply/handleRequest")

const app=express()
app.use(handleRequest())

app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)
})
