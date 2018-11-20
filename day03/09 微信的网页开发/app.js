const express=require("express")
const handleRequest=require("./reply/handleRequest")
const Wechat=require("./wechat/wechat")
const {appID,url}=require("./config")
const sha1=require("sha1")

const app=express()
const wechat =new Wechat()

app.set('views', 'views');
app.set('view engine', 'ejs');

/*
   微信签名算法：
     1. 得到参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）
     2. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1
     3. 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
  */

app.get("/search",async (req,res)=>{
    const {ticket} = await wechat.fetchTicket()
    const noncestr = Math.random().toString().split(".")[1]
    const timestamp = Math.floor(Date.now()/1000)
    const str = [`jsapi_ticket=${ticket}`,`noncestr=${noncestr}`,`timestamp=${timestamp}`,`url=${url}/search`].sort().join("&")
    const signature=sha1(str)
/*
    console.log("-------")
    console.log(ticket,"ticket")
    console.log(signature,"signature")
    console.log(noncestr,"noncestr")
    console.log(timestamp,"timestamp")
*/
    res.render("search",{
      signature,
      appID,
      noncestr,
      timestamp
    })
})

app.use(handleRequest())



app.listen(4000,err=>{
   if(!err)console.log("服务器启动成功")
   else console.log(err)
})
