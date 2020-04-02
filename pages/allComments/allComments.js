const fetch = require('../../utils/fetch.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand_comments:[],
    ellipsis: true, // 文字是否收起，默认收起
    hasMore: true,
    pageIndex: 0,
    pageSize: 10,
    brandid:"",
    numbers:"",
    id:-1,
    num:"",
    imgsarr:""
  },


  loadMore(){
    if (!this.data.hasMore) return

    let { pageIndex, pageSize } = this.data
    const params = { page: ++pageIndex, limit: pageSize }
    console.log("页码：" + pageIndex + "-数量" + pageSize)
    return fetch('brpage/appraisal/' + this.data.brandid, params).then(res => {
      this.setData({
        num: res.data.msg
      })
      const totalCount = parseInt(res.data.msg)
      const hasMore = pageIndex * pageSize < totalCount

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
      const brand_comments = this.data.brand_comments.concat(res.data.data)
      this.setData({ brand_comments, pageIndex, hasMore })

      console.log(this.data.brand_comments)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var brandid = options.brandid
    console.log(brandid)
    this.setData({
      brandid: brandid
    })
    //获取该品牌评论信息
    this.loadMore();
  },

  /**   
     * 预览图片  
     */
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    // var imgsarr=new Array()
    var imgList = event.currentTarget.dataset.list;//获取data-list
    for (var i=0; i < imgList.length; i++){
      imgList[i] = "http://mall.qszhuang.com" + imgList[i]
    }
    console.log(imgList)
    // imgsarr.push(imgList)
    console.log(src)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList// 需要预览的图片http链接列表
    })
  },  
  /**
    * 收起/展开按钮点击事件
    */
  ellipsis: function (e) {
    // var value = !this.data.ellipsis;
    console.log(e.currentTarget.dataset.id)
        this.setData({
          id: e.currentTarget.dataset.id
        })
  },
  unellipsis: function (e) {
    // var value = !this.data.ellipsis;
    //console.log(e.currentTarget.dataset.id)
    this.setData({
      id: -1
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
    //获取该品牌评论信息
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    this.loadMore();
    console.log("下拉执行")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})