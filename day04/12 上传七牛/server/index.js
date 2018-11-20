const db = require("../db")
const carwler = require("./carwler")
const save = require("./save")
;(async ()=>{
   await db
   // 数据库连接成功后  进行爬取数据
   const movies = await carwler()
   console.log(movies)
   console.log(movies.length)
   // 把数据存到数据库中
   await save(movies)

})()
