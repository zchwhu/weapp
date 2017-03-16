// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");

Page({
  data: {
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    movies: {},
    isEmpty: true
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = '';
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.g_doubanBaseUrl + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.g_doubanBaseUrl + "/v2/movie/coming_soon";
        break;
      case "Top250":
        dataUrl = app.globalData.g_doubanBaseUrl + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {
        // success
      }
    })
  },
  processDoubanData: function (moviesDouban) {
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
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20;
  },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+movieId,
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