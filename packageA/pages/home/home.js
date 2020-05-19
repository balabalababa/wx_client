const changtime = require('./../../../utils/time.js')
const global = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomInfo: {
      before: {
        list: []
      },
      now: {
        list: []
      },
      after: {
        list: []
      }
    },
    showrooms: [],
    nav: ["未开始", "正在直播", "已结束"],
    curnavIndex: 0,
    page: 0,
    token: ''
  },
  getAccessToken: function () {
    let that = this;
    wx.request({
      url: global.apiUrl+'backstage/live/getToken',
      method: 'POST',
      success: function (res) {
        console.log(res)
        //  获取access_token
        that.setData({
          token: res.data.msg
        })

      },
      fail(res) {
        console.log(res)
      }
    })
  },
  getLives: function () {
    let that = this;
    wx.request({
      url: global.apiUrl+ 'backstage/live/getLive',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "start": 0, // 起始拉取房间，start=0表示从第1个房间开始拉取
        "limit": 10 * that.data.page + 10
      },
      success: (v) => {
        console.log(v)
        // "errcode": 0, // errcode=0代表成功；errcode=1代表未创建直播房间
        let arr = JSON.parse(v.data.msg).room_info ;
        console.log(arr)
        let lives = [
          [],
          [],
          []
        ]
        arr.map(item => {
          item.start_time = changtime.tsFormatTime(item.start_time * 1000, 'Y/M/D-h:m:s');
          if (item.live_status == 102) {
            lives[0].push(item)
          }
          if (item.live_status == 101) {
            lives[1].push(item)
          }
          if (item.live_status == 103) {
            lives[2].push(item)
          }
        })
        wx.setStorageSync('liveList', lives)
        wx.setStorageSync('page', that.data.page)
        that.setData({
          ['roomInfo.before.list']: lives[0],
          ['roomInfo.now.list']: lives[1],
          ['roomInfo.after.list']: lives[2],
          showrooms: lives[0],
          curnavIndex:0
        })
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      curnavIndex: e.target.dataset.index
    })
    switch (e.target.dataset.index) {
      case 0:
        this.setData({
          showrooms: this.data.roomInfo.before.list
        })
        break;
      case 1:
        this.setData({
          showrooms: this.data.roomInfo.now.list
        })
        break;
      case 2:
        this.setData({
          showrooms: this.data.roomInfo.after.list
        })
        break;
    }
  },
  dingyue: function () {
    this.setData({
      page: 0
    })
    this.getLives()
  },
  // 获取回放
  getLiveVideo(e) {

    let room = e.currentTarget.dataset.room;
    if (room.live_status == 103) {
      let that = this;
      wx.request({
        url:global.apiUrl+'backstage/live/getHuiFang',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          "roomId": room.roomid, // 直播间id
        },
        success: (v) => {
          let huifang=JSON.parse(v.data.msg).live_replay
          room.video =huifang.splice(1);
          wx.request({
            url: global.apiUrl + 'user/updetLive',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              roomid: room.roomid,
              data: JSON.stringify(room)
            },
            success: res => {
              if (res.data.data == 1) {
                wx.navigateTo({
                  url: '/packageA/pages/video/video?roomid=' + room.roomid
                })
              }

            }
          })

        }
      })
    } else {
      wx.showToast({
        title: '目前没有回放',
        duration: 1000,
        mask: true
      })
    }


  },
  onLoad: function (options) {
    this.setData({
      page: wx.getStorageSync('page') || 0
    })
    let lives = wx.getStorageSync('liveList')||[]
    if(lives.length==0){
      this.getLives()
    }else{
      this.setData({
        ['roomInfo.before.list']: lives[0],
        ['roomInfo.now.list']: lives[1],
        ['roomInfo.after.list']: lives[2],
        showrooms: lives[0]
      })
    }
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
    let page = this.data.page;
    this.setData({
      page: ++page
    })
    if (page > wx.getStorageSync('page')) {
      wx.showLoading({
        title: '正在加载'
      })
      this.getLives()
      wx.hideLoading()
    }



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})