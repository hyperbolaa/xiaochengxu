var app = getApp()
Page({
    data: {
        goodsList:{
          saveHidden:true,
          totalPrice:0,
          allSelect:true,
          noSelect:false,
          list:[]
        },
        delBtnWidth:120    //删除按钮宽度单位（rpx）
    },
    onLoad: function () {//获取缓存的购物车数据
      this.initEleWidth();
        var shopList = [];
        // 获取购物车数据
        var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
        if (shopCarInfoMem && shopCarInfoMem.shopList) {
            shopList = shopCarInfoMem.shopList
        }
        console.log(shopList);
        this.data.goodsList.list = shopList;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),shopList);
    },
    toIndexPage:function(){// 跳转到首页
      wx.switchTab({
            url: "/pages/home/index"
      });
    },
    touchS:function(e){
        if(e.touches.length==1){
          this.setData({
            startX:e.touches[0].clientX
          });
        }
    },
    touchM:function(e){
        var index = e.currentTarget.dataset.index;
        if(e.touches.length==1){
          var moveX = e.touches[0].clientX;
          var disX = this.data.startX - moveX;
          var delBtnWidth = this.data.delBtnWidth;
          var left = "";
          if(disX == 0 || disX < 0){//如果移动距离小于等于0，container位置不变
            left = "margin-left:0px";
          }else if(disX > 0 ){//移动距离大于0，container left值等于手指移动距离
            left = "margin-left:-"+disX+"px";
            if(disX>=delBtnWidth){
              left = "left:-"+delBtnWidth+"px";
            }
          }
          var list = this.data.goodsList.list;
          if(index!="" && index !=null){
            list[parseInt(index)].left = left;
            this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
          }
        }
    },
    touchE:function(e){
    var index = e.currentTarget.dataset.index;
    if(e.changedTouches.length==1){
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";
      var list = this.data.goodsList.list;
     if(index!=="" && index != null){
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);

      }
    }
    },
    delItem:function(e){   //删除元素
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList.list;
        list.splice(index,1);
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    selectItem:function(e){ //选择元素
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList.list;
        if(index !== "" && index != null){
            list[parseInt(index)].active = !list[parseInt(index)].active ;
            this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
        }
    },
    totalPrice:function(){ //选中商品的价格总和
          var list = this.data.goodsList.list;
          var total=0 , price = 0;
          for(var i = 0 ; i < list.length ; i++){
              var curItem = list[i];
              if(curItem.active){
                  price = parseFloat(curItem.price)*parseInt(curItem.number);
                  console.log(price);
                  //total = parseFloat(total) + parseFloat(price);
                  total = this.accAdd(total,price);
                  console.log(total);
              }
          }
          return total;
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
    allSelect:function(){  //判断是否全选
          var list = this.data.goodsList.list;
          var allSelect = false;
          for(var i = 0 ; i < list.length ; i++){
              var curItem = list[i];
              if(curItem.active){
                allSelect = true;
              }else{
                 allSelect = false;
                 break;
              }
          }
          return allSelect;
    },
    noSelect:function(){  //判断是否非全选
          var list = this.data.goodsList.list;
          var noSelect = 0;
          for(var i = 0 ; i < list.length ; i++){
              var curItem = list[i];
              if(!curItem.active){
                noSelect++;
              }
          }
          if(noSelect == list.length){
             return true;
          }else{
            return false;
          }
    },
    setGoodsList:function(saveHidden,total,allSelect,noSelect,list){  //商品状态设置
          this.setData({
            goodsList:{
              saveHidden:saveHidden,
              totalPrice:total,
              allSelect:allSelect,
              noSelect:noSelect,
              list:list
            }
          });
          var shopCarInfo = {};
          var tempNumber = 0;
          shopCarInfo.shopList = list;
          for(var i = 0;i<list.length;i++){
            tempNumber = tempNumber + list[i].number
          }
          shopCarInfo.shopNum = tempNumber;
          wx.setStorage({
            key:"shopCarInfo",
            data:shopCarInfo
          })
    },
    bindAllSelect:function(){ //全选或全不选
        var currentAllSelect = this.data.goodsList.allSelect;
        var list = this.data.goodsList.list;
        if(currentAllSelect){
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = false;
            }
        }else{
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = true;
            }
        }
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),!currentAllSelect,this.noSelect(),list);
    },
    jiaBtnTap:function(e){ //增加数量限制购买10个
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList.list;
        if(index!=="" && index != null){
          if(list[parseInt(index)].number<10){
            list[parseInt(index)].number++;
            this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
          }
        }
    },
    jianBtnTap:function(e){ //减少数量 最少数量为1
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList.list;
        if(index!=="" && index != null){
          if(list[parseInt(index)].number>1){
            list[parseInt(index)].number-- ;
            this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
          }
        }
    },
    editTap:function(){ //编辑购物车
         var list = this.data.goodsList.list;
         for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = false;
         }
         this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    saveTap:function(){ //编辑完成
         var list = this.data.goodsList.list;
         for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = true;
         }
         this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    getSaveHide:function(){ //保存隐藏
         var saveHidden = this.data.goodsList.saveHidden;
         return saveHidden;
    },
    deleteSelected:function(){ //删除选中的商品
          var list = this.data.goodsList.list;
          for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                if(curItem.active){
                  list.splice(i,1);
                }
          }
         this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    getSelected:function () {
        var specIds = [];
        var list = this.data.goodsList.list;
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                specIds.push(curItem.specId)
            }
        }
        return specIds;
    },
    toPayOrder:function(){
          wx.showLoading({title: '加载中'});
          var that = this;
          if (this.data.goodsList.noSelect) {
            return;
          }
          // 重新计算价格，判断库存
          var shopList = [];
          var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
          if (shopCarInfoMem && shopCarInfoMem.shopList) {
              shopList = shopCarInfoMem.shopList
          }

          if (shopList.length == 0) {
            return;
          }

          // for (var j =0; j < shopList.length; j++) {
          //     if(!shopList[j].active){
          //         shopList.splice(j,1)
          //     }
          // }

          var isFail = false;
          var doneNumber = 0;
          var needDoneNUmber = shopList.length;
          for (var i =0; i < shopList.length; i++) {
                if (isFail) {
                    wx.hideLoading();
                    return;
                }
                var carShopBean = shopList[i];
                console.log('sss');
                console.log(carShopBean);
                //获取价格和库存
                wx.request({
                    url: 'xxx',
                    data: {
                        spec_id:carShopBean.specId,
                        spec_price:carShopBean.price,
                        spec_count:carShopBean.number
                    },
                    success: function(res) {
                        doneNumber++;
                        console.log('res')
                        var code = res.data.code;
                        var msg = res.data.msg;
                        if(code){
                            wx.showModal({
                                title: '提示',
                                content: msg,
                                showCancel:false
                            })
                            isFail = true;
                            wx.hideLoading();
                            return;
                        }
                        if (needDoneNUmber == doneNumber && !isFail) {
                            that.navigateToPayOrder();
                        }
                    }
                })
          }
          return;
    },
    navigateToPayOrder:function () {
          wx.hideLoading();
          var specIds = this.getSelected();
          wx.redirectTo({
             url:"/pages/order/pay/index?specIds="+specIds
          })
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
            // console.log(scale);
            real = Math.floor(res/scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error
        }
    },
    initEleWidth:function(){
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth:delBtnWidth
        });
    },
})
