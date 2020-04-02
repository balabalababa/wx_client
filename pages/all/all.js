const fetch = require('../../utils/fetch.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: '',
    hasMore: true,
    inputText:"",
    cityId:""
  },

  loadMore() {
    var that = this
    if (!this.data.hasMore) return

    let { pageIndex, pageSize, inputText} = this.data
    const params = { input: this.data.inputText, page: ++pageIndex, pageSize: pageSize }
    // if (inputText) params.input = inputText
    return fetch('home/search?cityId='+that.data.cityId, params).then(res => {
      const totalCount = parseInt(res.data.msg)
      that.setData({
        totalCount: totalCount
      })
      console.log(totalCount)
      const hasMore = pageIndex * pageSize < totalCount
      const shops = this.data.shops.concat(res.data.data)
      this.setData({ shops, pageIndex, totalCount, hasMore })
      //console.log(this.data.shops)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cityId = options.cityId
    var inputText = options.inputText
    this.setData({ inputText: inputText,
    cityId : cityId
    })
    //console.log(this.data.inputText)
    this.loadMore();
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
  onReachBottom: function () {
    //在这里加载下一页的数据
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  searchHandle() {
    // console.log(this.data.searchText)
    this.setData({ shops: [], pageIndex: 0, hasMore: true })
    this.loadMore()
  },

  showSearchHandle() {
    this.setData({ searchShowed: true })
  },
  hideSearchHandle() {
    this.setData({ searchText: '', searchShowed: false })
  },
  clearSearchHandle() {
    this.setData({ searchText: '' })
  },
  searchChangeHandle(e) {
    this.setData({ searchText: e.detail.value })
  }
})