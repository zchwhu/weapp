var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({
    onLoad: function (option) {
        var globalData = app.globalData;
        var postId = option.id;
        this.setData({
            currentPostId: postId
        })
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setAudioMonitor();
    },
    setAudioMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            // callback
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId === that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: true
                    });
                }
            }
            app.globalData.g_isPlayingMusic = true;
        });
        wx.onBackgroundAudioPause(function () {
           var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId === that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: false
                    });
                }
            }
            app.globalData.g_isPlayingMusic = false;
        });
        wx.onBackgroundAudioStop(function() {
          that.setData({
              isPlayingMusic: false
          })
          app.globalData.g_isPlayingMusic = false;
          app.globalData.g_currentMusicPostId = null;
        })
    },
    onCollectionTap: function () {
        this.getPostsCollectedSync();
    },

    getPostsCollectedAsync: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                // success
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                wx.setStorageSync('posts_collected', postsCollected);
                that.setData({
                    collected: postCollected
                });
                wx.showToast({
                    title: postCollected ? "收藏成功" : "取消成功",
                    duration: 1000
                });
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    getPostsCollectedSync: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000
        });
    },
    showModal: function (postCollected, postsCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            showCancel: true,
            content: postCollected ? "收藏该文章" : "取消收藏该文章",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    that.setData({
                        collected: postCollected
                    });
                }
            }
        })
    },
    onShareTap: function (event) {
        var itemList = ["分享给微信好友", "分享到朋友圈", "分享到QQ", "分享到微博"];
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex]
                })
            }
        })
    },
    onMusicTap: function (event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio({
                success: function (res) {
                    // success
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            });
            this.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
        } else {
            var currentId = this.data.currentPostId;
            var postData = postsData.postList[currentId];
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
                success: function (res) {
                    // success
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            });
            this.setData({
                isPlayingMusic: true
            });
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    }
})