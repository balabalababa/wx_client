const fetch = require('../../utils/fetch.js')
const dataUrl = require('../../utils/utils.js')
var app = getApp()
Page({
  data: {
    points:'',
    imgUrls: [
      '/assets/banner.jpg'
    ],
    // nav: ["品质生活", "幸运抽奖", "轻松定制"],
    nav: ["现场兑换","线上兑换"],
    curnavIndex: 0,
    hotGoods: [],
    goods: {
      pop: {
        page: 0,
        list: []
      },
      luck: {
        page: 0,
        list: []
      },
      sell: {
        page: 0,
        list: []
      },
    },
    showGood: [],
    currentType: 'pop',
    openid: ''
  },
  tabClick: function(e) {
    this.setData({
      curnavIndex: e.target.dataset.index
    })
     switch (e.target.dataset.index) {
      case 0:
        this.setData({
          currentType: 'pop'
        })
        this.setData({
          showGood: this.data.goods[this.data.currentType].list
        })
        break;
      case 1:
        this.setData({
          currentType: 'sell'
        })
        this.setData({
          showGood: this.data.goods[this.data.currentType].list
        })
        break;
    }
  },
  //判断有无下单电
  // clickToPoint() {
  //   let that = this;
  //   wx.request({
  //     url: dataUrl.url + 'wxjf/userRecord',
  //     data: {
  //       wxOpenid: that.data.openid
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //     },
  //     success(res) {
  //       if (res.data.code == 1) {
  //        that.show()
  //       } else {
  //         wx.redirectTo({
  //           url: '/pages/points/userPhone/userPhone',
  //         })
  //       }
  //     }
  //   })
  // },
  login() {
    let that = this;
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
            that.setData({
              openid: res.data.data
            });
            //判断有无下单电
            that.userInfo()
          }
        });

      }
    })
  },
  onLoad: function() {
    let that = this;
    that.login()
    this.setData({
      showGood: this.data.goods[this.data.currentType].list
    })
    //礼品列表
    wx.request({
      url: dataUrl.url +'wxjf/gift?page=0&properties=giftSerial&size=500',
      success(res){
        let data = res.data.data;
        let arr1=[];
        let arr2= [];
        let arr3 = [];
        data.forEach(function(i){
          i.total = encodeURIComponent(JSON.stringify(i));
          if (i.giftType == "现场兑换"){
            arr1.push(i)
          }
          if (i.giftType == "幸运抽奖") {
            arr2.push(i)
          }
          if (i.giftType == "线上兑换") {
            arr3.push(i)
          }
        })
        that.setData({
          ['goods.pop.list']:arr1,
          ['goods.luck.list']: arr2,
          ['goods.sell.list']: arr3,
          showGood:arr1,
          hotGoods:data
        })
      }
    })
  },
  //跳转
  clicknav:function(e){
    let that = this;
    wx.request({
      url: dataUrl.url + 'wxjf/userRecord',
      data: {
        wxOpenid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.data.code == 1) {
          wx.navigateTo({
            url: e.currentTarget.dataset.link + '?openid=' + that.data.openid,
          })
        } else {
          wx.redirectTo({
            url: '/pages/points/userPhone/userPhone',
          })
        }
      }
    })
  
  },
  userInfo:function(){
    let that = this;
    wx.request({
      url: dataUrl.url + 'wxjf/userRecord',
      data: {
        wxOpenid: that.data.openid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            points: res.data.data[0].userPoint
          })
        }
      }
    })
  },
  onShow(){
    this.userInfo()

    this.setData({
      showGood: this.data.goods[this.data.currentType].list
    })
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})