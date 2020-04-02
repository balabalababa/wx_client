// pages/comments/comments.js
const fetch = require('../../app.js')
var app = getApp();


var adds = {}; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 0,
    starMap: [
      '非常差',
      '差',
      '一般',
      '好',
      '非常好',
    ],
    imgs: [],
    id:"",
    appraisalContent:"",
    price:"",
    access_token:0,
    imgFiles:[]
  },

  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
    //console.log(this.data.star)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.orderId
    console.log(id)
    this.setData({
      id: id
    })

  
  },
  chooseimage: function() {
    var that = this;
    var imgs = that.data.imgs;
    if (imgs.length < 3) {
      wx.chooseImage({
        count: 3, // 默认9 
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
          console.log(res)
          var imgsrc = res.tempFilePaths;
          var imgFiles = res.tempFiles;
          var imgs = that.data.imgs.concat(imgsrc);
          imgFiles = that.data.imgFiles.concat(imgFiles);
          that.setData({
            imgs: imgs,
            imgFiles: imgFiles
          });

        }
      })
    } else {
      wx.showToast({
        title: '上传图片不能大于3张!',
        icon: 'none'
      })
    }
  },




  // 删除图片
  deleteImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },

  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  formSubmit: function (e) {
    this.setData({
      appraisalContent: e.detail.value.appraisalContent,
      price: e.detail.value.price
    })
    console.log(e)
    console.log(this.data.star)
    var that = this
    this.upload() 
    
  },

  upload: function () {
    var that = this
    for (var i = 0; i < this.data.imgs.length; i++) {
      wx.uploadFile({
        url: 'https://mall.qszhuang.com/user/upload/appraisal',
        filePath: that.data.imgs[i],
        name: 'images',
        formData: {
          'orderNo': that.data.id
        },
        success: function (res) {
          console.log(res)
          if (res.data.status==500) {
            wx.showToast({
              title: '图片违规',
            })
          }
        }
      })
    }
    setTimeout(function(){
      wx.request({
        url: 'https://mall.qszhuang.com/user/upload/appraisal/otherMsg',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          orderNo: that.data.id,
          appraisalContent: that.data.appraisalContent,
          appraisalScore: that.data.star,
          price: that.data.price
        },
        success: function (res) {
          if (res.data.status == 500) {
            wx.showToast({
              title: '评论违规',
            })
          }else{
            wx.redirectTo({
              url: '/pages/order/order',
            })
          }
        }
      })
    },800)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})