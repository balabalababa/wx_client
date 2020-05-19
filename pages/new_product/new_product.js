// pages/tuangou/tuangou.js
const fetch = require('../../utils/fetch.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
var app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    showModalStatus_pra:false,
    showModalStatus_type:false,
    indicatorDots: true,
    aotoplay: true,
    interval: 1000,
    duration: 1000,

    // tab切换  
    currentTabsIndex: 0,

    brand: [],
    information: [],
    price: [],
    startdate: [],
    stopdate: [],
    pro_comments: [],
    ellipsis: true, // 文字是否收起，默认收起
    id: -1,
    num: "",
    stock: "",
    imgAndTxt: [],
    messages:'',
    imgUrls:[],
    productParame:[],
    productTag:[],
    tagArray:[],
    tagString:'',
    options:'',

    // 展示选择信息
    productSpecification:'',
    list:"",
    chooseFlag:false,
    imgUrl:'',
    first:false,
  },

  //显示对话框
  showModal: function (event) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    if (event.currentTarget.dataset.value == 'service'){
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
    }
    if (event.currentTarget.dataset.value == 'parameter'){
      this.setData({
        animationData: animation.export(),
        showModalStatus_pra: true
      })
    }
    if (event.currentTarget.dataset.value == 'type') {
      this.setData({
        animationData: animation.export(),
        showModalStatus_type: true
      })
    }
   
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function (event) {
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
      if (event.currentTarget.dataset.value === 'service') {
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }
      if (event.currentTarget.dataset.value === 'parameter') {
        this.setData({
          animationData: animation.export(),
          showModalStatus_pra: false
        })
      }
      if (event.currentTarget.dataset.value === 'type') {
        this.setData({
          animationData: animation.export(),
          showModalStatus_type: false
        })
      }
    }.bind(this), 200)
  },
  radioButtonTap(e) {
    console.log(e);
    var that=this
    var title = e.currentTarget.dataset.title || e.target.dataset.title
    var bindex = e.currentTarget.dataset.bindex || e.target.dataset.bindex
    var value = e.currentTarget.dataset.value || e.target.dataset.value
    var list = that.data.list
    var productSpecification = that.data.productSpecification
    for(var key in list){
      if(list[key].title==title){
        list[key].content=value
      }
    }
    for (var i=0;i<productSpecification.length;i++) {
      if (i== bindex){
        for (var index in productSpecification[bindex].content) {
          productSpecification[i].content[index].checked = false
          if (productSpecification[i].content[index].name == value) {      
            productSpecification[i].content[index].checked = true
            if (productSpecification[i].content[index].image){
              that.setData({
                imgUrl: productSpecification[i].content[index].image
              })
            }
          }
        }
      }
     
    }
    that.setData({
      list:list,
      chooseFlag:true,
      productSpecification: productSpecification
    })
    console.log(productSpecification)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    var that = this;
    const id = options.id
    console.log(id)
    const brandid = options.brandid
    console.log(brandid)
    const productFlag = options.productFlag
    console.log(productFlag)


    this.setData({
      price: [brandid, id, productFlag],
      options:JSON.stringify(options)
    })
    console.log('2'+this.data.price[2])

    //获取产品评论信息
    let { pageIndex, pageSize } = this.data
    const params = { page: 1, limit: 1 }
    fetch('itempage/appraisal/' + id, params).then(res => {
      this.setData({
        num: res.data.msg
      })
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
      this.setData({ pro_comments: res.data.data })
      console.log(this.data.pro_comments)
    })
    //获取这个页面所有信息
    fetch('itempage/' + id).then(res => {
      //console.log(res)
      res.data.productSale = res.data.productSale!="null" ? res.data.productSale : 0;
      //console.log(res)
      this.setData({
        messages:res.data
      })
      var productSpecification = JSON.parse(res.data.productSpecification)
      for (var key in productSpecification) {
        for (var index in productSpecification[key].content){
          productSpecification[key].content[index].checked=false
        }
      }
      var list= JSON.parse(res.data.productSpecification)
      for(var key in list){
        list[key].content=""
      }
       this.setData({
         list:list,
         productSpecification: productSpecification
       })
      console.log(productSpecification)
      //存储购买须知内容
      this.setData({ information: res.data.productNeedKnow})
      console.log(this.data.information)
      var date = new Date(this.data.information.startdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var starttime = Y + "-" + M + "-" + D
      this.setData({ startdate: starttime })
      // console.log(this.data.startdate)
      var date = new Date(this.data.information.stopdate)
      // console.log(date)
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

      var stopdate = Y + "-" + M + "-" + D
      this.setData({ stopdate: stopdate })

      let a = JSON.parse(res.data.productTag);
      let tagString='';
      let tagArray = []
      for(let index in a){
        const tag = [
          index,
          a[index],
          index.substring(0,1)
        ]
        tagString += index +" · ";
        tagArray.push(tag)
      }
      console.log(tagArray)
      
      this.setData({
        tagString: tagString,
        tagArray: tagArray,
        imgAndTxt: res.data.productImgTxtList,
        imgUrls: res.data.productTitleImgList,
        imgUrl: res.data.productTitleImgList[0],
        productParame: JSON.parse(res.data.productParame),
        productTag: JSON.parse(res.data.productTag)
       })
    })
    // console.log('这是productParame' + that.data.productParame)
    // fetch('itempage/imgAndTxt/' + id).then(res => {
    //   this.setData({ imgAndTxt: res.data.data })
    //   console.log('这是图片' + this.data.imgAndTxt)
    // })

    qqmapsdk = new QQMapWX({
      key: '7XWBZ-FWEK3-L7L34-YWV5P-HPMYF-SABDD'
    });
  
  },


  /** 
    * 点击tab切换 
    */
  onTabsItemTap: function (e) {
    var that = this;
    //console.log(e.target.dataset.current);
    if (this.data.currentTabsIndex === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTabsIndex: e.target.dataset.current
      })
    }
  },

  //打电话
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.brand.brandTelephone,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // /** 
  //    * 滑动切换tab 
  //    */
  // bindChange: function (e) {
  //   var that = this;
  //   that.setData({ currentTabsIndex: e.detail.current });
  // },  
  getCode: function (e) {
    var that = this;
    that.setData({
      first:true
    })
    var list = that.data.list;
    var productSpecification = that.data.productSpecification
    if (productSpecification.length>0){
      for (var key in list) {
        if (!list[key].content) {
          that.setData({
            showModalStatus_type:true
          })
          return false;
        }
      }
    }
    list=JSON.stringify(list)
    let url = '/pages/submit/submit?title=' + that.data.messages.productTitle + '&deposit=' + that.data.messages.productDeposite + '&id=' + that.data.messages.productID + '&stock=' + that.data.messages.productStock + '&productFlag=' + that.data.price[2]+'&list='+list
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authorize/authorize?urlIndex=1' + '&title=' + that.data.messages.productTitle + '&deposit=' + that.data.messages.productDeposite + '&id=' + that.data.messages.productID + '&stock=' + that.data.messages.productStock + '&productFlag=' + that.data.price[2]
          })
        }else{
          wx.navigateTo({
            url: url
          });
        }
      }
    });
  },
  getCode_1: function (e) {
    var that = this;
    var list = that.data.list;
    var productSpecification = that.data.productSpecification
    if (productSpecification.length > 0) {
      for (var key in list) {
        if (!list[key].content) {
          wx.showToast({
            title: '请选择属性',
          })
          return false;
        }
      }
    }
    list = JSON.stringify(list)
    let url = '/pages/submit/submit?title=' + that.data.messages.productTitle + '&deposit=' + that.data.messages.productDeposite + '&id=' + that.data.messages.productID + '&stock=' + that.data.messages.productStock + '&productFlag=' + that.data.price[2] + '&list=' + list
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authorize/authorize?urlIndex=1' + '&title=' + that.data.messages.productTitle + '&deposit=' + that.data.messages.productDeposite + '&id=' + that.data.messages.productID + '&stock=' + that.data.messages.productStock + '&productFlag=' + that.data.price[2]
          })
        } else {
          wx.navigateTo({
            url: url
          });
        }
      }
    });
    that.setData({
      showModalStatus_type: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   this.setData({
     first:false
   })
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

  },

})