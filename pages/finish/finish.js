const fetch = require('../../utils/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informations:[],
    orderId:"",
    productTitleImgList: '',
    list: '',
    phone:'400-091-0090',
    contaractFlag:''
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
      let  informations=res.data.data
    
      let that=this
      fetch('itempage/' + informations.productID).then(res => {
        this.setData({
          productTitleImgList: res.data.productTitleImgList[0]
        })
        fetch('itempage/store/' + res.data.brandId).then(respon => {
          informations.brandStoreName=respon.data;
          that.setData({
            informations: informations,
            list: informations.orderRemarks == "undefined"?[]:JSON.parse(informations.orderRemarks)
          })
          if(respon.data.length>0){
            that.setData({
              phone:respon.data[0].storePhone
            })
          } 
        })
        
      })
    })
    fetch('backstage/wxjf/getContract?orderNo='+orderId).then(res=>{
      this.setData({
        contaractFlag:res.data.msg=="true"?true:false
      })
    })
  },

  goto:function(){
    wx.navigateTo({
      url:'/pages/comments/comments?orderId='+this.data.orderId,
    })
  },
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