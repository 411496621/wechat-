const prefix=`https://api.weixin.qq.com/cgi-bin/`
module.exports={
  accessToken:`${prefix}token?grant_type=client_credential`,
  tag:{
    create:`${prefix}tags/create?`,
    getUser:`${prefix}user/tag/get?`,
    batch:`${prefix}tags/members/batchtagging?`,
    getTidList:`${prefix}tags/getidlist?`
  }

}
