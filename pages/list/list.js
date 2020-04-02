const fetch = require('../../utils/fetch.js')

// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops:[],
    pageIndex: 0,
    pageSize: 10,
    hasMore: true,
    category: [],
    cityId:"",
    fenlei: {
      kaiguancz:"开关插座",
      cizhuandb:"瓷砖地板",
      weiyudd:"卫浴吊顶"
    },
    totalCount:""
  },
  

  loadMore(){
    var that=this;
    if (!this.data.hasMore) return
    let { pageIndex, pageSize } = this.data
    const params = { page: ++pageIndex, limit: pageSize }
    fetch('home/brcat/'+that.data.category+'?cityId='+that.data.cityId,params).then(res => {
      console.log('test')
      console.log(res)
      const totalCount = parseInt(res.data.msg)
      const totalBrand = res.data.data
      this.setData({
        totalCount: totalCount
      })  
      const hasMore = pageIndex * pageSize < totalCount
      const shops = that.data.shops.concat(res.data.data)
      this.setData({ shops, pageIndex, hasMore })
    })
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(getApp().globalData.openid)
    const id = options.classifyId
    const cityId = options.cityId
    this.setData({ category: id ,
    cityId: cityId
    })
    // wx.setNavigationBarTitle({
    //   title: this.data.fenlei.kaiguancz
    // })
    this.loadMore()
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
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})