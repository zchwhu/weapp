var app = getApp();
var util = require('../../utils/util.js');

Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.g_doubanBaseUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.g_doubanBaseUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.g_doubanBaseUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl,'inTheaters','正在热映');
    this.getMovieListData(comingSoonUrl,'comingSoon','即将上映');
    this.getMovieListData(top250Url,'top250','Top250');
  },

  getMovieListData: function (url,key,categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/xml"
      }, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res.data);
        that.processDoubanData(res.data,key,categoryTitle);
      },
      fail: function () {
        // fail
      }
    })
  },

  processDoubanData: function (moviesDouban,key,categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        stars: util.converToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[key] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  }
})