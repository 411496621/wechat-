module.exports =  {
  "button":[
    {
      "type":"click",
      "name":"戳我啊~",
      "key":"戳我啊~"
    },
    {
      "name":"硅谷动态",
      "sub_button":[
        {
          "type":"view",
          "name":"硅谷官网☀",
          "url":"http://www.atguigu.com/"
        },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示🌸",
          "key": "rselfmenu_0_0",
          "sub_button": [ ]
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件💋",
          "key": "rselfmenu_0_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图🎉",
          "key": "rselfmenu_1_0",
          "sub_button": [ ]
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1",
          "sub_button": [ ]
        },
      ]
    },
    {
      "name":"下拉菜单",
      "sub_button":[
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2",
          "sub_button": [ ]
        },
        {
          "name": "发送位置",
          "type": "location_select",
          "key": "rselfmenu_2_0"
        },
        {
          "type": "media_id",
          "name": "图片",
          "media_id":"18BP1e97zmbzd7Po79zX95bdjNPyJc74Zhy_85ED8-k"
        },
        {
          "type": "view_limited",
          "name": "图文消息",
          "media_id":'18BP1e97zmbzd7Po79zX93knKg0Hc6TOLzOESvJiyiE'
        }
      ]
    }
  ]
}
