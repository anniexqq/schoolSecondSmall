//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    hidden: true,
    count: '1',
    banners:[
      { "id": 1, "bannerName": "全新上市", "imgUrl": "/images/14823895573.png", "clickUrl": "", "seq": 1 }, 
      { "id": 2, "bannerName": "全球优选团", "imgUrl": "/images/CgvUBFrNzZaAMSW8AAFEr6p5z9M050_75_52_o.jpg", "clickUrl": "", "seq": 2 }, 
      { "id": 3, "bannerName": "新会员满减", "imgUrl": "/images/5acdd4c3N8e1f4ba1.jpg", "clickUrl": null, "seq": 3 }
    ],                                 
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsList: []
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
  onLoad: function () {
    //var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       height: res.windowHeight + 'px'
    //     });
    //   }
    // })
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
    var goodsid = e.target.dataset.goodsid;
    if (!goodsid){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/shopcar/putInShopcar',
      method: "POST",
      data: {
        "userName": "myUser",
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
  }
})