// pages/points/record/record.js
const changtime = require('../../../utils/time.js')
const dataUrl = require('../../../utils/utils.js')
Page({
  data: {
    openid: '',
    points: '',
    currentIndex: 0,
    nav: [{
        text: '积分记录',
        imgsrc: '/assets/points/record-re.jpg',
        imgact: '/assets/points/record-re-act.jpg'
      },
      {
        text: '我的奖品',
        imgsrc: '/assets/points/record-gf.jpg',
        imgact: '/assets/points/record-gf-act.jpg'
      }
    ],
    recordList: [],
    giftList: [],
    day: ''
  },
  tabClick: function(e) {
    this.setData({
      currentIndex: e.target.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.active) {
      that.setData({
        currentIndex: 1
      })
    }
    that.setData({
      openid: getApp().globalData.openid
    })
    wx.request({
      url: dataUrl.url + 'wxjf/userRecord',
      data: {
        wxOpenid: that.data.openid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            points: res.data.data[0].userPoint
          })
          let data = res.data.data[0].detialVOList
          data.forEach(function(i) {
            i.createTime = changtime.tsFormatTime(i.createTime * 1000, 'Y/M/D/h:m');
            i.point = parseInt(i.point)
          })
          that.setData({
            recordList: data,
          })
          data.forEach(function(i) {
            i.point = i.point < 0 ? String(i.point).substring(1) : i.point;
            i.total = JSON.stringify(i)
          })
          that.setData({
            giftList: data
          })
        }
      }
    })
    that.cutOff()
  },
  //到期时间
  cutOff(){
    let that =this;
    wx.request({
      url: dataUrl.url + 'wxjf/days',
      data: {
        openId: that.data.openid
      },
      success(res) {
        if (res.data.code == 1) {
          var date = new Date();
          date.setDate(date.getDate() + res.data.data);
          var year = date.getFullYear()
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var endDate = year + '-' + month + '-' + day;
          that.setData({
            day: endDate
          })
        }
      }
    })
  },
  onShow() {
    let that = this;
    wx.request({
      url: dataUrl.url + 'wxjf/userRecord',
      data: {
        wxOpenid: that.data.openid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            points: res.data.data[0].userPoint
          })
          let data = res.data.data[0].detialVOList
          data.forEach(function(i) {
            i.createTime = changtime.tsFormatTime(i.createTime * 1000, 'Y/M/D/h:m');
            i.point = parseInt(i.point)
          })
          that.setData({
            recordList: data,
          })
          data.forEach(function(i) {
            i.point = i.point < 0 ? String(i.point).substring(1) : i.point;
            i.total = JSON.stringify(i)
          })
          that.setData({
            giftList: data
          })
        }
      }
    })
    that.cutOff()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})