const {parseString} = require("xml2js")
const {writeFile,readFile} = require("fs")
module.exports={
   getUserData(req){
       return new Promise((resolve,reject)=>{
              let userData=""
              req.on("data",data=>{ // Buffer数据
                  userData+=data.toString()
              })
              req.on("end",err=>{
                    if(!err){
                       resolve(userData)
                    }else{
                       reject(err)
                    }
              })
       })
   },
   xmlParse(xml){
        return new Promise((resolve,reject)=>{
              parseString(xml,{trim:true},(err,result)=>{
                  if(!err){
                     resolve(result)
                  }else{
                     reject(err)
                  }
              })
        })
   },
   formatMessage({xml}){
       let result={}
       for(let key in xml){
           result[key]=xml[key][0]
       }
       return result
   },
   writeData(filePath,data){
       return new Promise((res,rej)=>{
         writeFile(filePath,JSON.stringify(data),err=>{
           if(!err){
             res()
           }else{
             rej("writeData方法出错"+err)
           }
         })
       })
   },
   readData(filePath){
       return new Promise((res,rej)=>{
         readFile(filePath,(err,data)=>{
           if(!err){ // data数据为二进制数据
             res(JSON.parse(data.toString()))
           }else{
             rej("readData方法出了问题"+err)
           }
         })
       })
   }
}

