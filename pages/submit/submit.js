const fetch = require('../../utils/fetch.js');
var tcity = require("../../utils/citys.js");
const url="https://mall.qszhuang.com/";
// const url = "http://192.168.0.175:8080/";
var app = getApp()

// 设置时间列表
const years = [];
const months = [];
const days = [];
var year = new Date().getFullYear()
var month = new Date().getMonth() + 1
var day = new Date().getDate()
//获取年
years.push("" + year);

//获取月份
for (let i = month; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = day; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    price: [],
    information: [],
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    hide: true,
    userInfo: [],
    addressDetail: [],
    tags: [],
    subItems: [],
    stopdate: "",
    startdate: "",
    text1: "",
    text2: "",
    text3: "",
    orderId: "",
    disabled: false,
    stock: "",
    voucherValue: '',
    voucherId: '',
    voucher1: "",
    cardList: "",
    openid: '',
    money: '',
    productTitleImgList: '',
    brand: '',
    // 收货地址
    delivery: '',
    // 时间
    time: '',
    multiArray: [years, months, days],
    multiIndex: [0, 9, 0],
    choose_year: '',
    date: "",
    date1: "",
    // 品牌ID
    brandId: '',
    brandImageList: '',
    // 型号选择
    list: ''
  },
  // 时间选择
  wukong: function (e) {
    console.log(e)
    let that = this;
    that.setData({
      date1: e.detail.value
    })
  },

  addDot: function (arr) {
    if (arr instanceof Array) {
      arr.map(val => {
        if (val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
          return val;
        } else {
          val.fullNameDot = val.fullName;
          return val;
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.delivery = false
    // 商品类型
    that.setData({
      list: JSON.stringify(options.list)
    })
    // 获取用户信息
    wx.login({
      success(res) {
        wx.request({
          url: url + "user/openid",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            getApp().globalData.openid = res.data.data;
            that.setData({
              openid: res.data.data
            })
            // 获取地址
            fetch('/user/address/list?openId=' + getApp().globalData.openid).then(res => {
              if (res.data.data.length > 0) {
                for (var i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].addressContent = res.data.data[i].addressContent.split('-').join('')
                }
                that.setData({
                  delivery: res.data.data[0]
                })
              }
            })
          }
        });
      }
    })

    var stock = options.stock
    that.setData({
      stock: stock
    })
    const title = options.title
    const deposit = options.deposit
    const id = options.id
    const productFlag = options.productFlag
    //console.log(id)
    that.setData({
      price: [title, deposit, id, productFlag]
    })
    console.log(that.data.price[3])
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    var newMonth = month > 9 ? month : "0" + month;
    var day = new Date().getDate()
    var newDay = day > 9 ? day : "0" + day;
    //console.log("年" + year + "月" +month+"日"+new Date().getDate())
    this.setData({
      date: year + "-" + newMonth + "-" + newDay
    })

    var timestamp = Date.parse(that.data.date);
    timestamp = (timestamp / 1000 + 2592000) * 1000;
    var date = new Date(timestamp);
    console.log("当前时间：" + date);
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var newMonth = month > 9 ? month : "0" + month;
    var day = date.getDate()
    var newDay = day > 9 ? day : "0" + day;
    //console.log("年" + year + "月" +month+"日"+new Date().getDate())
    this.setData({
      date1: year + "-" + newMonth + "-" + newDay
    })
    var voucher1 = ""
    var voucherValue = ""
    var voucherId = ""
    fetch('pay/voucher?openId=' + getApp().globalData.openid + '&productId=' + that.data.price[2]).then(res => {
      console.log(res.data.data)
      if (res.data.data && res.data.data.length > 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          console.log(res.data.data[i].voucherDepositLimit, that.data.price[1])
          if ((res.data.data[i].voucherDepositLimit / 100) <= that.data.price[1]) {
            this.setData({
              voucher1: true
            })
            if (!that.data.cardList.voucherValue) {
              voucherValue = res.data.data[i].voucherValue
              voucherId = res.data.data[i].voucherId
            } else {
              voucherValue = that.data.cardList[i].voucherValue
              voucherId = that.data.data[i].voucherId
            }
            console.log(that.data.voucherId, voucherValue)
            i = res.data.length
          }
        }
        if ((that.data.price[1] - voucherValue / 100) < 0) {
          that.setData({
            money: 0
          })
        } else {
          that.setData({
            money: (that.data.price[1] - voucherValue / 100).toFixed(2)
          })
        }

      } else {
        that.setData({
          voucher1: false,
          voucherValue: 0,
          money: that.data.price[1]
        })

      }
      console.log(that.data.voucher1)
      that.setData({
        voucherValue: voucherValue / 100,
        voucherId: voucherId
      })
    })
    fetch('itempage/' + id).then(res => {
      var date = new Date(that.data.information.startdate)
      var newstr = JSON.parse(res.data.productParame); //返回一个新字符串
      that.setData({
        productTitleImgList: res.data.productTitleImgList[0],
        brand: newstr['品牌'],
        brandId: res.data.brandId
      })
      // 品牌信息
      fetch('brpage/base/' + that.data.brandId).then(res => {
        if (res.data) {
          that.setData({
            brandImageList: res.data.data.brandImageList[0]
          })
        }
      })
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var starttime = Y + "-" + M + "-" + D
      that.setData({
        startdate: starttime
      })
      // console.log(this.data.startdate)
      var date = new Date(that.data.information.stopdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

      var stopdate = Y + "-" + M + "-" + D
      that.setData({
        stopdate: stopdate
      })
      if (res.data.data) {
        that.setData({
          information: res.data.data[0].buyNeedKnows,
          tags: res.data.data[2].item.realTags
        })
      }
    })
    // console.log(this.data.information)
    that.userInfoInitial()

    //设置默认的年份
    that.setData({
      choose_year: that.data.multiArray[0][0]
    })
  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      date1: year + '-' + month + '-' + day
    })
    console.log(this.data.date1);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        if (num == month) {
          for (let i = day; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        } else {
          for (let i = 1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        }

        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        if (num == month) {
          for (let i = day; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        } else {
          for (let i = 1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        }

        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.price[3] != 2) {
      var timestamp = Date.parse(this.data.date);
      timestamp = (timestamp / 1000 + 2592000) * 1000;
      var date = new Date(timestamp);

      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var newMonth = month > 9 ? month : "0" + month;
      var day = date.getDate()
      var newDay = day > 9 ? day : "0" + day;
      //console.log("年" + year + "月" +month+"日"+new Date().getDate())
      this.setData({
        date1: year + "-" + newMonth + "-" + newDay
      })
    } else {
      this.setData({
        date1: this.data.date
      })
    }
    var that = this
    if (that.data.cardList) {
      console.log(that.data.cardList)
      var voucherValue = that.data.cardList.voucherValue
      var voucherId = that.data.cardList.voucherId
      that.setData({
        voucherValue: voucherValue / 100,
        voucherId: voucherId
      })
      if (that.data.price[1] - voucherValue / 100 < 0) {
        that.setData({
          money: 0
        })
      } else {
        that.setData({
          money: (that.data.price[1] - voucherValue / 100).toFixed(2)
        })
      }

    }


    // 地址刷新
    fetch('/user/address/list?openId=' + that.data.openid).then(res => {
      if (res.data.data.length == 0) {
        that.setData({
          delivery: false
        })
      }
      console.log(that.data.delivery)
    })
  },


  userInfoInitial: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: url + 'pay/userLogin',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data)
              that.setData({
                userInfo: res.data
              })
              console.log(that.data.userInfo)
              var add = that.data.userInfo.useraddress.split("-")
              that.setData({
                province: add[0],
                city: add[1],
                county: add[2],
                addressDetail: add[3],
                text1: that.data.userInfo.username,
                text2: that.data.userInfo.userphone,
                text3: add[3],
              })
            }

          })
          console.log(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  formSubmit: function (e) {
    var that = this;
    if (!that.data.delivery) {
      wx.showToast({
        title: '请填写地址',
      })
      return false;
    }
    if(that.data.money<=0){
      wx.showToast({
        title: '不可购买',
      })
      return false;
    }
    that.setData({
      disabled: true
    })
    //订阅消息
    wx.requestSubscribeMessage({
      tmplIds: ["JYYK6qgGy90hT49-i7_yTMaPyUOSiqzPmL6v9-u1VdE"],
      success: function (v) {
        that.order()
      },
      fail(v) {
        //失败
        that.order()
      }
    })
  },
  // 提交订单
  order: function () {
    let that = this;
    wx.login({
      success(resson) {
        wx.request({
          url: url + "user/openid",
          data: {
            code: resson.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            getApp().globalData.openid = res.data.data;
            wx.request({
              url: url + 'pay/createUser',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              data: {
                openid: getApp().globalData.openid,
                username: that.data.delivery.userName,
                userphone: that.data.delivery.userPhone,
                useraddress: that.data.delivery.addressContent
              },
              success: function (res) {
                console.log(res.data)
                if (res.data.msg == "error") {
                  wx.showToast({
                    title: '请填写地址',
                  })
                  return false;
                }
                wx.request({
                  url: url+'pay/wxpay',
                  data: {
                    openid: getApp().globalData.openid,
                    itemId: that.data.price[2],
                    goodsNum: 1,
                    stopDate: that.data.date1,
                    voucherId: that.data.voucherId,
                    orderRemarks: that.data.list
                  },
                  success: function(res) {
                    console.log(res.data)
                    that.setData({
                      orderId: res.data.msg
                    })
                    if (res.data.status == 500) {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'fail',
                        duration: 1500
                      })
                      that.setData({
                        disabled: false
                      })
                      return
                    }

                    app.globalData.timeStamp = res.data.data.timeStamp;
                    app.globalData.nonceStr = res.data.data.nonceStr;
                    app.globalData.prepayId = res.data.data.prepayId;
                    app.globalData.paySign = res.data.data.sign;
                    const order = {
                      orderId: that.data.orderId,
                      timeStamp: res.data.data.timeStamp,
                      nonceStr: res.data.data.nonceStr,
                      prepayId: res.data.data.prepayId,
                      sign: res.data.data.sign
                    }
                    app.globalData.order.push(order);
                    console.log(">>>>" + app.globalData.order)
                    //console.log(">>>>" + app.globalData.paySign)
                    wx.requestPayment({
                      'timeStamp': res.data.data.timeStamp,
                      'nonceStr': res.data.data.nonceStr,
                      'package': res.data.data.prepayId,
                      'signType': 'MD5',
                      'paySign': res.data.data.sign,
                      'success': function(res) {
                        console.log("支付成功");
                        console.log(that.data.orderId);
                        wx.navigateTo({
                          url: '/pages/order/order',
                        })
                      },
                      'fail': function(res) {
                        console.log(res);
                        //console.log(that.data.orderId);
                        if (res.errMsg == "requestPayment:fail cancel") {
                          wx.navigateTo({
                            url: '/pages/obligation/obligation?orderId=' + that.data.orderId ,
                          })
                        } else {
                          wx.request({
                            url: url+'pay/closeOrder/' + that.data.orderId,
                          })
                        }
                      },
                      'complete': function(res) {
                        that.setData({
                          disabled: false
                        })
                      }
                    })
                  }
                })

              }
            })
          }
        });
      }
    })
  }

})