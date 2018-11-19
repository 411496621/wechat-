const {parseString}=require("xml2js")
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
   }
}

