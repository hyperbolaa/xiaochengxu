//app.js
App({
  onLaunch: function () {  
     var that = this  
     var user = wx.getStorageSync('user') || {};    
     var userInfo = wx.getStorageSync('userInfo') || {};
     if((!user.openid)  || (!userInfo.nickName)){
         console.log('start login');
         that.getUserInfo();
     }
   },
    getUserInfo:function(){
        var that = this;
        wx.login({
            success: function (res) {
                //第一步获取基本登录信息
                that.wxUserinfo(res.code);
            }
        })
    },
    wxUserinfo:function (code) {
        var that = this;
        wx.getUserInfo({
            success: function (res) {
                var objz={};
                objz.nickName  = res.userInfo.nickName
                objz.avatarUrl = res.userInfo.avatarUrl
                objz.gender    = res.userInfo.gender //性别：0：未知，1：男，2：女
                objz.province  = res.userInfo.province
                objz.city      = res.userInfo.city
                objz.country   = res.userInfo.country
                objz.iv        = res.iv
                objz.encryptedData = res.encryptedData
                wx.setStorageSync('userInfo', objz);//存储userInfo
                console.log('userinfo');
                that.saveMore({code:code,iv:res.iv,encrypt:res.encryptedData});
            }
        })
    },
    saveMore:function (postData) { //用户拓展信息
        console.log(postData);
        wx.request({
            url:'xxx',//todo
            data:postData,
            method:'GET',
            success:function(res){
                var obj={};
                obj.openid = res.data.data.openid;
                obj.phone  = '';
                wx.setStorageSync('user', obj);
                console.log('登录信息存储成功');
            },
            fail:function(res){
                console.log('登录信息存储失败');
            }
        })
    },
    globalData:{
        domain:'http://xxxxx.com/',
        appName:'塘角鱼'
    }
})