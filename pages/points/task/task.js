const changtime = require('../../../utils/time.js')
const dataUrl = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: '',
    list: [],
    imageUrl: '', 
    showFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: dataUrl.url +'wxjf/contractCount',
      success(res) {
        if (res.data.code == 1)
          that.setData({
            count: res.data.data
          })
      }
    })
    wx.request({
      url: dataUrl.url +'wxjf/contractList',
      data: {
        openId: getApp().globalData.openid
      },
      success(res) {
        let data = res.data.data;
        data.forEach(function(i) {
          i.createTime = changtime.tsFormatTime(i.createTime * 1000, 'Y/M/D/h:m');
        })
        that.setData({
          list: data
        })
      }
    })
  },
  clickImage:function(e) {
    this.setData({
      imageUrl: e.currentTarget.dataset.image,
      showFlag:true
    })
  },
  clodeShow:function(){
    this.setData({
      showFlag: false
    })
  },
  onShow: function() {
    let that = this;
    wx.request({
      url: dataUrl.url + 'wxjf/contractCount',
      success(res) {
        if (res.data.code == 1)
          that.setData({
            count: res.data.data
          })
      }
    })
    wx.request({
      url: dataUrl.url + 'wxjf/contractList',
      data: {
        openId: getApp().globalData.openid
      },
      success(res) {
        let data = res.data.data;
        data.forEach(function (i) {
          i.createTime = changtime.tsFormatTime(i.createTime * 1000, 'Y/M/D/h:m');
        })
        that.setData({
          list: data
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})