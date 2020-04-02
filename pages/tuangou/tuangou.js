// pages/tuangou/tuangou.js
const fetch = require('../../utils/fetch.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
var app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    proitem:[],
    indicatorDots: true,
    aotoplay: true,
    interval: 1000,
    duration: 1000,

    // tab切换  
    currentTabsIndex:0,

    brand:[],
    information:[],
    subItems:[],
    price:[],
    startdate:[],
    stopdate:[],
    pro_comments:[],
    ellipsis: true, // 文字是否收起，默认收起
    id: -1,
    num: "",
    stock:"",
    imgAndTxt: []
  },


  //根据地址打开地图
  seeMap: function () {

    //console.log("sdasd")
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }

    // });

    qqmapsdk.geocoder({
      address: this.data.brand.brandAddress,
      success: function (res) {
        //console.log(res);
        var latitude = res.result.location.lat
        var longitude = res.result.location.lng
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const id =options.id
    console.log(id)
    const brandid = options.brandid
    console.log(brandid)
    const price = options.price
    const comprice = options.comprice
    const deposit = options.deposit
    const title = options.title
    const subtitle = options.subtitle
    const stock = options.stock
   
    this.setData({ 
      price: [price, comprice, deposit, title, subtitle, brandid, id],
      stock: stock
    })
     console.log(this.data.price)
    fetch('brpage/base/' + brandid).then(res => {
      this.setData({ brand: res.data.data })
      console.log(this.data.brand)
    })

//获取产品评论信息
    let { pageIndex, pageSize } = this.data
    const params = { page: 1, limit: 2 }
    fetch('itempage/appraisal/' + id, params).then(res => {
      this.setData({
        num: res.data.msg
      })
      for (var i = 0; i < res.data.data.length; i++) {
        var createdate = res.data.data[i]
        var date = new Date(createdate.appraisal_createdate)

        // console.log(date)
        //年
        var Y = date.getFullYear();
        //月
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var starttime = Y + "-" + M + "-" + D
        //console.log(starttime)
        res.data.data[i].appraisal_createdate = starttime
      }
      this.setData({ pro_comments: res.data.data })
      console.log(this.data.pro_comments)
    })

    fetch('itempage/' + id).then(res => {
      console.log(res)
      this.setData({ information: res.data.data[0].buyNeedKnows})
      console.log(this.data.information)
      var date = new Date(this.data.information.startdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var starttime = Y + "-" + M + "-" + D
      this.setData({ startdate: starttime })
// console.log(this.data.startdate)
      var date = new Date(this.data.information.stopdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

      var stopdate = Y + "-" + M + "-" + D
      this.setData({ stopdate: stopdate})

      this.setData({ subItems: res.data.data[1].subItems})
      this.setData({ proitem: res.data.data[2].item })
      //console.log("折扣信息" + this.data.proitem.brandid)
    })

    fetch('itempage/imgAndTxt/' + id).then(res => {
      this.setData({ imgAndTxt: res.data.data })
      //console.log(this.data.imgAndTxt)
    })

    qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD'
    });
    
  },


 /** 
   * 点击tab切换 
   */
  onTabsItemTap:function(e){
    var that = this;
    //console.log(e.target.dataset.current);
    if (this.data.currentTabsIndex === e.target.dataset.current) {
      return false;
    } else{
      this.setData({
        currentTabsIndex: e.target.dataset.current
      })
    }
  },

  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.brand.brandTelephone,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  // /** 
  //    * 滑动切换tab 
  //    */
  // bindChange: function (e) {

  //   var that = this;
  //   that.setData({ currentTabsIndex: e.detail.current });

  // },  

  getCode: function (e) {
    var that = this;

    wx.navigateTo({
      url: '/pages/submit/submit?title=' + that.data.price[3] + '&brandid=' + that.data.price[5] + '&deposit=' + that.data.price[2] + '&id=' + that.data.information.id + '&stock=' + that.data.stock
    });
    //console.log(this.data.price[2])
    //console.log(this.data.information.id)
    

    //console.log(that.data.price)
    
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
  
  },

})