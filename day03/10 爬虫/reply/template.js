
module.exports=options=>{
   // 根据options的MsgType 来设置不同的xml数据格式的返回内容
  let message=`<xml>  
         <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>  
         <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName> 
         <CreateTime>${options.createTime}</CreateTime> 
         <MsgType><![CDATA[${options.msgType}]]></MsgType>`
  if(options.msgType==="text"){
       message+=`<Content><![CDATA[${options.content}]]></Content>`
  }else if(options.msgType==="image"){
       message+=`<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
  }else if(options.msgType==="voice"){
       message+=`<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
  }else if(options.msgType==="video"){
       message+=`<Video>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        <Title>< ![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
                </Video>`
  }else if(options.msgType==="music"){
        message+=`<Music>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.thumbMediaId}]]></ThumbMediaId>
                 </Music>`
  }else if(options.msgType==="news"){
        message+=`<ArticleCount>1</ArticleCount>
        <Articles>
             <item><Title><![CDATA[${options.title}]]></Title>
             <Description><![CDATA[${options.description}]]></Description>
             <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
             <Url><![CDATA[${options.url}]]></Url>
             </item>
         </Articles>`
  }
  message+=`</xml>`
  return message
}
