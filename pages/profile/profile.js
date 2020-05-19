const dataUrl = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    gousenum: '',
    unpaynum: '',
    commentnum: '',
    showFlag:false
  },

  shouquan: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },

  // 获取直播权限
  getLive:function(){
    wx.request({
      url:getApp().globalData.apiUrl+'user/selectAdmin',
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        openid:getApp().globalData.openid
      },success:res=>{
        this.setData({
          showFlag:res.data.data
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this
    if (getApp().globalData.openid == "" || getApp().globalData.openid == null || getApp().globalData.openid == undefined){
      that.login()
    }
    else{
      that.getLive()
      that.setData({
        openid:getApp().globalData.openid
      })
    }
    this.content()
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  login(){
    let that=this;
    wx.login({
      success: function (res) {
        //加一个请求, 直接进入当前页也可以获取 openid
        wx.request({
          url: "https://mall.qszhuang.com/user/openid",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            getApp().globalData.openid = res.data.data
            that.getLive()
            that.setData({
              openid: res.data.data
            });   
          }
        });

      }
    })
  },
  content(){
    let that=this;
    var unpaynum = 0
    var gousenum = 0
    var commentnum = 0
    wx.login({
      success:function(res){
        wx.request({
          url: 'https://mall.qszhuang.com/user/checkUserOrder',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              var createdate = res.data.data[i]
              if (createdate.orderStatus == -1||createdate.orderStatus == 6) {
                gousenum++
                createdate.orderStatus = "已付款"
                that.setData({
                  gousenum: gousenum
                })
              } else if (createdate.orderStatus == -2) {
                unpaynum++
                createdate.orderStatus = "待付款"
                that.setData({
                  unpaynum: unpaynum
                })
                console.log(unpaynum)
              } else if (createdate.orderStatus == 1 && createdate.isAppraise == 0) {
                commentnum++
                createdate.orderStatus = "待评价"
                that.setData({
                  commentnum: commentnum
                })
              }
            }
            // console.log(that.data.unpaynum)
          }
        })
      }
    })

  },
  onShow: function() {
    let that = this
    var unpaynum = 0
    var gousenum = 0
    var commentnum = 0
    that.setData({
      commentnum: commentnum,
      unpaynum: unpaynum,
      gousenum: gousenum
    })
    if (getApp().globalData.openid == "" || getApp().globalData.openid == null || getApp().globalData.openid == undefined) {
      that.login()
    }
    else {
      that.setData({
        openid: getApp().globalData.openid
      })
    }
    that.content()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})