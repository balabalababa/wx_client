// pages/points/contract/contract.js
const dataUrl = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    deUpload:'',
    orderNo:''
  },
  chooseImage:function(){
    let that=this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          imgUrl: res.tempFilePaths[0]
        })
      }
    })
  },
  upload1(){
    let that=this;
    console.log(getApp().globalData.cityId)
    wx.uploadFile({
      url: dataUrl.url + 'jf/contract/image', 
      filePath: that.data.imgUrl,
      name: 'file',
      success: function (res) {
        let data = JSON.parse(res.data)
        wx.request({
          url: dataUrl.url + 'wxjf/contract',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            image: data.msg,
            wxOpenid: getApp().globalData.openid,
            orderNo:that.data.orderNo,
            cityId:getApp().globalData.cityId
          },
          success(res) {
            if (res.data.code == 1) {
              wx.showToast({
                title: '合同上传成功，请等待后台审核',
              })
              that.setData({
                imgUrl: ''
              })
            }
            else{
              wx.showToast({
                title: '上传失败',
                image:'/assets/err.png'
              })
            }
          }
        })
      }
    })
  },
  upload(){
    wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    if(!!this.data.imgUrl){
      this.data.deUpload()
    }
    else{
      wx.showToast({
        title: '请传图片',
        image:'/assets/err.png'
      })
    }
  },
  onLoad: function (options) {
    if(options.orderNo){
      this.setData({
        orderNo:options.orderNo
      })
    }
    this.setData({
      deUpload: dataUrl.debounce(this.upload1, 2000)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})