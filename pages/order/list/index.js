var app = getApp()
Page({
    data:{
        statusType:["全部","待付款","已完成"],
        currentType:0,
        user:{},
        orderList:null
    },
    statusTap:function(e){
        var curType =  e.currentTarget.dataset.index;
        this.setData({
            currentType:curType,
        });
        this.onShow();
    },
    onLoad:function () {
        var user = wx.getStorageSync('user');
        this.setData({
            user:user
        });
    },
    onShow:function(){
        // 获取订单列表
        wx.showLoading({title: '加载中'});
        var that = this;
        var postData = {};
        if (that.data.currentType == 0) {
            postData.status = 0
        }
        if (that.data.currentType == 1) {
            postData.status = 1
        }
        if (that.data.currentType == 2) {
            postData.status = 2
        }
        postData.phone = that.data.user.phone;
        wx.request({
            url: 'xxx',
            data: postData,
            success: function (res) {
                wx.hideLoading();
                console.log(res.data.data);
                if (res.data.code == 0) {
                    that.setData({
                        orderList: res.data.data
                    });
                } else {
                    this.setData({
                        orderList: null
                    });
                }
            }
        })

    },
    tapOrderDetail : function (e) {
        var orderSn = e.currentTarget.dataset.osn;
        wx.navigateTo({
            url: "/pages/order/detail/index?orderSn=" + orderSn
        })
    },
    tapOrderCancel:function(e){
        var that = this;
        var orderSn = e.currentTarget.dataset.osn;
         wx.showModal({
          title: '确定要取消该订单吗？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading({title: '加载中'});
              wx.request({
                url: 'xxx',
                data: {orderSn: orderSn,phone:that.data.user.phone},
                success: function (res) {
                  wx.hideLoading();
                  if (res.data.code == 0) {
                      that.onShow();
                  }
                }
              })
            }
          }
        })
    },
    tapOrderPay:function(e){
        var that = this;
        var orderSn = e.currentTarget.dataset.osn;
        wx.request({
            url: 'xxx',
            data: {orderSn:orderSn,phone:that.data.user.phone},
            success: function(res){
                console.log('repay data');
                console.log(res.data);
                if(res.data.code == 0){
                    var data   = res.data.data;
                    // 发起支付
                    wx.requestPayment({
                        timeStamp:data.timeStamp,
                        nonceStr:data.nonceStr,
                        package:data.package,
                        signType:data.signType,
                        paySign:data.paySign,
                        success:function (res) {
                            wx.showToast({title: '支付成功'})
                            wx.navigateTo({url:'/pages/order/detail/index?orderSn='+data.orderSn})
                        },
                        fail:function (res) {
                            console.log(res);
                            wx.showModal({
                                title: '',
                                content: '您已取消支付',
                                showCancel:false,
                                success:function(){
                                    wx.navigateTo({url:'/pages/order/detail/index?orderSn='+data.orderSn})
                                }
                            });
                        }
                    })
                } else {
                    wx.showToast({title: '服务器忙' + res.data.code})
                }
            }
        })
    },
    onHide:function(){
    // 生命周期函数--监听页面隐藏

    },
    onUnload:function(){
    // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
        this.onShow();
        wx.stopPullDownRefresh()
    },
    onReachBottom: function() {
    // 页面上拉触底事件的处理函数

    }
})