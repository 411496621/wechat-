const mongoose=require("mongoose")
// 获取模式对象
const Schema=mongoose.Schema
// 创建约束对象
trailersSchema=new Schema({
  cover:String,
  title:String,
  rating:String,
  director:String,
  casts:[String],
  summary:String,
  genre:[String],
  releaseDate:String,
  image:String,
  src:String,
  doubanId:String
})
// 根据约束对象 创建模型对象
module.exports=mongoose.model("trailers",trailersSchema)
