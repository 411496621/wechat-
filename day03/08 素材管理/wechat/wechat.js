/*
* 获取access_token。
  1. 是什么？
    微信公众号的全局唯一接口调用凭据

    接口/api  application interface:
      1. url地址： 全称包含：请求方式、请求地址、请求参数、响应内容等
      2. 公共函数/方法
  2. 作用：
    使用access_token才能成功调用微信的各个接口
  3. 特点：
    1. access_token的存储至少要保留512个字符空间
    2. 有效期目前为2个小时，提前5分钟刷新
    3. 重复获取将导致上次获取的access_token失效，注意不要用别人的appid appseceret
    4. access_token接口调用时有限的，大概为2000次
  4. 请求地址
    https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  5. 请求方式：
    GET
  6. 请求成功的响应结果：
    JSON： {"access_token":"ACCESS_TOKEN","expires_in":7200}
  7. 发送请求：
    npm install --save request request-promise-native
  8. 设计：
    - 第一次发送请求，获取access_token，保存下来
    - 第二次读取之前保存的access_token，判断是否过期
      - 过期了, 重新发送请求，获取access_token，保存下来（覆盖之前的）
      - 没有过期, 直接使用
   整理：
     读取本地保存access_token（readAccessToken）
      - 有
        - 判断是否过期（isValidAccessToken）
          - 过期了, 重新发送请求，获取access_token（getAccessToken），保存下来（覆盖之前的）(saveAccessToken)
          - 没有过期, 直接使用
      - 没有
        - 发送请求，获取access_token，保存下来
*
* */
// 引入第三方模块 来发送GET请求
const rp=require("request-promise-native")
// 通过fs模块 来保存和读取accessToken的值
const {writeFile,readFile,createReadStream}=require("fs")
// 根据appID和appscrect获取accessToken
const {appID,appsecret}=require("../config")
const menu=require("./menu")
const api=require("../api")

class Wechat {
     async getAccessToken(){
        const url=`${api.accessToken}&appid=${appID}&secret=${appsecret}`
        // 异步任务 获取accessToken 不可能一瞬间获取完 所以需要用async
        const accessToken=await rp({method:"GET",url,json:true}) // 获取accessToken并且转换成js对象
        // 设置accessToken的过期时间
        accessToken.expires_in=Date.now()+ 7200000-1000*300
        return accessToken
     }
     saveAccessToken(filePath,accessToken){
        return new Promise((res,rej)=>{
            writeFile(filePath,JSON.stringify(accessToken),err=>{
                  if(!err){
                     res()
                  }else{
                     rej("saveAccessToken方法出错"+err)
                  }
            })
        })
     }
     readAccessToken(filePath){
         return new Promise((res,rej)=>{
               readFile(filePath,(err,data)=>{
                 if(!err){ // data数据为二进制数据
                    res(JSON.parse(data.toString()))
                 }else{
                    rej("readAccessToken方法出了问题"+err)
                 }
               })
         })
     }
     isInTime({expires_in}){
         // 为true的话 没有过期 为false的话 过期了
         return  Date.now()<=expires_in
     }
     // 返回有效的accessToken
     async fetchAccessToken(){
         //将获取到的accessToken对象的属性 保存在Wechat的实例对象上 利用对象属性的特性
         // 因为如果上来用writeFile直接读取accessToken的话
         // err对象为true
         // 如果调用了access  如果有accessToken并且没有过期的话 直接使用
         if(this.access_token&&this.expires_in&&this.isInTime(this)){
                console.log("进入if")
                return {access_token:this.access_token,expires_in:this.expires_in}
         }
         return this.readAccessToken("./accessToken.txt")
                 .then(async res=>{
                     // 箭头函数没有自己的this 它的this 看外层的函数的this
                     // 外层的this 指向实例对象
                     // 判断接受过来的accessToken是否过期
                     if(this.isInTime(res)){
                         // 没有过期 作为promise的 reslove(数据) 返回出去
                         return res
                     }else{
                         // 过期了  重新获取accessToken
                         const accessToken=await this.getAccessToken()
                         await this.saveAccessToken("./accessToken.txt",accessToken)
                         return accessToken
                     }
                 })
                 .catch(async ()=>{
                      // 文件里没有accessToken的数据 直接重新获取
                      const accessToken=await this.getAccessToken()
                      await this.saveAccessToken("./accessToken.txt",accessToken)
                      return accessToken
                 })
                 .then(async (accessToken)=>{
                      // 把accessToken的属性 赋值给实例对象 然后把属性返回出去
                      this.access_token=accessToken.access_token
                      this.expires_in=accessToken.expires_in
                      return accessToken
                 })
     }
     async createMenu(menu){
       try {
         const {access_token}=await this.fetchAccessToken()
         const url=`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
         const result=await rp({method:"POST",url,json:true,body:menu})
         return result
       } catch (e) {
         return 'createMenu方法出了问题：' + e;
       }
     }
     async deleteMenu(){
         try{
           const {access_token}=await this.fetchAccessToken()
           const url=`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`
           const result=await rp({method:"GET",url,json:true})
           return result
         }catch (e) {
           return "deleteMenu方法出了问题"+e
         }
     }
     /*创建标签*/
     async createTag(name){
        try {
          const {access_token}= await this.fetchAccessToken()
          const url=`${api.tag.create}access_token=${access_token}`
          const result= await rp({ method:"POST",url,json:true,body:{tag:{name} } })
          return result
        }catch (e) {
          return "createTag方法除了问题"+e
        }

     }
     // 获取标签下的粉丝列表
     async getTagUser(tagid,next_openid=""){
        try{
          const {access_token}= await this.fetchAccessToken()
          const url=`${api.tag.getUser}access_token=${access_token}`
          const result= await rp({ method:"POST",url,json:true,body:{tagid,next_openid}})
          return result
        }catch (e) {
          return "getTagUser方法除了问题"+e
        }

     }
     // 为制定用户打标签
     async batchTag(openid_list,tagid){
        try {
          const {access_token}= await this.fetchAccessToken()
          const url=`${api.tag.batch}access_token=${access_token}`
          const result= await rp({ method:"POST",url,json:true,body:{openid_list,tagid}})
          return result
        }catch (e) {
          return "batchTag方法出了问题"
        }

     }
     async getCurrentTag(){
        try{
          const {access_token}= await this.fetchAccessToken()
          const url=`${api.tag.getTidList}access_token=${access_token}`
          const result= await rp({ method:"POST",url,json:true })
          return result
        }catch (e) {
          return "getCurrentTag方法出了问题"+e
        }

     }
     async sendMessageByTag(options){
          try {
            const {access_token}= await this.fetchAccessToken()
            const url=`${api.send}access_token=${access_token}`
            const result=await rp({method:"POST",url,json:true,body:options})
            return result
          }catch (e) {
            return "sendMessageByTag方法出了问题"+e
          }
     }
     async uploadMaterial(type,material,body){
          try{
            const {access_token}= await this.fetchAccessToken()
            let url=``
            let options={method:"POST",json:true}

            if(type==="news"){
               url=`${api.upload.news}access_token=${access_token}`
               options.body=material
            }else if(type==="pic"){

               url=`${api.upload.pic}access_token=${access_token}`
               options.formData={
                  media:createReadStream(material)
               }

            }else{
               url=`${api.upload.media}access_token=${access_token}&type=${type}`
               options.formData={
                 media:createReadStream(material)
               }
               if(type==="video"){
                 options.body=body
               }
            }
            options.url=url
            return await rp(options)
          }catch (e) {
            return "uploadMaterial方法出了问题"+e
          }
     }
}
(async ()=>{
   const w=new Wechat()
   const result1 = await w.deleteMenu()
   console.log(result1)
   const result2 = await w.createMenu(menu)
   console.log(result2)
})()


/*(async ()=>{
   const w=new Wechat()
   const result1=await w.uploadMaterial("pic","./logo.png")
  /!*url: 'http://mmbiz.qpic.cn/mmbiz_png/FQibSlfQdVtAfVO1Qyzlmf0V3oyvXvkODMm9QqRKL2qvouczBTbP6vdPZIDQupw8ianSR7icsPjY3GpX8YjzYryEA/0'*!/
   console.log(result1)
   const result2=await w.uploadMaterial("image","./node.jpg")
   console.log(result2)
  /!*media_id: '18BP1e97zmbzd7Po79zX95bdjNPyJc74Zhy_85ED8-k',
  url: 'http://mmbiz.qpic.cn/mmbiz_png/FQibSlfQdVtAfVO1Qyzlmf0V3oyvXvkODfsUVx3KW5zkuGWrS0JWoOZ1VOUoHMaKMlPBn1VmqtLBYicr5HjicvaIA/0?wx_fmt=png'*!/
   const result3=await w.uploadMaterial("news",{
     "articles": [{
       "title": "我的测试",
       "thumb_media_id": result2.media_id,
       "author": "硅谷小编",
       "digest": "这是0810的测试",
       "show_cover_pic": 1,
       "content":`<!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                  </head>
                  <body>
                    <h1>微信公众号开发</h1>
                    <img src="${result1.url}">
                  </body>
                  </html>`,
       "content_source_url":"http:atguigu.com",
       "need_open_comment":1,
       "only_fans_can_comment":1
     },
     ]
   })
  /!*{ media_id: '18BP1e97zmbzd7Po79zX93knKg0Hc6TOLzOESvJiyiE' }*!/
   console.log(result3)

})()*/

/*(async ()=>{
   const w =new Wechat()
   const result=await w.sendMessageByTag({
     "filter":{
       "is_to_all":false,
       "tag_id":104
     },
     "text":{
       "content":"群发消息 这是我的一条测试消息"
     },
     "msgtype":"text"
   })
   console.log(result)
})()*/

/*(async ()=>{
  const w= new Wechat()
 /!* let result1= await w.createTag("1802") //{ tag: { id: 104, name: '1802' } }
  console.log(result1)*!/
/!*  let result2= await w.batchTag([
    "oq9AG1vc83ikLPF15dMe1JiPtEJ0",
    "oq9AG1vg0EH9ZXaHAcwCEMtBzIj0"
  ],104)
  console.log(result2)
  let result3= await w.getTagUser(104)
  console.log(result3)*!/

  /!*const w= new Wechat()
  let result1= await  w.getCurrentTag()
  console.log(result1)*!/

})()*/


/*
(async ()=>{
  const w= new Wechat()
  const result1= await w.deleteMenu()
  console.log(result1)
  const result2= await w.createMenu(menu)
  console.log(result2)
})()
*/


