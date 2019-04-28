var app = getApp();
Page({
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
    inputTxt:'',
    focus: false,
    phValue:'问更多细节，请留言~',
    replyCommentId:'',
    replyUserName:''
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

    var replyCommentId = that.data.replyCommentId;//回复某一条留言，只有回复时有值
    var replyUserName = that.data.replyUserName;//回复谁的用户名，只有回复时有值

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

  },
  //点击留言时，获取输入框焦点
  toReplay:function(e){
    var curMsgId = e.currentTarget.dataset.messageid;//准备回复的留言的ID
    var curMsgUsername = e.currentTarget.dataset.username;//准备回复的留言的用户名
    console.log("我在回复：" + curMsgId + "-----:" + curMsgUsername + "---:");
    this.setData({
      focus: true,
      phValue: "回复@" + curMsgUsername,
      replyCommentId: curMsgId,
      replyUserName: curMsgUsername
    })
  }
})