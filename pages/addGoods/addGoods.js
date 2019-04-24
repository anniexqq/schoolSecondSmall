var app = getApp();
Page({
  data: {
    count:1,//设置只能传1张图片
    img_url: []
  },
  onLoad: function (options) {
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
          //图如果满了1张，不显示加图
          if (that.data.img_url.length >= that.data.count ) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
        }
      }
    })
  },
  //发布-信息新增
  saveGoods: function (e) {
    var that = this;
    var goodsName = e.detail.value.goodsName;
    var goodsDesc = e.detail.value.goodsDesc;
    var newPrice = e.detail.value.newPrice;
    var oldPrice = e.detail.value.oldPrice;
    var mobile = e.detail.value.mobile;

    var uInfo = app.globalData.userInfo;
    if (!uInfo){
      wx.showToast({
        title: "请先登录授权",
        icon: 'fail',
        duration: 2000
      });
      return;
    }

    if (!goodsName || !newPrice || !oldPrice) {
      wx.showToast({
        title: "不能为空",
        icon: 'fail',
        duration: 2000
      });
      return;
    }
    var addressList = {
      goodsName: goodsName,
      goodsDesc: goodsDesc,
      newPrice: newPrice,
      oldPrice: oldPrice,
      authorName: app.globalData.userInfo.nickName
    }
    wx.showLoading({
      title: '商品发布中',
    })
    wx.request({
      url: app.globalData.siteBaseUrl + "/goods/addGoods",
      data: JSON.stringify(addressList),
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var result = res.data.goodsId;
        //信息新增成功后，再上传图片
        if (result>0) {
          wx.hideLoading();
          that.uploadGoodsImg(result);
        }else{
          wx.hideLoading();
          wx.showToast({
            title: "信息发布失败!",
            icon: '',
            duration: 2000
          });
        }
      }
    })
  },
  //图片上传
  uploadGoodsImg: function (goodsId) {
    var that = this;
    let imgFilePaths = that.data.img_url;
    var num = 0;
    for (var i = 0; i < imgFilePaths.length; i++) {
      wx.uploadFile({
        url: app.globalData.siteBaseUrl + '/goods/uploadGoodsImg',
        filePath: imgFilePaths[i],
        name: 'file',
        formData: {
          goodsId: goodsId
        },
        success: function (res) {
          //接口调用成功的回调函数
        },
        //接口调用结束的回调函数（调用成功、失败都会执行）
        complete: function (res) {
          var data = JSON.parse(res.data);
          if (data.status == 500) {
            wx.hideLoading();
            wx.showToast({
              title: data.msg,
            });
          }else{
            num++;
            if (num == imgFilePaths.length) {//图片已全部上传
              wx.hideLoading();
              wx.showToast({
                title: '商品发布成功！',
                icon: '',
                duration: 2000
              });
            }
          }
          //跳到首页
          wx.switchTab({
            url: '../index/index',
          })
          //that.onLoad();
        },
        fail: function (res) {
          //可统计上传失败图片数
          console.log('上传图片失败');
        }
      })
    }
  },
  //预览图片----------预览后关闭在真机调试可以
  previewImg: function (e) {
    var me = this;
    var img_url = me.data.img_url;
    var index = e.target.dataset.index;
    wx.previewImage({
      urls: img_url,
      current: img_url[index],
      success: function (res) {
        console.log(res);
      }
    })
  },

  //删除图片--------未用到
  deleteImg: function (e) {
    var me = this;
    var img_url = me.data.img_url;
    var index = e.target.dataset.index;
    img_url.splice(index, 1);
    me.setData({
      img_url: img_url,
      //若当前图片超过9张，则隐藏添加图标；少于9张则显示添加图标。=>2
      hideAdd: me.data.img_url.length < 2 ? false : true
    })
  }

})
