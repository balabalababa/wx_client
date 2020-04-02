const fetch = require('../../utils/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actContent: {
      "userName": "",
      "userPhone": ""
    },
    modalFlag:0,
    images:[]
  },
  Height:[],
  onLoad: function(options) {
    console.log(options)
    let params = {
      activityId: options.activityId,
      activityCity: options.activityCity
      // activityId: 'N01',
      // activityCity: 2
    }
    fetch('activity/selectByActivity',
      params).then(res => {
      let actContent = res.data.data;
      actContent.followImgUrl.split(',').forEach(item=>{
        this.Height.push({url:item,height:''})
      })
      // actContent.followImgUrl=actContent.followImgUrl.split(',')
      this.setData({
        actContent,
        images:this.Height
      })
    })
  },

  
  onReady: function() {

  },

  
  onShow: function() {

  },

  formSubmit: function(e) {
    let value = e.detail.value;
    for (let i in value) {
      if (!value[i]) {
        wx.showToast({
          title: '请填写完成',
          image: '/assets/err.png',
          duration: 1500
        })
        return false
      }
    }

    var myreg = /^(134|135|136|137|138|139|147|150|151|152|157|158|159|166|182|183|184|187|188|130|131|132|145|155|156|185|186|133|153|180|181|189|170|171|173|174|175|176|177|178|166|199|191|167)\d{8}$/;
    if (!myreg.test(value.userPhone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/assets/err.png',
        duration: 1500
      })
      return false;
    }
    let data = this.data.actContent;
    data.userCity = data.activityCity;
    data.userName = value.userName;
    data.userPhone = value.userPhone;
    data.openId = getApp().globalData.openid
    let that=this
    wx.request({
      url: getApp().globalData.apiUrl + 'activity/insertForm',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if (res.data.data == "已报名") {
          wx.showToast({
            title: '已报名',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '报名成功',
            duration: 1500
          })
        }
        that.formReset()
        that.setData({
          modalFlag:0
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  showModal:function(e){
    if (!e.currentTarget.dataset.falg){
      this.formReset()
    }
    this.setData({
      modalFlag: e.currentTarget.dataset.falg
    })
  },
  resizeview:function(e) {
    var query = wx.createSelectorQuery();
    query.select('.show_image'+e.target.dataset.index).boundingClientRect();
    query.exec((res) => {
      this.Height[e.target.dataset.index].height=parseInt(res[0].height)
      this.setData({
        images:this.Height
      })
      
    })
  },
  onShareAppMessage: function() {

  }
})