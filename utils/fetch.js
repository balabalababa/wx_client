module.exports = (url,data) => {
  return new Promise((resolve,reject) => {
    wx.request({
      url: 'https://mall.qszhuang.com/' + url,
      // url: 'http://192.168.0.173:8080/'+url,
      data:data,
      success:resolve,
      fail:reject
    })
  })
}
