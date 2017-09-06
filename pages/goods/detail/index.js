var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    dots:true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,
    selectSize:"选择：课程",
    selectSizePrice:0,
    shopNum:0,
    hideShopPopup:true,
    buyNumber:1,
    buyNumMin:1,
    buyNumMax:0,

    specId:"",
    specName:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{}
  },
  onLoad: function (options) {
    this.getCartNum()//获取购物车中商品数量
    this.getDetail(options)//商品详情数据
  },
  getDetail:function (options) {//获取商品详情
    var that = this;
      wx.request({
          url: 'xxx',
          data: {id: options.id},
          success: function(res) {
              var data = res.data.data;
              that.setData({
                  goodsDetail:data,
                  selectSizePrice:data.spec.price,
                  specId:data.spec.id,
                  specName:data.spec.name,
                  buyNumMax:data.spec.count,
                  buyNumber:(data.spec.count>0) ? 1: 0
              })
              WxParse.wxParse('article', 'html', data.content, that);
          }
      })
  },
  getCartNum:function () {//获取购物数量
      var that = this;
      wx.getStorage({
          key: 'shopCarInfo',
          success: function(res) {
              that.setData({
                  shopCarInfo:res.data,
                  shopNum:res.data.shopNum
              });
              console.log('获取购物车中数量')
          }
      })
  },
  tapSpec: function() {//展示规格
     this.setData({  
        hideShopPopup: false 
    })  
  },
  tapClose: function() {//关闭规格
     this.setData({  
        hideShopPopup: true 
    })  
  },
  tapJian: function() {
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--; 
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  tapJia: function() {
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  tapItem: function(e) {//选中规格
    var that = this;
    // 取消该分类下的子栏目所有的选中状态
    var specs = that.data.goodsDetail.specs;
    for(var i = 0;i < specs.length;i++){
      that.data.goodsDetail.specs[i].active = false;
    }
    var index = e.currentTarget.dataset.specindex;
    var currentSpec = that.data.goodsDetail.specs[index];
    // 设置当前选中状态
     currentSpec.active = true;
    // 获取选中规格尺寸数据
    this.setData({
        goodsDetail: that.data.goodsDetail,
        canSubmit:true,
        selectSizePrice:currentSpec.price,
        specId:currentSpec.id,
        specName:currentSpec.name,
        buyNumMax:currentSpec.count,
        buyNumber:(currentSpec.count>0) ? 1: 0
    })  
  },
  tapAddCart:function(e){//加入购物车
        var flag = e.currentTarget.dataset.flag;
        if(flag == 'true'){
            this.data.canSubmit = true;
        }
        if (this.data.goodsDetail.specs && !this.data.canSubmit) {
            this.tapSpec();
            return;
        }
        if(this.data.buyNumber < 1){
            this.needCount();
            return;
        }
        // 加入购物车
        var shopCarMap = {};
        shopCarMap.goodsId=this.data.goodsDetail.id;
        shopCarMap.pic=this.data.goodsDetail.pic;
        shopCarMap.name=this.data.goodsDetail.name;
        shopCarMap.specId=this.data.specId;
        shopCarMap.specName=this.data.specName;
        shopCarMap.price=this.data.selectSizePrice;
        shopCarMap.active=true;
        shopCarMap.number = this.data.buyNumber;

        var shopCarInfo = this.data.shopCarInfo;
        if (!shopCarInfo.shopNum){
          shopCarInfo.shopNum = 0;
        }
        if (!shopCarInfo.shopList){
          shopCarInfo.shopList = [];
        }

        var hasSameGoodsIndex = -1;
        for (var i = 0;i<shopCarInfo.shopList.length;i++) {
          var tmpShopCarMap = shopCarInfo.shopList[i];
          if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.specId == shopCarMap.specId) {
            hasSameGoodsIndex = i;
            shopCarMap.number=shopCarMap.number + tmpShopCarMap.number;
            break;
          }
        }

        shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
          shopCarInfo.shopList.splice(hasSameGoodsIndex,1, shopCarMap);
        } else {
           shopCarInfo.shopList.push(shopCarMap);
        }

        //更新购物车
        this.setData({
          shopCarInfo:shopCarInfo,
          shopNum:shopCarInfo.shopNum
        });
        // 写入本地存储
        wx.setStorage({
          key:"shopCarInfo",
          data:shopCarInfo
        })
        this.tapClose();
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
    },
    toCart:function () {
        wx.navigateTo({
            url: "/pages/cart/index"
        });
    },
  tobuy:function(e){
    if (this.data.goodsDetail.specs && !this.data.canSubmit) {
      this.tapSpec();
      return;
    }
    if(this.data.buyNumber < 1){
      this.needCount();
      return;
    }
    this.tapAddCart(e);
    this.toCart();
  },
  needCount:function () {
    wx.showModal({
        title: '提示',
        content: '暂时缺货哦~',
        showCancel:false
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.name,
      path: '/pages/goods/detail/index?id=' + this.data.goodsDetail.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
