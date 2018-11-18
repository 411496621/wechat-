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
const rs=require("request-promise-native")
// 通过fs模块 来保存和读取accessToken的值
const {writeFile,readFile}=require("fs")
// 根据appID和appscrect获取accessToken
const {appID,appsecret}=require("../config")
const menu=require("./menu")

class Wechat {
     async getAccessToken(){
        const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
        // 异步任务 获取accessToken 不可能一瞬间获取完 所以需要用async
        const accessToken=await rs({method:"GET",url,json:true}) // 获取accessToken并且转换成js对象
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
         const result=await rs({method:"POST",url,json:true,body:menu})
         return result
       } catch (e) {
         return 'createMenu方法出了问题：' + e;
       }
     }
     async deleteMenu(){
         try{
           const {access_token}=await this.fetchAccessToken()
           const url=`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`
           const result=await rs({method:"GET",url,json:true})
           return result
         }catch (e) {
           return "deleteMenu方法出了问题"+e
         }
     }
}

(async ()=>{
  const w= new Wechat()
  const result1= await w.deleteMenu()
  console.log(result1)
  const result2= await w.createMenu(menu)
  console.log(result2)
})()


