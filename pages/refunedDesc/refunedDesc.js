const dataUrl = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    descFlag: false,
    orderNo: '',
    flag: true,
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    })
  },

  formSubmit: function (e) {
    wx.showLoading({
      title: '退款中',
    })
    let formData = e.detail.value;
    for (let key in formData) {
      if (!!!formData[key]) {
        wx.showToast({
          title: '请把退款信息填写完整',
          icon: 'loading'
        })
        return false;
      }
    }
    this.setData({
      list: formData,
      flag: false
    });
    this.getinfo();
  },
  handleClick: function (e) {
    if (e.detail.value == "其他") {
      this.setData({
        descFlag: true
      })
    } else {
      this.setData({
        descFlag: false
      })
    }
  },
  getinfo() {
    let that = this;
    wx.request({
      url: getApp().globalData.apiUrl + 'pay/wxRefund',
      data: {
        orderNo: that.data.orderNo,
        refund_desc: JSON.stringify(that.data.list)
      },
      success: function (respon) {
        that.setData({
          flag: true
        })
        if (respon.data.status === 200) {
          wx.showToast({
            title: '退款成功',
          })
          wx.redirectTo({
            url: '/pages/refund/refund?orderId=' + that.data.orderNo,
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '退款失败',
            icon: 'loading'
          })
        }
      }
    })
  },
  onShareAppMessage: function () {

  }
})