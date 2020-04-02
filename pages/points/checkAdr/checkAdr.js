
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
const fetch = require('../../../utils/fetch.js')
const dataUrl = require('../../../utils/utils.js')
Page({
  data: {
    city: [],
    goodItem:{},
    userName:'',
    userPhone:'',
    desub:''
  },

  onLoad: function (options) {
    let that = this;
    that.data.desub=dataUrl.debounce(this.submit,2000)
    that.setData({
      goodItem: JSON.parse(decodeURIComponent(options.goodItem))
    })
    var qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD' // 必填
    });
    //获取地址
    fetch('/user/address/list?openId='+getApp().globalData.openid).then(res => {
      if(res.data.data.length==0){
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              success: function (res) {
                console.log(res.result.address_component)
                let city = [];
                city[1] = res.result.address_component.city;
                city[0] = res.result.address_component.province;
                city[2] = res.result.address_component.district;
                city[3] = ''
                that.setData({
                  city:city
                })
              },
            });
          }
        })
      }
      else{
        let data = res.data.data[0]
        that.setData({
          userName: data.userName,
          userPhone: data.userName,
          city: data.addressContent.split('-')
        })
      }
    })
  },
  submit(){
    wx.request({
      url: dataUrl.url + 'wxjf/change',
      method: 'post',
      data: {
        giftId: this.data.goodItem.giftId,
        wxOpenid: getApp().globalData.openid,
        address: this.data.city.join('-')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
        else {
          wx.showToast({
            image: '/assets/err.png',
            title: '积分不足',
            duration: 1000
          })
        }
      }
    })
  },
  formSubmit: function () {
    let that = this;
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
          that.data.desub()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})