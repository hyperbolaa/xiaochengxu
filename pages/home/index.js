var app = getApp()
Page({
	data: {
        longitude:0,
        latitude:0,
		address: '武汉',
		icons: [],
		shops: [],
        page:1,
        loadMore:true,
        noData:false
	},
	onLoad: function () {
		this.getIcons();
        this.locate();
	},
	tapSearch: function () {
		wx.navigateTo({url: '../search/index'});
	},
	tapCategory: function (event) {
		var cate_id = event.currentTarget.dataset.id;
		wx.navigateTo({url:'../category/index?id='+cate_id})
	},
    locate:function () {
        wx.showLoading({title: '加载中'});
	    var that = this;
        wx.getLocation({
            type: 'wgs84',//wgs84:gps     gcj02:openLocation
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                console.log('定位成功');
                that.setData({
                    longitude:longitude,
                    latitude:latitude
                })
                var position={};
                position.latitude = latitude;
                position.longitude = longitude;
                wx.setStorageSync('position', position);//存储地理位置信息
                that.getShops(that.data.page)
            },
            fail:function () {
                wx.hideLoading();
                wx.openSetting({
                    success: function(res){
                        if (!res.authSetting["scope.userLocation"]) {
                            wx.showModal({
                                title: '提示',
                                content: '您拒绝了授权获取地理位置',
                                success: function(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    }
                })
            }
        });
    },
	getShops:function (page) {
		var that = this;
        if(that.data.loadMore){
            that.setData({
                loadMore:false
            })
            wx.request({
                url:'xxx',
                data:{
                    latitude:that.data.latitude,
                    longitude:that.data.longitude,
                    page:page
                },
                success:function(res){
                    setTimeout(function(){
                        wx.hideLoading()
                    },2000);
                    console.log('获取附近商家成功');
                    var city = res.data.data.city;
                    var list = res.data.data.list;
                    var temp = that.addData(list)
                    console.log(list)
                    if(list.length > 0){
                        that.setData({
                            address:city,//todo 根据IP获取城市名称
                            shops:temp,//异步加载数据
                            page:page + 1,
                            loadMore:true
                        })
                    }else{
                        that.setData({
                            noData:true,
                            loadMore:false
                        })
                    }
                },
                fail:function(){
                    wx.hideLoading();
                    console.log('获取附近商家失败');
                }
            });
        }else{
            wx.hideLoading();
            if(that.data.noData){
                wx.showToast({
                    title:'已加载完'
                });
            }
        }
    },
	getIcons:function () {
		var that = this;
		wx.request({
			url:'xxx',
			success:function (res) {
				console.log('图标加载成功');
				console.log(res);
				that.setData({
					icons:res.data.data
				})
            },
			fail:function (res) {
				console.log('图标加载失败');
            }
		})
    },
    addData:function (arr) {
        var temp = this.data.shops;
        if(arr.length > 0){
            for(var i=0;i<arr.length;i++){
                temp.push(arr[i]);
            }
        }

        return temp;
    },
    onPullDownRefresh: function(){
        this.getShops(1)
        console.log('pulldown');
        wx.stopPullDownRefresh()
    },
    scrollToBottom: function(){
        this.getShops(this.data.page)
        console.log('pull-up');
    }
});

