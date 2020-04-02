const dataUrl = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    cook: '',
    showTime: false,
    nowTime: ''
  },
  bindKeyInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindKeyInput1: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //用户手机号测试
  test: function() {
    let that = this;
    var myreg = /^(134|135|136|137|138|139|147|150|151|152|157|158|159|166|182|183|184|187|188|130|131|132|145|155|156|185|186|133|153|180|181|189|170|171|173|174|175|176|177|178|166|199|191|167)\d{8}$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/assets/err.png',
        duration: 1500
      })
      return false;
    }
    wx.request({
      url: dataUrl.url + 'wxjf/send',
      data: {
        userPhone: that.data.phone,
        wxOpenid: getApp().globalData.openid
      },
      success(res) {
        if (res.data.code == 1) {
          that.countdown();
          that.setData({
            cook: res.header['Set-Cookie']
          })
        }
      }
    })
  },
  login() {
    let that = this;
    if (!!that.data.code) {
      wx.request({
        method: 'POST',
        url: dataUrl.url + 'wxjf/login',
        header: {
          'cookie': that.data.cook,
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          cityId: 3,
          code: this.data.code,
          userPhone: this.data.phone,
          wxOpenid: getApp().globalData.openid
        },
        success(res) {
          if (res.data.code == 0) {
            wx.showToast({
              image: '/assets/err.png',
              title: res.data.msg,
            })
          }
          if (res.data.code == 1) {
            wx.redirectTo({
              url: '/pages/points/points',
            })
          }
        }
      })
    }
    else{
      wx.showToast({
        title: '输入验证码',
        image:'/assets/err.png'
      })
    }

  },
  onLoad: function(options) {

  },
  //倒计时
  countdown() {
    let that = this;
    that.setData({
      showTime: true
    })

    let time = 60;
    that.setData({
      nowTime: time
    })
    let timer = setInterval(function() {
      if (time <= 0) {
        clearInterval(timer)
        that.setData({
          showTime: false
        })
      }
      time--;
      that.setData({
        nowTime: time
      })
    }, 1000)
  }
  ,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})