const {parseString}=require("xml2js")


module.exports={
    getUserData(req){
        return new Promise( resolve=>{
             let result=""
             req.on("data",data=>{
                // Buffer数据
                result+=data.toString()
             })
             req.on("end",()=>{
                 resolve(result)
             })
        })
    },
    parserXml(xml){
      return new Promise((res,rej)=>{
          parseString(xml,{trim:true},(err,result)=>{
              if(!err){
                 res(result)
              }else{
                 rej(err)
              }
          })
      })
    },
    formatMessage({xml}){
         let obj={}
         for( let key in xml){
             obj[key]=xml[key][0]
         }
         return obj
    }

}
