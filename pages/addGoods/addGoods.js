var app = getApp();
Page({
  data: {
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
          //图如果满了1张，不显示加图
          if (res.tempFilePaths.length == 1) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },
  //发布
  saveGoods: function (e) {
    var that = this;
    var goodsName = e.detail.value.goodsName;
    var goodsDesc = e.detail.value.goodsDesc;
    var newPrice = e.detail.value.newPrice;
    var oldPrice = e.detail.value.oldPrice;
    var mobile = e.detail.value.mobile;
    //let img_url = that.data.img_url;

    if (!goodsName || !newPrice || !oldPrice) {
      wx.showToast({
        title: "不能为空",
        icon: '',
        duration: 2000
      });
      return;
    }
    var addressList = {
      goodsName: goodsName,
      goodsDesc: goodsDesc,
      newPrice: newPrice,
      oldPrice: oldPrice,
      authorName:"myUser"
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: app.globalData.siteBaseUrl + "/goods/addGoods",
      data: JSON.stringify(addressList),
      method: "POST",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var result = res.data.success;
        var toastText = "发布成功！";
        if (result != true) {
          toastText = "发布失败！";
        }
        wx.hideLoading()
        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        });
        if (result) {
          wx.switchTab({url:'../index/index'});
        }
      }
    })
  },

  //图片上传
  img_upload: function () {
    let that = this;
    let img_url = that.data.img_url;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'http://wechat.homedoctor.com/Moments/upload_do',
        filePath: img_url[i],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: function (res) {
          console.log('上传成功');
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(res.data)
          //如果全部传完，则可以将图片路径保存到数据库
          if (img_url_ok.length == img_url.length) {
           // var userid = wx.getStorageSync('userid');
            var content = that.data.content;
            wx.request({
              url: 'http://wechat.homedoctor.com/Moments/adds',
              data: {
                images: img_url_ok,
                content: content
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提交成功',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/my_moments/my_moments',
                        })
                      }
                    }
                  })
                }
              }
            })

          }
        },
        fail: function (res) {
          console.log('上传图片失败')
        }
      })
    }
  }

})
