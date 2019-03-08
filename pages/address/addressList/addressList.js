var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
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
      url:app.globalData.siteBaseUrl+'/address/listAddress',
      method: "GET",
      data: {},
      success: function (res) {
        var list = res.data.addressList;
        if (list == null) {
          var toastText = "获取信息失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: "",
            duration: 2000
          });
        } else {
          that.setData({
            addressList: list
          });
        }
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({ url: '../addAddress/addAddress' });
  },
  /* 删除item */
  delAddress: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除收货人【' + e.target.dataset.consignee + '】的地址吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.siteBaseUrl +'/address/removeAddress',
            data: { "addressId": e.target.dataset.id },
            method: "GET",
            success: function (res) {
              var result = res.data.success;
              var toastText = "";
              if (result != true) {
                toastText = "删除失败！";
              } else {
                toastText = "删除成功！";
                that.data.addressList.splice(e.target.dataset.index, 1);
                that.setData({
                  addressList: that.data.addressList
                });
              }
              wx.showToast({
                title: toastText,
                icon: '',
                duration: 2000
              });
            }
          })
        }
      }
    })
  }
})