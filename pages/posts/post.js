var postsData = require('../../data/posts-data.js');

Page({
    data: {
        
    },
    onLoad: function(){
        this.setData({
            postList:postsData.postList
        });
    }
})