//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    hidden: true,
    count: '1',
    banners:[
      { "id": 1, "bannerName": "全新上市", "imgUrl": "/images/banner01.jpg", "clickUrl": "", "seq": 1 },
      { "id": 2, "bannerName": "全球优选团", "imgUrl": "/images/banner02.jpg", "clickUrl": "", "seq": 2 }, 
      { "id": 3, "bannerName": "新会员满减", "imgUrl": "/images/banner03.jpg", "clickUrl": null, "seq": 3 }
    ],                                 
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsList: []
  },
  onLoad: function () {

  },
  onShow: function (){
    this.allGoods();
  },
  //从服务器获取所有商品
  allGoods:function () {
    var that = this;//此时this指整个页面，谁调用，此时this就归谁
    wx.request({
      url: app.globalData.siteBaseUrl +'/goods/listGoods',
      method: "GET",
      data: {},
      success: function (res) {
        var list = res.data.goodsList;
        if (list == null) {
          var toastText = "获取信息失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: "",
            duration: 2000
          });
        } else {
          that.setData({  //经过wx.requesth后此时this指onShow这个方法，所有需要用之前的that句柄
            goodsList: list
          });
        }
      }
    })
  },
  toSearch: function (e) {
    var that = this;
    var goodSearchName = e.detail.value;
    if(!goodSearchName){
      this.allGoods();
    }else{
      wx.request({
        url: app.globalData.siteBaseUrl + '/goods/getGoodsByTitle',
        method: "GET",
        data: {
          "goodsName": goodSearchName
        },
        success: function (res) {
          var list = res.data.goodsList;
          if (list == null) {
            var toastText = "搜索失败";
            wx.showToast({
              title: toastText,
              icon: "",
              duration: 2000
            });
          } else {
            that.setData({
              goodsList: list
            });
          }
        }
      })
    }
  },
  putInShopcar:function(e){
    var uInfo = app.globalData.userInfo;
    if (!uInfo) {
      wx.showToast({
        title: "请先登录授权",
        icon: 'fail',
        duration: 2000
      });
      return;
    }
    
    var goodsid = e.target.dataset.goodsid;
    if (!goodsid){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/shopcar/putInShopcar',
      method: "POST",
      data: {
        "userName": app.globalData.userInfo.nickName,
        "goodsId": goodsid
      },
      success: function (res) {
        var result = res.data.success;
        var toastText = "加入成功！";
        if (result != true) {
          toastText = "加入失败！";
        }
        wx.showToast({
          title: toastText,
          icon: "",
          duration: 2000
        });
      }
    })
  },
  goToDetail:function(e){
    var uInfo = app.globalData.userInfo;
    if (!uInfo) {
      wx.showToast({
        title: "请先登录授权",
        icon: 'fail',
        duration: 2000
      });
      return;
    }

    var goodsid = e.target.dataset.gogoodsid;
    wx.navigateTo({ url: '../goodsDetails/goodsDetails?goodsid=' + goodsid});
  }
})