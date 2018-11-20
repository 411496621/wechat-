const puppeteer=require("puppeteer")

;(async ()=>{
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
   const result=await page.evaluate(()=>{
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
   console.log(result)
   // 关闭浏览器
   await browser.close()

})()
