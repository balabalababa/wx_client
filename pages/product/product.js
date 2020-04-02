const fetch = require('../../utils/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subItems:[],
    price:[],
    information:[],
    imgAndTxt:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const itemid=options.itemid

    const price = options.price
    const comprice = options.sumprice
    const deposit = options.deposit
    const title = options.title
    const subtitle = options.subtitle
    const brandid = options.brandid
    const stopdate = options.stopdate
    const startdate = options.startdate
    const stock = options.stock

    this.setData({ 
      price: [price, comprice, deposit, title, subtitle, brandid, startdate, stopdate],
      stock: stock
       })
    //console.log(this.data.price)
    fetch('itempage/' + itemid).then(res => {
      this.setData({ subItems: res.data.data[1].subItems })
      this.setData({ information: res.data.data[0].buyNeedKnows })
      //console.log(this.data.information)
      //console.log(this.data.subItems)
    })

    fetch('itempage/imgAndTxt/' + itemid).then(res => {
      this.setData({ imgAndTxt: res.data.data })
      //console.log(this.data.imgAndTxt)
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