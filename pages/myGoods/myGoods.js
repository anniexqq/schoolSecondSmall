var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    'authorGoodsList': []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    var uInfo = app.globalData.userInfo;
    if (!uInfo) {
      wx.showToast({
        title: "请先登录授权",
        icon: 'fail',
        duration: 2000
      });
      return;
    }

    wx.request({
      url: app.globalData.siteBaseUrl + '/goods/getGoodsByAuthor',
      method: "GET",
      data: {
        "author": app.globalData.userInfo.nickName,
      },
      success: function (res) {
        var list = res.data.authorGoodsList;
        if (list == null) {
          var toastText = "获取信息失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: "",
            duration: 2000
          });
        } else {
          that.setData({
            authorGoodsList: list
          });
        }
      }
    })
  },
  //删除我的发布
  delMyGoods:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success(res) {
        if (res.confirm) {
          var goodsid = e.target.dataset.goodsid;
          if (!goodsid) {
            return;
          }
          wx.request({
            url: app.globalData.siteBaseUrl + '/goods/deleteMyGoods',
            method: "POST",
            data: {
              "id": goodsid,
              "authorName": app.globalData.userInfo.nickName
            },
            success: function (res) {
              var result = res.data.success;
              var toastText = "删除成功！";
              if (result != true) {
                toastText = "删除失败！";
              }
              wx.showToast({
                title: toastText,
                icon: "",
                duration: 2000
              });
              that.onShow();
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})