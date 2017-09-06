var app = getApp();
Page({
    data:{
        orderSn:0,
        specId:0,
        orderDetail:{}
    },
    onLoad:function(options){
      this.setData({
        orderSn: options.orderSn,
        specId: options.specId
      });
    },
    onShow : function () {
      var that = this;
      wx.request({
        url: 'xxx',
        data: {orderSn: that.data.orderSn,specId:that.data.specId},
        //data: {orderSn: '10002017070614',specId:5},
        success: function (res) {
          if (res.data.code) {
            wx.showModal({
              title: '错误',
              content: res.data.msg,
              showCancel: false
            })
            return;
          }
          that.setData({
            orderDetail: res.data.data
          });
        }
      })
    }
})