const fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informations: "",
    orderId: "",
    createtime: "",
    productFlag:'',
    productTitleImgList: '',
    list: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId
    console.log(orderId)
    this.setData({
      orderId: orderId
    })
    fetch('user/checkOrderDesc/' + orderId).then(res => {
      console.log(res.data)
      this.setData({
        createtime: res.data.data.orderCreateTime,
      })
      console.log("创建时间" + this.data.orderCreateTime)
      //开始日期转换
      var startdate = res.data.data.orderStartDate
      var date = new Date(startdate)

      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日"
      //console.log(starttime)
      res.data.data.orderStartDate = time
      //结束日期转换
      var startdate = res.data.data.orderStopDate
      var date = new Date(startdate)

      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日"
      //console.log(starttime)
      res.data.data.orderStopDate = time
      
      //下单时间转换
      var startdate = res.data.data.orderCreateTime
      var date = new Date(startdate)

      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var H = date.getHours();
      var F = date.getMinutes();
      var S = date.getSeconds();
      var time = Y + "-" + M + "-" + D + " " + H + ":" + F + ":" + S
      //console.log(starttime)
      res.data.data.orderCreateTime = time

      this.setData({
        informations: res.data.data,
        list: res.data.data.orderRemarks == "undefined" ? [] : JSON.parse(res.data.data.orderRemarks)
      })
      fetch('itempage/' + this.data.informations.productID).then(res => {
        this.setData({
          productFlag: res.data.productFlag,
          productTitleImgList: res.data.productTitleImgList[0]
        })
      })
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