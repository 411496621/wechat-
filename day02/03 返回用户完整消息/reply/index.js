

module.exports=options=>{
    // option里面有很多参数 返回的消息内容是options里面的数据
    // 根据msgType的类型决定content
    let result=`<xml><ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
        <CreateTime>${options.createTime}</CreateTime>
        <MsgType><![CDATA[${options.msgType}]]></MsgType>`

    if(options.msgType==="text"){
           result+=`<Content><![CDATA[${options.content}]]></Content>`
    }else if(options.msgType==="image"){
           result+=`<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    }else if(options.msgType==="voice"){
           result+=`<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
    }else if(options.msgType==="video"){
           result+=`<Video>
                      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                      <Title><![CDATA[${options.title}]]></Title>
                      <Description><![CDATA[${options.description}]]></Description>
                    </Video>`
    }else if(options.msgType==="music"){
          result+=`<Music>
                      <Title><![CDATA[${options.title}]]></Title>
                      <Description><![CDATA[${options.description}]]></Description>
                      <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
                      <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
                      <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
                  </Music>`
    }else if(options.msgType==="news"){
         result+=`<ArticleCount>1</ArticleCount>
          <Articles>
                 <item>
                 <Title><![CDATA[${options.title}]]></Title> 
                 <Description><![CDATA[${options.description}]]></Description>
                 <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
                 <Url><![CDATA[${options.url}]]></Url>
                 </item>
           </Articles>`
    }
    result+=`</xml>`
    return  result
}
