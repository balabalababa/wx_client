const fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false,

    items: [
      { name: '1', value: '1、买错了/买多了' },
      { name: '2', value: '2、商家停业/装修/转让'},
      { name: '3', value: '3、商家营业但不接待' },
      { name: '4', value: '4、时间有变、没时间消费' },
      { name: '5', value: '5、去过了不太满意' },
      { name: '6', value: '6、商家说可以直接以团购价到店消费' },
      { name: '7', value: '7、其他' },
    ],
    orderId:"",
    informations:[],
    reason:"",
    productTitleImgList: '',
    list: ''

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
      //开始日期转换
      var startdate = res.data.data.orderStartDate
      var date = new Date(startdate)

      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日"
      //console.log(starttime)
      res.data.data.orderStartDate = time

      //结束日期转换
      var startdate = res.data.data.orderStopDate
      var date = new Date(startdate)

      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var time = Y + "年" + M + "月" + D + "日"
      //console.log(starttime)
      res.data.data.orderStopDate = time

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
      //console.log(starttime)
      res.data.data.orderCreateTime = time
   
      this.setData({
        informations: res.data.data,
        list: res.data.data.orderRemarks == "undefined" ? [] : JSON.parse(res.data.data.orderRemarks)
      })
      fetch('itempage/' + this.data.informations.productID).then(res => {
        this.setData({
          productFlag: res.data.productFlag,
          productTitleImgList: res.data.productTitleImgList[0]
        })
      })
    })
  },
  radioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      reason: e.detail.value
    })
    
  },
  formSubmit:function(e){
    var that = this
    if(!that.data.reason)
    {
      wx.showToast({
        title: '退款理由必选',
      })
      return false;
    }
       
    wx.request({
      url: 'https://mall.qszhuang.com/pay/wxRefund',
      data:{
        orderNo: e.detail.value.orderNo,
        refund_desc: that.data.reason
      },
      success:function(e){
        console.log(e)
        if (e.data.status == 500){
          wx.showToast({
            title: '退款申请失败',
          })
        } else if (e.data.status == 200){
          wx.redirectTo({
            url: '/pages/refund/refund?orderId=' + that.data.orderId,
          })
        }
      }
    })
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