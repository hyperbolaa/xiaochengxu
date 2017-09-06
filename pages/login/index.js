var app = getApp()
Page({
    data: {
        btn:{
            size:'default',
            type:'default',
            plain:false
        },
        phone:'',  //电话号码
        code:'',    //验证码
        user:{}
    },
    onLoad: function () {//用户登录
        var user = wx.getStorageSync('user');
        this.setData({
            user:user
        });
    },
    bindPhone:function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    getCode:function () {
        var that=this;
        var phone = that.data.phone;
        if(phone.length == 11){
            wx.request({
                url:'xxx',
                data:{phone:phone},
                success:function (res) {
                    if(res.data.code == 0){
                        wx.showToast({
                            'title':'发送成功'
                        })
                    }else{
                        wx.showToast({
                            'title':res.data.msg
                        })
                    }
                },
                fail:function (res) {
                    wx.showToast({
                        'title':'发送失败'
                    })
                }
            })
        }else{
            wx.showToast({
                'title':'请输入11位手机号码'
            })
        }
    },
    login:function (e) {
        var that = this;
        var phone = e.detail.value.phone;
        var code = e.detail.value.code;
        if(phone.length != 11){
            wx.showToast({
                'title':'请输入11位手机号码'
            })
        }
        if(code.length != 6){
            wx.showToast({
                'title':'请输入6位动态密码'
            })
        }
        wx.request({
            url:'xxx',
            data:{phone:phone,code:code,openid:that.data.user.openid},
            success:function (res) {
                var data = res.data;
                if(data.code == 0){
                    var obj = {};
                    obj.phone = phone;
                    obj.openid = that.data.user.openid;
                    try {
                        wx.setStorageSync('user', obj);
                    } catch (e) {
                    }

                    wx.navigateBack({delta:1});//返回上一页面
                }else{
                    wx.showToast({
                        'title':data.msg
                    })
                }
            },
            fail:function (res) {
                wx.showToast({
                    'title':'登录失败'
                })
            }
        })
    }
})
