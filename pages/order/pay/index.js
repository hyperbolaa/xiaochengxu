//index.js
var app = getApp()
Page({
    data: {
        mallName:'塘角鱼',
        goodsList:[],
        allGoodsPrice:0,
        specStr:"",
        specIds:"",
        user:{}
    },
    onLoad: function (options) { //加载订单信息
        var that = this;
        var shopList = this.currentGoods(options.specIds);
        //var shopList = this.currentGoods('4,5');

        var allGoodsPrice = 0,price = 0;
        var specStr = "{";
        for (var i =0; i < shopList.length; i++) {
              var carShopBean = shopList[i];
              price = carShopBean.price * carShopBean.number;
              allGoodsPrice = this.accAdd(allGoodsPrice,price);
              var goodsJsonStrTmp = '';
              if (i > 0){
                goodsJsonStrTmp = ",";
              }
              goodsJsonStrTmp += '"'+ carShopBean.specId+'":'+ carShopBean.number;
              specStr += goodsJsonStrTmp;
        }
        specStr += "}";

        that.setData({
            goodsList:shopList,
            allGoodsPrice:allGoodsPrice,
            specStr:specStr
        })
    },
    onShow:function () {
        var that = this;
        var user = wx.getStorageSync('user');
        that.setData({
            user:user
        })
    },
    createOrder:function (e) {    //创建订单
        wx.showLoading({title: '加载中'});
        var that = this;
        //判断授权登录
        console.log('login phone',that.data.user.phone);
        console.log('login user',that.data.user);
        if(that.data.user && that.data.user.openid){
            if(that.data.user.phone){
                var remark = e.detail.value.remark;
                var postData = {
                    specStr: that.data.specStr,
                    remark: remark,
                    phone:that.data.user.phone
                };

                wx.request({
                    url: 'xxx',
                    method:'GET',
                    data: postData, // 设置请求的 参数
                    success: function (res) {
                        wx.hideLoading();
                        console.log(res.data);
                        if(res.data.code == 0){
                            var data   = res.data.data;
                            wx.requestPayment({
                                timeStamp:data.timeStamp,
                                nonceStr:data.nonceStr,
                                package:data.package,
                                signType:data.signType,
                                paySign:data.paySign,
                                success:function(res){
                                    // 清空购物车数据
                                    that.updateCart();
                                    console.log('支付成功');
                                    console.log(res);
                                    wx.showToast({title: '支付成功'})
                                    wx.navigateTo({url:'/pages/order/list/index'})
                                },
                                fail:function(res){
                                    console.log('支付失败');
                                    console.log(res);
                                    wx.showModal({
                                        title: '',
                                        content: '您已取消支付',
                                        showCancel:false,
                                        success:function(res){
                                            if(res.confirm){
                                                wx.navigateTo({url:'/pages/order/list/index'})
                                            }
                                            return;
                                        }
                                    });
                                }
                            });
                        }else{
                            wx.showToast({
                                title: res.data.msg
                            });
                        }
                    }
                })
            }else{
                wx.navigateTo({url:'/pages/login/index'});
            }
        }else{
            app.getUserInfo();
        }
        return;
    },
    updateCart:function () {   //删除购物车中提交订单的数据
        var specIdArr = this.data.specIds.split(',');
        var shopList = wx.getStorageSync('shopCarInfo');
        var list = shopList.shopList;
        for(var j=0;j<specIdArr.length;j++){
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                if(curItem.specId == specIdArr[j]){
                    list.splice(i,1);
                }
            }
        }
        var shopCarInfo = {};
        var tempNumber = 0;
        shopCarInfo.shopList = list;
        for(var k = 0;k<list.length;k++){
            tempNumber = tempNumber + list[k].number
        }
        shopCarInfo.shopNum = tempNumber;

        wx.setStorage({
            key:"shopCarInfo",
            data:shopCarInfo
        })
    },
    currentGoods:function (specIds) {   //提取购物车中购物的数据
        var specIdArr = specIds.split(',');
        var shopList = wx.getStorageSync('shopCarInfo');
        var list = shopList.shopList;
        var current = [];

        for(var j=0;j<specIdArr.length;j++){
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                if(curItem.specId == specIdArr[j]){
                    current.push(curItem)
                }
            }
        }
        return current;
    },
    accAdd:function(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    },
})
