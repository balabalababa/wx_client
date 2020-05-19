const fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: "",
    informations: [],
    productTitleImgList: '',
    list: '',
    openid:'',
    orderID:''
  },
  onLoad: function (options) {
    let _this=this;
    wx.login({
      success(res) {
        _this.setData({
          code:res.code
        })
        if (res.code) {
          //发起网络请求
          wx.request({
            url: getApp().globalData.apiUrl+"user/write",
            data: {
              orderNo: options.scene,
              code: res.code
            },
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              //从数据库获取用户信息
              _this.setData({
                openid:res.data.data
              })
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    var orderId = options.scene
    this.setData({
      orderNo: orderId
    })
    fetch('user/checkOrderDesc/' + orderId).then(res => {
      console.log(res.data)
      this.setData({
        createtime: res.data.data.orderCreateTime,
        orderID:res.data.data.orderID
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
          productTitleImgList: res.data.productTitleImgList[0],
          brandId: res.data.brandId
        })
      })
    })
  },
  endGood() {
    let _this=this;
    wx.request({
      url: getApp().globalData.apiUrl+'user/Writer',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        orderId : _this.data.orderID,
        openid:_this.data.openid
      },
      success:(res)=>{
        console.log(res.status)
        if(res.status==200){
          wx.showToast({
            title:'成功核销',
          })
        }
        else{
          wx.showToast({
            title:'核销失败',
            icon:'loading'
          })
        }
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