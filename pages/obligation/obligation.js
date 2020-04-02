const fetch = require('../../utils/fetch.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // countDownDay: 0,
    // countDownHour: 0,
    countDownMinute: "",
    countDownSecond: "",
    informations: "",
    orderId: "",
    createtime: "",
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
    wx.request({
      url: getApp().globalData.apiUrl + 'backstage/live/forwardNews',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "orderNo": orderId,
        "openid": getApp().globalData.openid
      }
    })
    fetch('user/checkOrderDesc/' + orderId).then(res => {
      console.log(res.data)
      this.setData({
        createtime: res.data.data.orderCreateTime
      })
      //开始日期转换
      var startdate = res.data.data.orderStartDate
      var date = new Date(startdate)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日";
      res.data.data.orderStartDate = time
      //结束日期转换
      var startdate = res.data.data.orderStopDate
      var date = new Date(startdate)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日";
      res.data.data.orderStopDate = time;

      //下单时间转换
      var startdate = res.data.data.orderCreateTime
      var date = new Date(startdate)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var H = date.getHours();
      var F = date.getMinutes();
      var S = date.getSeconds();
      var time = Y + "-" + M + "-" + D + " " + H + ":" + F + ":" + S;
      res.data.data.orderCreateTime = time;
      this.setData({
        informations: res.data.data,
        list: JSON.parse(res.data.data.orderRemarks)
      })
      fetch('itempage/' + this.data.informations.productID).then(res => {
        this.setData({
          productFlag: res.data.productFlag,
          productTitleImgList: res.data.productTitleImgList[0]
        })
      })
    })
  },

  // 页面渲染完成后 调用
  onReady: function () {
    var that = this
    setTimeout(function () {
      //要延时执行的代码
      console.log("渲染创建时间" + that.data.createtime)
      var myDate = new Date()
      myDate = myDate.getTime()
      console.log("现在时间" + myDate)
      var chazhi = 1800 - parseInt((myDate - that.data.createtime) / 1000)

      var totalSecond = chazhi

      // console.log(totalSecond)

      var interval = setInterval(function () {
        // 秒数
        var second = totalSecond;

        // 天数位
        // var day = Math.floor(second / 3600 / 24);
        // var dayStr = day.toString();
        // if (dayStr.length == 1) dayStr = '0' + dayStr;

        // 小时位
        // var hr = Math.floor((second - day * 3600 * 24) / 3600);
        // var hrStr = hr.toString();
        // if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor(second / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        that.setData({
          // countDownDay: dayStr,
          // countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr,
        });
        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(interval);
          wx.request({
            url: 'https://mall.qszhuang.com/pay/closeOrder/' + that.data.orderId,
          })
          wx.showToast({
            title: '已过期',
          });
          wx.navigateTo({
            url: '/pages/order/order',
          })
          that.setData({
            // countDownDay: '00',
            // countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });
        }
      }.bind(that), 1000);
    }, 800)

  },


  continuePay: function () {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    console.log(getApp().globalData)
    const order = getApp().globalData.order
    console.log('kdsjfsdehf' + order[0].orderId);
    for (var i = 0; i < order.length; i++) {
      if (order[i].orderId == that.data.orderId) {
        console.log('kdsjfsdehf' + order[i].orderId);
        wx.requestPayment({
          'timeStamp': order[i].timeStamp,
          'nonceStr': order[i].nonceStr,
          'package': order[i].prepayId,
          'signType': 'MD5',
          'paySign': order[i].sign,
          'success': function (res) {
            console.log("支付成功");
            console.log(that.data.orderId);
            wx.redirectTo({
              url: '/pages/order/order',
            })
          },
          'fail': function (res) {
            console.log(res);
            //console.log(that.data.orderId);
            if (res.errMsg == "requestPayment:fail cancel") {
              wx.redirectTo({
                url: '/pages/order/order',
              })
            } else {
              wx.request({
                url: 'https://mall.qszhuang.com/pay/closeOrder/' + that.data.orderId,
              })
            }
          },
          'complete': function (res) {}
        })
      }
    }
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