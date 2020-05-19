const key = 'FEXBZ-76AC2-565UW-CA2LY-QEUCK-F5FJW'; //使用在腾讯位置服务申请的key
const referer = '轻松装补单'; //调用插件的app的名称
const location ='';
const category = '';
const chooseLocation = requirePlugin('chooseLocation');
const fetch = require('../../utils/fetch.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my: '全部',
    city: '',
    userInfo: {},
    openId: '',
    addressId: '',
    items: [{
        name: '新房',
        value: '新房'
      },
      {
        name: '旧房',
        value: '旧房',
        checked: 'true'
      },
      {
        name: '公司',
        value: '公司'
      },
    ],
    sexs: [{
        name: '0',
        value: '先生'
      },
      {
        name: '1',
        value: '女士',
        checked: 'true'
      },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
        openId: app.globalData.openid
    })
    if (options.addressId!='f') {
      this.setData({
        addressId: options.addressId
      })
      var that = this
      fetch('/user/address/single/' + that.data.addressId).then(res => {
        if (res.data) {
          that.setData({
            userInfo: res.data.data
          })

          let items = that.data.items
          items.map((value) => {
            if (value.name == that.data.userInfo.addressTag) {
              value.checked = true
            } else {
              value.checked = false
            }
          })
          let sexs = that.data.sexs
          sexs.map((value) => {
            if (value.name == that.data.userInfo.userGender) {
              value.checked = true
            } else {
              value.checked = false
            }
          })
          console.log(items, sexs)
          that.setData({
            items: items,
            sexs: sexs
          })
          const userInfo = this.data.userInfo;
          userInfo.addressContent = userInfo.addressContent.split('-');
          that.setData({
            userInfo: userInfo,
          })
          let city = ''
            city = userInfo.addressContent[0]
         
          that.setData({
            city: city
          })

        }
      })
    }
    else{
      this.setData({city:''})
    }

  },
  getUserLocation: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                     
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        }else{
          wx.chooseLocation({
            complete: (res) => {this.setData({city:res.address})},
          })
        }
      }
    })
  },
  onReady: function() {

  },

  onShow: function() {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  formSubmit: function(e) {
    e.detail.value.name = e.detail.value.name.replace(/\s+/g, '')
    e.detail.value.addrdetail = e.detail.value.addrdetail.replace(/\s+/g, '')
    e.detail.value.tel = e.detail.value.tel.replace(/\s+/g, '')
    var myreg = /^1[3456789]\d{9}$/;
    if (!myreg.test(e.detail.value.tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    if (e.detail.value.name == "" || e.detail.value.addrdetail == "" ||this.data.city==""||this.data.city==undefined) {
      wx.showToast({
        title: '信息不能为空',
      })
      return
    }
    if (e.detail.value.switch) {
      e.detail.value.switch = 1
    }
    if (!e.detail.value.switch) {
      e.detail.value.switch = 0
    }
    var that = this;
    var addressContent = that.data.city+'-'+ e.detail.value.addrdetail
    if (that.data.addressId) {
      wx.request({
        url: 'https://mall.qszhuang.com/user/address/edit',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          addressId: that.data.addressId,
          userName: e.detail.value.name,
          userPhone: e.detail.value.tel,
          addressContent: addressContent,
          userGender: e.detail.value.sex,
          addressTag: e.detail.value.group,
          addressStatus: e.detail.value.switch.toString()
        },
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
   else {
      wx.request({
        url: 'https://mall.qszhuang.com/user/address/add',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          userOpenid: that.data.openId,
          userName: e.detail.value.name,
          userPhone: e.detail.value.tel,
          addressContent: addressContent,
          userGender: e.detail.value.sex,
          addressTag: e.detail.value.group,
          addressStatus: e.detail.value.switch.toString()
        },
        success: function(res) {
          wx.navigateBack({
            delta: 1
          })
        },
      })
    }
  

  }
})