const fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    informations: [],
    productTitleImgList: '',
    list: '',
    imgUrl: '',
    endTime:'',
    phone:'400-091-0090'
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId
    // 获取二维码
    let _this = this;
    wx.request({
      url: getApp().globalData.apiUrl + 'user/getWriteOff',
      method: "POST",
      responseType: 'arraybuffer',
      data: {
        scene: options.orderId,
        page: 'pages/control/control'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res.data)
        var base64 = wx.arrayBufferToBase64(res.data);
        _this.setData({
          imgUrl: "data:image/PNG;base64," + base64
        })
      }
    })
    this.setData({
      orderId: orderId
    })
    fetch('user/checkOrderDesc/' + orderId).then(res => {
      console.log(res.data)
      this.setData({
        createtime: res.data.data.orderCreateTime
      })
      if (res.data.data.orderStatus == 6) {
        fetch('pay/qsWXRefund/' + orderId).then(res => {
          this.setData({
            reason: res.data
          })
        })
      }
      console.log("创建时间" + this.data.orderCreateTime)
      //距离待成交时间
      let endTime = (res.data.data.orderStopDate - new Date())/1000;
      if(endTime>0){
        let endD=parseInt(endTime/24/3600);
        let endH=parseInt((endTime%(24*3600))/3600);
        _this.setData({
          endTime:endD+'天'+endH+'时'
        })
      }
      //开始日期转换
      res.data.data.orderStartDate = this.changeTime(res.data.data.orderStartDate)
      //结束日期转换
      res.data.data.orderStopDate = this.changeTime(res.data.data.orderStopDate)

      //下单时间转换
      var startdate = res.data.data.orderCreateTime
      var date = new Date(startdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var H = date.getHours();
      var F = date.getMinutes();
      var S = date.getSeconds();
      var time = Y + "-" + M + "-" + D + " " + H + ":" + F + ":" + S

      res.data.data.orderCreateTime = time
      let informations = res.data.data
      fetch('itempage/store/' + res.data.data.brandID).then(respon => {
        console.log(respon.data)
        informations.brandStoreName = respon.data;
        this.setData({
          informations: informations,
          list: informations.orderRemarks == "undefined" ? [] : JSON.parse(informations.orderRemarks)
        })
        if(respon.data.length>0){
          _this.setData({
            phone:respon.data[0].storePhone
          })
        }
      })
      fetch('itempage/' + informations.productID).then(res => {
        this.setData({
          productFlag: res.data.productFlag,
          productTitleImgList: res.data.productTitleImgList[0],
          brandId: res.data.brandId
        })

      })
    })
  },
  endGood:function(){
    let _this=this;
    wx.showModal({
      title: '已签合同或已与商家联系过确认成交',
      confirmText:"是",
      cancelText:"否",
      success (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.apiUrl+'user/meWrite',
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data:{orderId:_this.data.informations.orderID},
            success:(res)=>{
              if(res.data.status==200){
                wx.navigateTo({
                  url: "/pages/finish/finish?orderId="+_this.data.orderId,
                })
              }
              else{
                wx.showToast({
                  title: '成交失败',
                  icon:'loading'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //拨打电话
  handleCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone||this.data.phone
    })
  },
  handleAddress: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.address,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //转换时间
  changeTime: function (time) {
    var date = new Date(time)
    // console.log(date)
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var H = date.getHours();
    var F = date.getMinutes();
    var S = date.getSeconds();
    var time = Y + "-" + M + "-" + D;
    return time;
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