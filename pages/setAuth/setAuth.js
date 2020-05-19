// pages/setAuth/setAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.scene)
    this.setData({
      brandId:options.scene
    })
  
  },
  become:function(){
    let _this=this;
    wx.login({
      complete: (res) => {
        if(res.code){
          wx.request({
            url: getApp().globalData.apiUrl+'user/becomeWriter',
            method:'POST',
            data:{
              code:res.code,
              brandId:_this.data.brandId
            },
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:res=>{
              if(res.data.status==200){
                wx.showToast({
                  title: '成功成为核销员',
                })
              }
              else{
                wx.showToast({
                  title: '失败',
                  icon:'loading'
                })
              }
            }
          })
        }
      },
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