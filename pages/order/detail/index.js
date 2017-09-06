var app = getApp();
Page({
    data:{
      orderSn:0,
      orderDetail:{}
    },
    onLoad:function(options){
      this.setData({
        orderSn: options.orderSn
      });
    },
    onShow : function () {
      var that = this;
      wx.request({
        url: 'xxx',
        data: {orderSn: that.data.orderSn},
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
    },
    toCode:function (e) {//跳转到核销码页面  或者 商品页面
        var id = e.currentTarget.dataset.id;
        var goods_id = e.currentTarget.dataset.gid;
        var status = e.currentTarget.dataset.status;
        var orderSn = this.data.orderSn;
        if(status == 10){
            wx.navigateTo({
                url:"/pages/goods/detail/index?id="+goods_id
            })
        }else{
            wx.navigateTo({
                url:"/pages/order/code/index?specId="+id+'&orderSn='+orderSn
            })
        }

    }
})