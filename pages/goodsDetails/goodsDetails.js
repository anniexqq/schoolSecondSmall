var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfoList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/getGoodsDetails',
      method: "GET",
      data: {
        "goodsId": "1",
      },
      success: function (res) {
        var list = res.data.goodsInfoList;
        if (list == null) {
          var toastText = "获取信息失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: "",
            duration: 2000
          });
        } else {
          that.setData({
            goodsInfoList: list
          });
        }
      }
    })
  },
  saveMessage:function(e){
    var that = this;
    var msg = e.detail.value.inputMsg;
    console.log("添加留言：" + msg);
  }
})