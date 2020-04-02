const dataUrl = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redoomInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     redoomInfo: JSON.parse(options.item)
   })
  },
  recive(){
    let that=this;
    wx.request({
      url: dataUrl.url + 'wxjf/receive',
      method:'post',
      data:{
        onceId:parseInt(that.data.redoomInfo.onceId)
      },
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.data.code==1){
          wx.showToast({
            title: res.data.msg,
            duration:1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
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