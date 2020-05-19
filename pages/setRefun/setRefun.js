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
    openid: '',
    orderID: '',
    ifName: false,
    refundNote: '',
    orderStatus:''
  },
  onLoad: function (options) {
    let that = this;
    that.login()
    var orderId = options.scene
    that.setData({
      orderNo: orderId
    })
    that.getOrder(options.scene);
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.informations.userPhone
    })
  },
  refuned: function () {
    let _this = this;

    let info = _this.data.informations;
    wx.request({
      url: getApp().globalData.apiUrl + 'pay/merchantWxpay',
      method: 'POST',
      data: {
        openid: _this.data.openid,
        brandId: info.brandID,
        goosId: info.productID,
        goodsNum: 1,
        userId: info.userid,
        orderRemarks: '',
        userOrderNo: info.orderNo
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.status == 400) {
          wx.showToast({
            title: '订单正在操作',
            icon: "loading"
          });
          return false;
        }
        let refundData = res.data.data;
        wx.requestPayment({
          'timeStamp': refundData.timeStamp,
          'nonceStr': refundData.nonceStr,
          'package': refundData.prepayId,
          'signType': 'MD5',
          'paySign': refundData.sign,
          'success': function (res) {
            _this.setData({
              orderStatus:3
            })
            wx.request({
              url: getApp().globalData.apiUrl + 'pay/merchantRefundsUsers',
              method: 'POST',
              data: {
                merchantOrder: refundData.orderNo,
                orderNo: info.orderNo,
                outRefundNo: info.outRefundNo
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {

              }
            })
          },
          'fail': function (res) {
            wx.request({
              url: getApp().globalData.apiUrl + '/pay/merchantWxCancel',
              method: "POST",
              data: {
                userOrderNo: info.orderNo
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
              }
            })
          },
          'complete': function (res) {}
        })
      }
    })

  },
  changeTime: function (startdate) {
    // var startdate = res.data.data.orderCreateTime
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
    return time
  },
  login() {
    let that = this;
    wx.login({
      success: function (res) {
        //加一个请求, 直接进入当前页也可以获取 openid
        wx.request({
          url: getApp().globalData.apiUrl + "user/openid",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            getApp().globalData.openid = res.data.data
            that.setData({
              openid: res.data.data
            });
          }
        });

      }
    })
  },
  rejuestRefund: function () {
    this.setData({
      ifName: true
    })
  },
  onReady: function () {

  },

  getOrder: function (orderNo) {
    let that = this;
    wx.request({
      url: getApp().globalData.apiUrl + 'user/selectOrderAndRefund/' + orderNo,
      success: res => {
        console.log(res)
        res.data.data.orderCreateTime = that.changeTime(res.data.data.orderCreateTime);
        res.data.data.createTime = that.changeTime(res.data.data.createTime);
        res.data.data.refundDesc = JSON.parse(res.data.data.refundDesc)
        that.setData({
          informations: res.data.data,
          orderStatus:res.data.data.orderStatus,
          list: res.data.data.orderRemarks == "undefined" ? [] : JSON.parse(res.data.data.orderRemarks)
        })
        fetch('itempage/' + that.data.informations.productID).then(res => {
          that.setData({
            productFlag: res.data.productFlag,
            productTitleImgList: res.data.productTitleImgList[0],
            brandId: res.data.brandId
          })
        })
      }
    })
  },
  onShow: function () {
  },
  //驳回理由
  setValue: function (val) {
    this.setData({
      refundNote: val.detail.value
    })
  },
  cancel: function () {
    this.setData({
      ifName: false
    })
  },
  confirm: function () {
    let _this = this;
    if (_this.data.refundNote.length < 3) {
      return false;
    }

    wx.request({
      url: getApp().globalData.apiUrl + 'backstage/live/refsualOfRefund',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderNo: _this.data.orderNo,
        refundNote: _this.data.refundNote
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '操作成功',
          });
          _this.getOrder(_this.data.orderNo)
          _this.setData({
            ifName: false
          })
        } else {
          wx.showToast({
            title: '操作失败',
          })
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