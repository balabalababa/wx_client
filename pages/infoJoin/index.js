const changtime = require('./../../utils/time.js')
Page({
  data: {
    dataList:[]
  },

  getdata:function(){
    let that=this;
    wx.request({
      url:getApp().globalData.apiUrl+'backstage/live/activityByUserPhone',
      data:{
        openid:getApp().globalData.openid
      },
      success:function(res){
        that.setData({
          dataList:res.data.data
        })
      }
    })
  },
  handleClick:function(e){
    let act=e.currentTarget.dataset.act;
    console.log(act)
    if(act.isDeleted==1){
      wx.navigateTo({
        url: '/pages/adver/adver?activityId='+act.activityId+'&activityCity='+act.activityCity,
      })
    }
  },
  onLoad: function (options) {
    this.getdata()
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