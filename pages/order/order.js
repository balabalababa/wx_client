const fetch = require('../../utils/fetch.js')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    orders: [],
    unpaynum: 0,
    refundnum: 0,
    commentnum: 0,
    gousenum: 0,
    top:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
    var orderTotalMoney=options.orderTotalMoney
    var that = this;
    wx.login({
      success: function(res) {
        console.log(res.code)
        wx.request({
          url: 'https://mall.qszhuang.com/user/checkUserOrder',
          // url:'http://192.168.0.175:8080/user/checkUserOrder',
          header: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          success: function(res) {

            var unpaynum = 0
            var gousenum = 0
            var commentnum = 0
            var refundnum = 0 
             
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i] == null)
              {
                continue;
              }
              var createdate = res.data.data[i]
              var date = new Date(createdate.orderStopDate)
              // console.log(date)
              //年
              var Y = date.getFullYear();
              //月
              var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
              //日
              var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
              var stoptime = Y + "-" + M + "-" + D
              //console.log(starttime)
              res.data.data[i].orderStopDate = stoptime

              if (createdate.orderStatus == 0) {
                createdate.orderStatus = "订单关闭"
              } else if (createdate.orderStatus == -1) {
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
              } else if (createdate.orderStatus == 1 && createdate.isAppraise == 0) {
                commentnum++
                createdate.orderStatus = "待评价"
                that.setData({
                  commentnum: commentnum
                })
              } else if (createdate.orderStatus == 1) {
                createdate.orderStatus = "已完成"
              } 
                else if (createdate.orderStatus == 3) {
                refundnum++
                createdate.orderStatus = "已退款"
                that.setData({
                  refundnum: refundnum
                })
              } else if (createdate.orderStatus == 2) {
                createdate.orderStatus = "退款中"
              } else if (createdate.orderStatus == 6) {
                createdate.orderStatus = "拒绝退款"
                gousenum++
                that.setData({
                  gousenum: gousenum
                })
              } else {
                createdate.orderStatus = 10
              }
            }
            let orderList=[];
            res.data.data.forEach(i=>{
              if(i!=null){
                orderList.push(i)
              }
            })
            that.setData({
              orders: orderList
            })
            //console.log(that.data.orders.length)

            /** 
             * 获取系统信息 
             */
            wx.getSystemInfo({
              success: function(res) {
                console.log(res)
                var haha = that.data.orders.length * that.data.top
                that.setData({
                  winWidth: res.windowWidth,
                  winHeight: haha < res.windowHeight ? res.windowHeight : haha
                });
              }
            });
          }
        })
      }
    })
    if (options == 1) {
      num = that.data.unpaynum
    } else if (options == 2) {
      num = that.data.gousenum
    } else if (options == 3) {
      num = that.data.commentnum
    } else if (options == 4) {
      num = that.data.refundnum
    } else if (options == 0) {
      num = that.data.orders.length
    }
    let num=''
    num = that.data.unpaynum
    wx.getSystemInfo({
      success: function (res) {
        console.log(num)
        var haha = num * that.data.top
        that.setData({
          winWidth: res.windowWidth,
          winHeight: haha < res.windowHeight ? res.windowHeight : haha
        });
        console.log(that.data.winHeight)
        //console.log(that.data.orders.length)
      }
    });
    that.setData({
      currentTab:options.num
    })
  },

  goto: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.hi == "已付款") {
      console.log("重定向到已付款")
      wx.redirectTo({
        url: '/pages/prepaid/prepaid?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (e.currentTarget.dataset.hi == "待付款") {
      wx.redirectTo({
        url: '/pages/obligation/obligation?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (e.currentTarget.dataset.hi == "待评价") {
      wx.redirectTo({
        url: '/pages/comments/comments?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (e.currentTarget.dataset.hi == "已退款") {
      wx.navigateTo({
        url: '/pages/refunded/refunded?orderId=' + e.currentTarget.dataset.orderid,
      })
    } else if (e.currentTarget.dataset.hi == "订单关闭") {
      wx.navigateTo({
        url: '/pages/cancel/cancel?orderId=' + e.currentTarget.dataset.orderid,
      })
    }else if (e.currentTarget.dataset.hi == "退款中") {
      wx.navigateTo({
        url: '/pages/refund/refund?orderId=' + e.currentTarget.dataset.orderid,
      })
    }else if (e.currentTarget.dataset.hi == "拒绝退款") {
      wx.redirectTo({
        url: '/pages/prepaid/prepaid?orderId=' + e.currentTarget.dataset.orderid,
      })
    }
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;
    //that.setData({ currentTab: e.detail.current });
    console.log(e.detail.current)

    var that = this;
    var num;
    if (e.detail.current == 1) {
      num = that.data.unpaynum
    } else if (e.detail.current == 2) {
      num = that.data.gousenum
    } else if (e.detail.current == 3) {
      num = that.data.commentnum
    } else if (e.detail.current == 4) {
      num = that.data.refundnum
    } else if (e.detail.current == 0) {
      num = that.data.orders.length
    }
    wx.getSystemInfo({
      success: function(res) {
        console.log(num)
        var haha = num * that.data.top
        that.setData({
          winWidth: res.windowWidth,
          winHeight: haha < res.windowHeight ? res.windowHeight : haha
        });
        console.log(that.data.winHeight)
        //console.log(that.data.orders.length)
      }
    });
    that.setData({
      currentTab: e.detail.current
    })
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var num;
      if (e.target.dataset.current == 1) {
        num = that.data.unpaynum
      } else if (e.target.dataset.current == 2) {
        num = that.data.gousenum
      } else if (e.target.dataset.current == 3) {
        num = that.data.commentnum
      } else if (e.target.dataset.current == 4) {
        num = that.data.refundnum
      } else if (e.target.dataset.current == 0) {
        num = that.data.orders.length
      }
      wx.getSystemInfo({
        success: function(res) {
          console.log(num)
          var haha = num * that.data.top
          that.setData({
            winWidth: res.windowWidth,
            winHeight: haha < res.windowHeight ? res.windowHeight : haha
          });
          console.log(that.data.winHeight)
          //console.log(that.data.orders.length)
        }
      });
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.no_see').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为myText的元素的信息 的数组
      console.log(res);
      that.setData({
        top: res[0].height
      })
    })
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