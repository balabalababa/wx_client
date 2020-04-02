const fetch = require('../../utils/fetch.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')

var qqmapsdk;


// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: [],
    pageIndex: 0,
    pageSign: 0,
    pageSize: 10,
    hasMore: true,
    inputText: "",
    cityId: "1",
    cityText: "北京", //初始城市是北京
    imgUrls: [],
    flag: 0,

  },
  //获取搜索输入框输入的内容
  inputText: function(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  //将输的内容传到另一个页面
  searchDetail: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/all/all?inputText=' + that.data.inputText + '&cityId=' + that.data.cityId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onLoad: function(options) {
 
    this.loadMore()
    var qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD' // 必填
    });
    var that = this

    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log(res);
            var city = res.result.address_component.city
            var cityIdx;
            var cityText;
            if (city == "杭州市") {
              cityIdx = 3
              cityText = "杭州"
            } else if (city == "上海市") {
              cityIdx = 2
              cityText = "上海"
            } else {
              cityIdx = 1
              cityText = "北京"
            }
            that.setData({
              cityText: cityText,
              cityId: cityIdx
            })

            // fetch('back/config/home/img/' + that.data.cityId).then(res => {
            //   var d = JSON.parse(res.data.data.configContent)
            //   console.log(d)
            //   that.setData({
            //     imgUrls: d
            //   })
            // })

            let {
              pageIndex,
              pageSize
            } = that.data
            console.log("定位之后" + pageIndex)
            that.setData({
              pageSign: 1
            })
            const params = {
              page: pageIndex,
              limit: pageSize
            }
            return fetch('home/list/product?cityId=' + that.data.cityId, params).then(res => {
              res.data.data.forEach(item => {
                item.productTitleImg = JSON.parse(item.productTitleImg)
              })
              const totalCount = parseInt(res.data.msg)
              const hasMore = pageIndex * pageSize < totalCount
              var shops = res.data.data
              for (let index = 0; index < shops.length; index++) {
                fetch('itempage/' + shops[index].productID).then(res => {
                  shops[index].productComPrice = res.data.productComPrice
                })
              }
              that.setData({
                shops: shops,
                pageIndex: 0,
                hasMore: true
              })
              that.getBannerPic()
            })

          },
          fail: function(res) {
            console.log(res);
          }

        });
      }

    })
    //console.log(this.data.cityId)
    //console.log(this.data.cityText)


    wx.login({
      success: function(res) {
        wx.request({
          url: "https://mall.qszhuang.com/user/openid",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            //从数据库获取用户信息
            // that.queryUsreInfo();
            console.log(res.data.data)
            //console.log("插入小程序登录用户信息成功！");
            getApp().globalData.openid = res.data.data
            console.log(getApp().globalData.openid)
          }
        });
      }
    })

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
    console.log("ONSHOW")
    var that = this
    if (this.data.flag == 1) {
      setTimeout(function() {
        that.setData({
          shops: [],
          pageIndex: 0,
          pageSign: 0,
          hasMore: true,
          flag: 0
        })
        that.loadMore();
      }, 0)
    }

    //if (!that.data.hasMore) return
    this.getBannerPic()
    // fetch('back/config/home/img/' + this.data.cityId).then(res => {
    //   //console.log(res)
    //   //console.log(res.data.data.configContent)
    //   var d = JSON.parse(res.data.data.configContent)
    //   console.log(d)
    //   this.setData({
    //     imgUrls: d
    //   })
    // })
    //console.log(this.data.shops)
  },

  // 获取头图
  getBannerPic(){
    fetch('activity/selectByActivityCity', {
      activityCity: this.data.cityId
    }).then(res => {
      let imgarr=res.data.data.filter(v=>v.isDeleted==1)
      this.setData({
        imgUrls: imgarr
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    //重新加载数据
    this.setData({
      shops: [],
      pageIndex: 0,
      hasMore: true
    })
    this.loadMore().then(() => wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //在这里加载下一页的数据
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //加载下一页数据
  loadMore() {
    var that = this
    if (!this.data.hasMore) return

    let {
      pageIndex,
      pageSize
    } = this.data
    // this.setData({
    //   pageIndex: ++pageIndex
    // })
    if (this.data.pageSign == 1) {
      pageIndex++
    }
    console.log("pageSign" + this.data.pageSign)
    console.log("加载下一页数据" + pageIndex)
    const params = {
      page: ++pageIndex,
      limit: pageSize
    }
    return fetch('home/list/product?cityId=' + that.data.cityId, params).then(res => {
      res.data.data.forEach(item => {
        item.productTitleImg = JSON.parse(item.productTitleImg)
      })
      const totalCount = parseInt(res.data.msg)
      const hasMore = pageIndex * pageSize < totalCount
      const shops = this.data.shops.concat(res.data.data)
      const pageSign = 0
      this.setData({
        shops,
        pageIndex,
        hasMore,
        pageSign
      })
    })
  }
})