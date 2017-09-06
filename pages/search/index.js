var app = getApp();
Page({
    data: {
        focus:true,
        searchData:[],
        searchHistory:{},
        keyword:'',
        showSearchData:false
    },
    onShow: function () {
        var history = wx.getStorageSync('searchHistory') || {};
        this.setData({
            searchHistory: history
        });
        console.log('onLoad')
        console.log(this.data.searchHistory);
    },
    searchHandle: function(e){
        var that = this
        console.log();
        that.getSearchData(that.data.keyword);
    },
    searchConfirm: function(e){//执行搜索
        var that = this
        var value  = e.detail.value;
        that.setData({
            keyword: value
        });
        that.getSearchData(that.data.keyword);
    },
    searchFocus: function(e){
        var that = this
        var value  = e.detail.value;
        that.setData({
            keyword: value
        });
    },
    searchBlur: function(e){//失去焦点
        var that = this
        var value  = e.detail.value;
        that.setData({
            keyword: value
        });
    },
    searchKey:function(e){//搜索记录再次搜索
        var that = this
        var keyword = e.target.dataset.key;
        that.setData({
            keyword: keyword
        });
        that.getSearchData(keyword);
    },
    addKey:function (keyword) {
        console.log('关键词:'+keyword);
        var join = true;
        var history = wx.getStorageSync('searchHistory') || {};
        var temp = history.list || [];
        if(temp.length > 0){
            for(var i=0;i<temp.length;i++){
                if(temp[i] == keyword){
                    join = false;
                }
            }
            join &&  temp.unshift(keyword);
        }else{
            temp.push(keyword);
        }
        this.setHistory(temp);
    },
    delKey: function(e){//删除单个搜索记录
        var key = e.target.dataset.key;
        var history = wx.getStorageSync('searchHistory') || {};
        var temp = history.list;
        for(var i=0;i<temp.length;i++){
            if (temp[i] == key){
                temp.splice(i,1);
            }
        }
        this.setHistory(temp);
    },
    delAllKey: function(){//删除所有搜索记录
        var that = this;
        wx.removeStorage({
            key: 'searchHistory',
            success: function(res) {
                that.setData({
                    searchHistory: {}
                })
            }
        })
    },
    setHistory:function (list) {
        var histroty = {};
        var tempNumber = 0;
        if(list.length > 0){
            for(var i = 0;i<list.length;i++){
                tempNumber = tempNumber + 1
            }
        }
        histroty.list = list;
        histroty.num = tempNumber;
        this.setData({
            searchHistory: histroty
        });
        wx.setStorage({
            key:"searchHistory",
            data:histroty
        })
    },
    getSearchData:function (keyword) {
        var that = this
        if(typeof(keyword) == "undefined" || keyword.length == 0){return;}
        wx.request({
            url: 'xxx',
            data: {keyword: keyword},
            success: function (res) {
                if (res.data.code) {
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
                console.log(res.data.data);
                that.setData({
                    searchData: res.data.data,
                    showSearchData:true
                });
                that.addKey(keyword);
            }
        })
    }
});