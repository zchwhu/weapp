// pages/movies/movie-detail/movie-detail.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.g_doubanBaseUrl + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData);
  },
  processDoubanData: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: '',
      name: '',
      id: ''
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: util.converToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },
  viewMoviePostImg:function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
      success: function(res){
        // success
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