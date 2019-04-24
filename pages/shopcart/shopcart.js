// pages/shopcart/shopcart.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'goodsList': [],
    'checkAll': false,
    'totalCount': 0,
    'totalPrice': 0,
    "iscart":false
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
    this.calculateTotal();
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
      url: app.globalData.siteBaseUrl + '/shopcar/listUserShopcar',
      method: "POST",
      data: {
        "userName": app.globalData.userInfo.nickName,
        "isPay": "0"
      },
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
          var hasg = "";
          if(list.length>0){
            hasg=true;
          }else{
            hasg=false;
          }
          that.setData({
            goodsList: list,
            checkAll: false,
            'totalCount': 0,
            'totalPrice': 0,
            iscart: hasg
          });
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

  },

  /**
   * 计算商品总数
   */
  calculateTotal: function () {
    var goodsList = this.data.goodsList;
    var totalCount = 0;
    var totalPrice = 0;
    for (var i = 0; i < goodsList.length; i++) {
      var good = goodsList[i];
      if (good.checked) {
        totalCount += parseInt(good.goodsNumber);
        totalPrice += parseInt(good.goodsNumber) * good.price;
      }
    }
    totalPrice = totalPrice.toFixed(2);
    this.setData({
      'totalCount': totalCount,
      'totalPrice': totalPrice
    })
  },

  /**
   * 用户点击商品减1
   */
  subtracttap: function (e) {
    var index = e.target.dataset.index;
    var goodsList = this.data.goodsList;
    var count = goodsList[index].goodsNumber;
    if (count <= 1) {
      return;
    } else {
      goodsList[index].goodsNumber--;
      this.setData({
        'goodsList': goodsList
      });
      this.calculateTotal();
    }
  },

  /**
   * 用户点击商品加1
   */
  addtap: function (e) {
    var index = e.target.dataset.index;
    var goodsList = this.data.goodsList;
    var count = goodsList[index].goodsNumber;
    goodsList[index].goodsNumber++;
    this.setData({
      'goodsList': goodsList
    });
    this.calculateTotal();
  },
  /**
   * 用户选择购物车商品
   */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.goodsList;
    var values = e.detail.value;
    for (var i = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    var checkAll = false;
    if (checkboxItems.length == values.length) {
      checkAll = true;
    }

    this.setData({
      'goodsList': checkboxItems,
      'checkAll': checkAll
    });
    this.calculateTotal();
  },

  /**
   * 用户点击全选
   */
  selectalltap: function (e) {
    console.log('用户点击全选，携带value值为：', e.detail.value);
    var value = e.detail.value;
    var checkAll = false;
    if (value && value[0]) {
      checkAll = true;
    }

    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      var good = goodsList[i];
      good['checked'] = checkAll;
    }

    this.setData({
      'checkAll': checkAll,
      'goodsList': goodsList
    });
    this.calculateTotal();
  },
  goBalance: function () {
    var that = this;
    var idAndNums = "";
    var checkboxItems = this.data.goodsList;
    for (var i = 0; i < checkboxItems.length; ++i) {
      if (checkboxItems[i].checked){
        idAndNums += (checkboxItems[i].id + "," + checkboxItems[i].goodsNumber+";");
      }
    }
    if (idAndNums==""){
      return;
    }
    wx.request({
      url: app.globalData.siteBaseUrl + '/shopcar/balance',
      method: "GET",
      data: {
        "idAndNums": idAndNums
      },
      success: function (res) {
        var result = res.data.success;
        var toastText = "结算成功！";
        if (result != true) {
          toastText = "结算失败！";
        }
        wx.showToast({
          title: toastText,
          icon: "",
          duration: 2000
        });
        if (result) {
          that.onShow();
        }
      }
    })
    
  }

})