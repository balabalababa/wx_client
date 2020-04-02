const dataUrl = require('../../../utils/utils.js')
Page({
  data: {
    good: {},
    goodItem: {},
    deredoom: '',
    point: ''
  },
  onLoad: function(options) {
    let data = JSON.parse(decodeURIComponent(options.item));
    data.giftNote = data.giftNote.split('；')
    data.specialNote = data.specialNote.split('；')
    console.log(data)
    this.setData({
      good: data,
      goodItem: options.item,
      deredoom: dataUrl.debounce(this.redoom1, 400),
      point: options.point
    })
  },
  redoom1() {
    wx.request({
      url: dataUrl.url + 'wxjf/change',
      method: 'post',
      data: {
        giftId: this.data.good.giftId,
        wxOpenid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'succes',
            duration: 1000
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/points/record/record?active=gift',
            })
          },1000)
       
        }
      }
    })
  },
  redoom() {
    let that = this;
    if (that.data.point < that.data.good.giftPoint) {
      wx.showToast({
        image: '/assets/err.png',
        title: '积分不足',
        duration: 1000
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '是否兑换该礼品',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在兑换',
            image: 'loading',
            duration: 1000
          })
          if (that.data.good.needAddress == 1) {
            that.data.deredoom()
          } else {
            wx.chooseAddress({
              success(res) {
                let adr = res.userName + res.telNumber + res.provinceName + res.cityName + res.countyName + res.detailInfo
                wx.request({
                  url: dataUrl.url + 'wxjf/change',
                  method: 'post',
                  data: {
                    giftId: that.data.good.giftId,
                    wxOpenid: getApp().globalData.openid,
                    address: adr
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  success(res) {
                    if (res.data.code == 1) {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'succes',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '/pages/points/record/record?active=gift',
                        })
                      }, 1000)

                    } else {
                      wx.showToast({
                        image: '/assets/err.png',
                        title: '积分不足',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            })
           
           
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onReady: function() {

  },
  onShareAppMessage: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})