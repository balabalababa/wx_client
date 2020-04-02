// pages/card/card.js
const fetch = require('../../utils/fetch.js')
const changtime = require('../../utils/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    openid: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    const openid = options.openid
    that.setData({
      openid: openid
    })
    fetch('user/voucher?openId=' + openid ).then(res => {
      if (res.data.data!=null && res.data.data.length>0){
        for (var i = 0; i < res.data.data.length; i++) {
          const now = new Date()
          if (res.data.data[i].stopTime >= now) {
            res.data.data[i].time = true
            console.log()
            const moretime=parseInt((res.data.data[i].stopTime-now)/1000/60/60/24)+1
            res.data.data[i].moretime=moretime
          }
          else {
            res.data.data[i].time = false
          }
        res.data.data[i].startTime = changtime.tsFormatTime(res.data.data[i].startTime, 'Y/M/D')
        res.data.data[i].stopTime = changtime.tsFormatTime(res.data.data[i].stopTime, 'Y/M/D')
      }
     
      const cardList = res.data.data 
        const onTime = []    
        cardList.map((value) => {
          if (value.time) {
            onTime.push(value)
          }
        })
     
        function sortnum(a, b) {
          return a.voucherValue - b.voucherValue
        }
        onTime.sort(sortnum)
      that.setData({
        cardList: onTime
      })
      }
    
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