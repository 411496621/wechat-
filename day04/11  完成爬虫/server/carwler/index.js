const puppeteer=require("puppeteer")

module.exports = async ()=>{
   // 打开浏览器
   const browser= await  puppeteer.launch({
     // 是否以无头模式 运行浏览器
     headless: false
   })
   // 打开新的标签页
   const page= await browser.newPage()
   // 进入指定网址
   await page.goto("https://movie.douban.com/coming",{waitUntil:"load"})
   // 等待页面加载完成 开始爬取数据
   let data=[]
   const arr=await page.evaluate(()=>{
      let result=[]
      $(".coming_list>tbody>tr").find("td:last").each(function () {
              let num= +$(this).html().split("人")[0]
              if(num>1000){
                  // 获取相关的链接地址
                 result.push($(this).siblings("td:eq(1)").children("a").attr("href"))
              }
      })
      return result
   })
   // 进行 第二次爬取数据
   for(var i=0;i<arr.length;i++){
       // 进入获取的每一个页面

       // 然后开始爬取数据
       try {
           await page.goto(arr[i],{waitUntil:"load"})

           let item = await page.evaluate(()=>{
             // 电影标题
             const $video=$(".related-pic-video")
             if(!$video.length){
               return null
             }
             // 预告片网址链接
             const href=$video.attr("href")
             // 海报
             const cover=$video.css("background-image").split('"')[1].split('?')[0]

             const title=$('[property="v:itemreviewed"]').text()
             // 电影评分
             const rating=$('[property="v:average"]').text()
             // 导演
             const director=$('[rel="v:directedBy"]').text()
             // 主演 以数组的形式存储
             let casts = []
             const $stars = $('[rel="v:starring"]')
             let length = $stars.length>3? 3:$stars.length
             for(var i = 0;i<length;i++){
               casts.push(  $($stars[i]).text() )
             }
             // 简介
             const summary = $.trim($('[property="v:summary"]').text())
             // 电影类型  以数组的形式存储
             let genre = []
             const  $genres = $('[property="v:genre"]')
             for(i = 0;i < $genres.length;i++){
               genre.push(  $($genres[i]).text()  )
             }
             // 上映地址和图片
             const releaseDate = $($('[property="v:initialReleaseDate"]')[0]).text()
             const image= $("[rel='v:image']").attr("src")
             return {href,cover,title,rating,director,casts,summary,genre,releaseDate,image}
           })
           if(item){
             item.doubanId=arr[i].split("subject/")[1].split("/")[0]
             data.push(item)
           }
       }catch (e) {

       }

   }
   // 进行第三次爬取数据
    for (var i = 0; i < data.length; i++) {
         // 进入指定页面  预告片页面
         await page.goto(data[i].href,{waitUntil:"load"})
         // 进入页面后 爬取数据
         const src = await page.evaluate(()=>{
               return $("video>source").attr("src")
         })
         data[i].src=src
         delete data[i].href
    }
   /* console.log(data)
    console.log(data.length)*/

   // 关闭浏览器
   await browser.close()
   return data
}
