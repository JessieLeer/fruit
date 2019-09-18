// page/user/setting/reset-password/reset-password.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Length: 6,        //输入框个数
    isFocus: true, 
    foc:false,   //聚焦
    Value: "",        //新密码
    nextValue:"",     //确认输入
    ispassword: true, //是否密文显示 true为密文， false为明文。
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    });
  },

  nextFocus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      nextValue: inputValue,
    });
    
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  nextTap() {
    var that = this;
    that.setData({
      foc: true,
    })
  },
  formSubmit(e) {
    if (this.data.nextValue != this.data.Value){
      wx.showToast({
        title : '两次密码不一致',
        icon : 'none'
      })
      return
    }
    var that = this;
    wx.request({
      url: `${app.globalData.url}/api/member/resetPayPassword`, //仅为示例，并非真实的接口地址
      data: {
        loginUid: app.globalData.loginUid,
        userId: app.globalData.userId,
        newPassword: that.data.nextValue
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
      }
    })
    console.log(this.data.Value,this.data.nextValue);
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