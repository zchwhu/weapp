Page({
    onLoad:function(event){
        wx.request({
          url: 'https://api.douban.com/v2/movie/top250',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
           header: {
               "Content-Type":"application/xml"
           }, // 设置请求的 header
          success: function(res){
            // success
            console.log(res.data);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
})