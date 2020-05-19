// pages/choose/choose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  bindtapFunc: function (e) {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];//prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    var cityId = e.target.id;
    var cityText = e.currentTarget.dataset.text;
    getApp().globalData.cityId=cityId;
    prevPage.setData({
      cityId: cityId,
      cityText: cityText,
      pageSign: 0,
      flag:1
    })
    //console.log(e.currentTarget.dataset.text)
    wx.navigateBack({

      delta: 1  // 返回上一级页面。

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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