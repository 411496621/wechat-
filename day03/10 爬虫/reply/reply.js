
const {url}=require("../config")
module.exports=message=>{
    /*
    * `<xml><ToUserName><![CDATA[${finalMessage.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${finalMessage.ToUserName}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
        </xml>`
    * */
    // 根据 finalMessage设置配置对象来决定 返回的内容
    let options={
        toUserName:message.FromUserName,
        fromUserName:message.ToUserName,
        createTime:Date.now(),
        msgType:"text"
    }
    let content="你在说什么,我听不懂"
    // 根据用户发送过来的消息的内容 决定要反馈的内容
    if(message.MsgType==="text"){
         // 如果用户发送的是文本消息
        if(message.Content==="1"){
          content="具体课程请查看尚硅谷官网"
        }else if(message.Content==="2"){
          content="德玛西亚"
        }else if(message.Content.includes("爱")){
          content="么么哒"
        }else if(message.Content==="3"){
          // 回复图文消息
          options.msgType="news"
          options.title="测试一下"
          options.description="hy的测试"
          options.picUrl="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543148941&di=a2461e40c65ec33834949396d1dbe311&imgtype=jpg&er=1&src=http%3A%2F%2Fwx1.sinaimg.cn%2Forj360%2Fc30a9e68gy1frsa4knexzj21e00rsdnq.jpg"
          options.url="http://www.atguigu.com"
        }else if(message.Content==="4"){
          content=`<a href="${url}/search">search页面</a>`
        }

    }else if(message.MsgType==="voice"){
         // 根据发送过来的语音 返回识别语音后的文本
         content=message.Recognition
    }else if(message.MsgType==="location"){
         content=`纬度:${message.Location_X} 经度:${message.Location_Y} 缩放大小:${message.Scale} 位置详情:${message.Label}`
    }else if(message.MsgType==="event"){
          //如果是用户触发了事件
          if(message.Event==="subscribe"){
              //用户关注了微信公众号
              content="欢迎您关注公众号"
              if(message.EventKey){
                // 通过二维码扫描 关注了公众号
                  content="欢迎您通过扫码关注了公众号"
              }
          }else if(message.Event==="unsubscribe"){
              console.log("有一名用户取消了关注")
          }else if(message.Event==="LOCATION"){
              content=`经度:${message.Latitude} 纬度:${message.Longitude}`
          }else if(message.Event==="CLICK"){
              content=`用户点击了 ${message.EventKey}`
          }
    }
    options.content=content
    return options
}
