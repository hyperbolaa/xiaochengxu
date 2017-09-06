var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        goods:[],
        shop:[]
    },
    onLoad: function(options) {
        var that = this
        wx.request({
            url: 'xxx',
            method: 'GET',
            data: {id:options.id},
            //data: {id:18},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                console.log('获取店铺商品成功');
                console.log(res);
                that.setData({
                    goods: res.data.data.goods,
                    shop: res.data.data.shop
                });
                WxParse.wxParse('article', 'html', res.data.data.shop.course, that);
            },
            fail:function(){
                console.log('获取店铺商品失败');
            }
        })
    },
    phoneCall:function (e) {
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    location:function (e) {//ios  的精度纬度必须转换为数字类型，否则打不开
        var latitude = Number(e.currentTarget.dataset.latitude);
        var longitude = Number(e.currentTarget.dataset.longitude);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            fail:function () {
                wx.showToast({title: '调用地图失败'})
            }
        })
    }

})