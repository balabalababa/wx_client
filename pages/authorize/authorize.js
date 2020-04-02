const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    urlIndex: "",
    title: '',
    deposit: '',
    id: '',
    stock: '',
    productFlag: ''
  },
  onLoad: function(options) {
    var urlIndex = options.urlIndex
    this.setData({
      urlIndex: urlIndex,
      title: options.title ,
      deposit: options.deposit ,
      id: options.id,
      stock: options.stock ,
      productFlag: options.productFlag
    })

  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      console.log(e.detail.userInfo)
      wx.login({
        success: function(res) {
          //console.log(res)
          wx.request({
            url: "https://mall.qszhuang.com/pay/userLogin",
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              protrait: e.detail.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //console.log(res)
              console.log("插入小程序登录用户信息成功！");
            }
          });
          //授权成功后，跳转进入小程序首页
          if (that.data.urlIndex == 1) {
            // wx.navigateBack({
            //   delta: 1  // 返回上一级页面。
            // })
            wx.navigateTo({
              url: '/pages/submit/submit?title=' + that.data.title + '&deposit=' + that.data.deposit + '&id=' + that.data.id + '&stock=' + that.data.stock + '&productFlag=' + that.data.productFlag
            });
           
          } else {
            wx.switchTab({
              url: '/pages/profile/profile'
            })
          }
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }

})