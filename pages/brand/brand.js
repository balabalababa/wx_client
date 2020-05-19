const fetch = require('../../utils/fetch.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')

var qqmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    aotoplay: true,
    interval: 1000,
    duration: 1000,
    //品牌店面信息存储
    brand: [],
    //品牌网站产品信息存储
    recommend: [],
    stopdate: [],
    startdate: [],
    brand_comments: [],
    ellipsis: true, // 文字是否收起，默认收起
    nums: "",
    productTag:''
  },


  /**
   * 收起/展开按钮点击事件
   */
  ellipsis: function(e) {
    var value = !this.data.ellipsis;
    console.log(e.target.id)
    //console.log(this.data.brand_comments.length)
    for (let i = 0; i <= this.data.brand_comments.length; i++) {
      if (e.target.id == i) {
        this.setData({
          ellipsis: value
        })
      }
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(this.data.startdate)
    const id = options.brandid;
    fetch('home/updatedps/' + id).then(res => {})
    //获取该品牌信息
    fetch('brpage/base/' + id).then(res => {
      this.setData({
        brand: res.data.data
      })
      console.log(res.data.data)
    })
    //获取该品牌产品信息
    fetch('brpage/items/'+ id).then(res => {
      console.log("123"+res)
      for (var i = 0; i < res.data.data.length; i++){
        res.data.data[i].productTag = JSON.parse(res.data.data[i].productTag)
      }
      this.setData({
        recommend: res.data.data,
        productTag: res.data.data.productTag
      })
      console.log('啦啦啦'+res.data.data.productTag)
    })
    //获取该品牌评论信息

    let {
      pageIndex,
      pageSize
    } = this.data
    const params = {
      page: 1,
      limit: 2
    }
    fetch('brpage/appraisal/' + id, params).then(res => {
      console.log(res.data)
      this.setData({
        num: res.data.msg
      })
      //console.log(res.data.data[0].appraisal_createdate)
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

      this.setData({
        brand_comments: res.data.data
      })

      console.log(this.data.brand_comments)
    })

    qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD'
    });
  },

  //打电话
  tel: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.brand.brandTelephone,
    })
  },


  //根据地址打开地图
  seeMap: function() {

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
      success: function(res) {
        //console.log(res);
        var latitude = res.result.location.lat
        var longitude = res.result.location.lng
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })

      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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