// pages/allAddress/allAddress.js
const fetch = require('../../utils/fetch.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storts_information:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var brandid = options.brandid

    fetch('itempage/store/' + brandid).then(res => {
      this.setData({
        storts_information: res.data
      })
    })

    qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD'
    });

  },

  //根据地址打开地图
  seeMap: function (res) {
    console.log(res)
    var address = res.currentTarget.dataset.address
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        console.log(res);
        var latitude = res.result.location.lat
        var longitude = res.result.location.lng
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  //打电话
  tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.storts_information[e.currentTarget.dataset.index].storePhone,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})