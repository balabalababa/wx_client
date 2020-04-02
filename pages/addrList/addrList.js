const fetch = require('../../utils/fetch.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    addrList: '',
    dete: false,
    selList: [],
    anchor: '1',
    being: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    that.setData({
      openId: app.globalData.openid
    })
    fetch('/user/address/list?openId=' + that.data.openId).then(res => {
      console.log(res.data)
      if (res.data.data) {
        if (res.data.data.length < 1) {
          that.setData({
            being: false,
            dete: false
          })
        } else {
          that.setData({
            being: true,
          })
        }
        that.setData({
          addrList: res.data.data
        })
        const addrList = this.data.addrList;
        for (var i = 0; i < addrList.length; i++) {
          addrList[i].selStatu = false;
        }
        that.setData({
          addrList: addrList,
        })
      }
      let arr1 = []
      for (let i = 0; i < that.data.addrList.length; i++) {
        arr1[i] = that.data.addrList[i].addressContent.split('-')
        var addressContent = 'addrList[' + i + '].addressContent'
        that.setData({
          [addressContent]: arr1[i]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
 
  },


  dete: function() {
    var that = this;
    let arr=that.data.addrList
    that.setData({
      dete: !that.data.dete
    })
    if(!that.data.dete){
      for(var i=0;i<arr.length;i++){
        arr[i].selStatu=false
      }
      that.setData({
        addrList:arr
      })
    }
    console.log(that.data.addrList)
  },
  bind: function(e) {
    if (this.data.dete) {
      let selArr = this.data.selList;
      let selId = e.currentTarget.dataset.addressid || e.target.dataset.addressid
      console.log(selId )
      let dataList = this.data.addrList;
      let index = this.data.selList.indexOf(selId);
      if (index < 0) {
        selArr.push(selId);
        dataList.map((value) => {
          if (value.addressId == selId) {
            value.selStatu = true
          }
        })
      } else {
        dataList.map((value) => {
          if (value.addressId == selId) {
            value.selStatu = false
          }
        })
        selArr.splice(index, 1)
      }
      this.setData({
        selList: selArr,
        addrList: dataList,
      })
      console.log(this.data.selList)
    } 
  
  },
  delItem:function() {
    let selArr = this.data.selList;
    console.log(selArr)
    for (let i = 0; i < selArr.length; i++) {
      var that = this
      wx.request({
        url: 'https://mall.qszhuang.com/user/address/delete',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        data: {
          addressId: selArr[i],
        },
        success: function(res) {
          wx.showToast({
            title: '删除成功',
          })
        }
      })
    }
    that.onLoad()
  },
  return:function(e){
    console.log(e)
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];//prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    let selId = e.currentTarget.dataset.addressid || e.target.dataset.addressid
    let dataList = this.data.addrList;
    let delivery = '';
    dataList.map((value) => {
      if (value.addressId == selId) {
        delivery = value
      }
    })
    
    delivery.addressContent = delivery.addressContent.join('')
    console.log(delivery)
    prevPage.setData({
      delivery: delivery
    })
    
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})