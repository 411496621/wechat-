const Trailers=require("../../models/trailers")

module.exports=async movies=>{
      // 把数据写入数据库里面
     for(let i=0;i<movies.length;i++){
          let item=movies[i]
          await Trailers.create(item)
     }
}
