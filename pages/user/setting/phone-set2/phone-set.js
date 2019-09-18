// page/user/setting/phone-set/phone-set.js
var app = getApp()
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel : '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
    code : '',
    smsId : '',
    disabled : false
  },

  bindKeyInput: function (e) {
    this.setData({
      tel : e.detail.value
    })
  },
  codeKey:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function (options) {
    var that = this;
    var phone = this.data.tel;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
      wx.showToast({
        title: "手机号码错误",
        icon: 'none',
      })
    }
    else{
      this.setData({
        disabled: true
      })
      var that = this;
      wx.request({
        url: `${app.globalData.url}/api/mini/sendSms`,
        data: {
          mobile: this.data.tel
        },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          that.setData({
            smsId : res.data.data
          })
        }
      })
      var currentTime = that.data.currentTime
        console.log(0);
      interval = setInterval(function () {
        console.log(1);
        currentTime--;
        that.setData({
          time: currentTime + '秒重新获取'
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新发送',
            currentTime: 61,
            disabled: false
          })
        }
      }, 1000)
    }
  },
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
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
    var that = this;
    wx.request({
      url: `${app.globalData.url}/api/member/getUserInfo`, //仅为示例，并非真实的接口地址
      data: {
        loginUid: app.globalData.loginUid,
        userId: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          tel: res.data.data.mobile
        })
      }
    })
  },
  confirm(){
    wx.request({
      url: `${app.globalData.url}/api/member/updateMobile`,
      data: {
        newMobile: this.data.tel,
        loginUid: app.globalData.loginUid,
        smsCodeId: this.data.smsId,
        smsCode: this.data.code,
        userId: app.globalData.userId,
      },
      success(res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../../index/index'
            })
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
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

  }
})