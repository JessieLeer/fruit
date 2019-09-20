const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  loginOut : function () {
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/logout`, //仅为示例，并非真实的接口地址
      data: {
        loginUid: app.globalData.loginUid,
        userId: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.clearStorageSync()
        // app.globalData.loginUid = '';
        // app.globalData.userId = '';
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000);
      }
    })
  },
  goPhone:function(){
    wx.navigateTo({
      url: 'phone-set/phone-set',
    })
  },
  resetPassword:function(){
    wx.navigateTo({
      url: 'paysetting/phone-set?idx=setting',
    })
  },
  go:function(){
    wx.navigateTo({
      url: '../documents/Doc/index?id=aboutus',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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