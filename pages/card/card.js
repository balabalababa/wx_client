// pages/card/card.js
const fetch = require('../../utils/fetch.js')
const changtime = require('../../utils/time.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    brandId: '',
    openid: "",
    money: ''
  },
  return: function(e) {
    var that=this
    const time = e.currentTarget.dataset.time || e.target.dataset.time
    if (time == 2) {
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      let index = e.currentTarget.dataset.index 
      console.log(e.currentTarget.dataset.index, e.target.dataset.index)
      let cardList = this.data.cardList;
      let delivery = '';
      for (var i = 0; i < cardList.length; i++) {
        if (i == index) {
          if (cardList[i].brandId == that.data.brandId || cardList[i].brandId==0){
          if ((cardList[i].voucherDepositLimit / 100) > that.data.money) {
            wx.showToast({
              title: '不符合条件',
            })
            return false;
          }
            delivery = cardList[i]
          }
          else{
            wx.showToast({
              title: '此品牌不可用',
            })
            return false;
          }
        }
      }
      prevPage.setData({
        cardList: delivery
      })
      console.log(delivery)
      wx.navigateBack({
        delta: 1
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    const brandId = options.brandId
    const openid = options.openId
    const money = options.money
    that.setData({
      brandId: brandId,
      openid: openid,
      money: money
    })
    fetch('user/voucher?openId=' + openid).then(res => {
      if (res.data.data != null && res.data.data.length > 0) {
        var cardList = res.data.data
        for (var i = 0; i < cardList.length; i++) {
          const now = new Date()
          if (cardList[i].stopTime >= now) {
            cardList[i].time = 2  //未超时
            const moretime = parseInt((cardList[i].stopTime - now) / 1000 / 60 / 60 / 24) + 1
            cardList[i].moretime = moretime
            // if ((cardList[i].voucherDepositLimit / 100) > that.data.money) {
            //   cardList[i].time = 3 //未超时，最低价过高
            // }
          } else {
            cardList[i].time = 4  //超时
          }
          cardList[i].startTime = changtime.tsFormatTime(cardList[i].startTime, 'Y/M/D')
          cardList[i].stopTime = changtime.tsFormatTime(cardList[i].stopTime, 'Y/M/D')
        }
        const onTime = []

        cardList.map((value) => {
          if (value.time!=4) {
            onTime.push(value)
          }
        })
        function sortnum(a, b) {
          return a.moretime - b.moretime
        }
        onTime.sort(sortnum)

        function sortnum(a, b) {
          return a.time - b.time
        }
        that.setData({
          cardList: onTime
        })
      }
    })

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