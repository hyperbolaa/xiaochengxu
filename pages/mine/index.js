var app = getApp()
Page( {
    data: {
        user:{},
        userInfo: {},
        shopNum:0
    },
    onShow: function() {
        var user = wx.getStorageSync('user') || {};
        var userInfo = wx.getStorageSync('userInfo') || {};
        var shopCarInfo = wx.getStorageSync('shopCarInfo');

        console.log(user);

        this.setData( {
            user:user,
            userInfo: userInfo,
            shopNum:shopCarInfo.shopNum
        })
    },
    login:function () {
        if(!this.data.user.openid){
            app.getUserInfo();
        }
        wx.navigateTo({url:'/pages/login/index'})
    },
    logout:function () {
        var that = this;
        wx.showModal({
            title: '',
            content: '确定退出您的账户',
            success: function(res) {
                if (res.confirm) {
                    var obj={};
                    var user = wx.getStorageSync('user') || {};
                    if(user.phone){
                        obj.phone = '';
                    }
                    obj.openid = user.openid;
                    wx.setStorageSync('user', obj);
                    that.onShow();
                }
            }
        })
    }
})