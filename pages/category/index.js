var app = getApp()
Page({
    data: {
        longitude:0,
        latitude:0,
        id:0,
        shops: [],
        page:1,
        loadMore:true,
        noData:false
    },
    onLoad:function(options){
        var position = wx.getStorageSync('position') || {};
        this.setData({
            id: options.id,
            latitude:position.latitude,
            longitude:position.longitude
        });

        this.getShops(this.data.id,this.data.page);
    },
    getShops:function (id,page) {
        var that = this;
        if(that.data.loadMore){
            that.setData({loadMore:false})
            wx.request({
                url: 'xxx',
                data: {
                    id:id,
                    longitude:that.data.longitude,
                    latitude:that.data.latitude,
                    page:page
                },
                success: function (res) {
                    if (res.data.code == 0) {
                        console.log('获取分类数据成功');
                        wx.setNavigationBarTitle({
                            title: res.data.data.name
                        })
                        var list = res.data.data.shops;
                        var temp = that.addData(list)
                        console.log(temp);
                        if(list.length > 0){
                            that.setData({
                                shops:temp,
                                loadMore:true,
                                page:page + 1
                            });
                        }else{
                            that.setData({
                                noData:true,
                                loadMore:false
                            });
                        }
                    } else {
                        that.setData({
                            shops: null
                        });
                    }
                }
            })
        }else{
            if(that.data.noData){
                wx.showToast({
                    title:'已加载完'
                });
            }
        }
    },
    addData:function (arr) {
        var temp = this.data.shops;
        console.log(arr);
        if(arr.length > 0){
            for(var i=0;i<arr.length;i++){
                temp.push(arr[i]);
            }
        }
        return temp;
    },
    scrollToBottom: function(){
        this.getShops(this.data.id,this.data.page)
        console.log('pull-up');
    }
})