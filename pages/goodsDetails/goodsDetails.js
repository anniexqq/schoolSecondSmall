var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:'',
    msgCount:'',
    goodsName:'',
    goodsDesc:'',
    newPrice:'',
    oldPrice:'',
    goodsCreateTime:'',
    goodsImageUrl:'',
    goodsAuthorName:'',
    messageList:[],
    inputTxt:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodsId: options.goodsid
    })
    console.log("查看商品ID=" + options.goodsid + "的详情");
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
        "goodsId": that.data.goodsId
      },
      success: function (res) {
        if (!res.data){
          wx.showToast({
            title: "获取详情失败",
            icon: "",
            duration: 2000
          });
          return;
        }
        that.setData({
            messageList: res.data.messageList,
            msgCount: res.data.msgCount,
            goodsId: res.data.goodsId,
            goodsName: res.data.goodsName,
            goodsDesc: res.data.goodsDesc,
            newPrice: res.data.newPrice,
            oldPrice: res.data.oldPrice,
            goodsCreateTime: res.data.goodsCreateTime,
            goodsImageUrl: res.data.goodsImageUrl,
            goodsAuthorName: res.data.goodsAuthorName,
            inputTxt:''
          });

      }
    })
  },
  //添加留言
  saveMessage:function(e){
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

    var comment = e.detail.value.inputMsg;//输入的留言内容
    var goodsId = that.data.goodsId;//商品ID
    var msgAuthorName = uInfo.nickName;//留言用户昵称
    var msgAuthorImg = uInfo.avatarUrl;//留言用户头像
    var replyCommentId = null;//回复某一条留言
    var replyUserName = null;//回复谁的用户名

    var messageObj = {
      comment: comment,
      goodsId: goodsId,
      userName: msgAuthorName,
      userImage: msgAuthorImg,
      replyCommentId: replyCommentId,
      replyUserName:replyUserName
    }

    wx.request({
      url: app.globalData.siteBaseUrl + "/message/addMessage",
      data: JSON.stringify(messageObj),
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var result = res.data.messageId;
        if (result > 0) {
          wx.showToast({
            title: "留言成功！",
            icon: '',
            duration: 2000
          });
          that.onShow();
        } else {
          wx.showToast({
            title: "留言失败！",
            icon: '',
            duration: 2000
          });
        }
      }
    })

  }
})