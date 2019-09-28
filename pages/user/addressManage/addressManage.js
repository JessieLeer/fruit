// page/user/addressManage/addressManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      
      ]
  },

  iconSign:function(){//判断地址类型
  
  },

  toEdit:function(e){
    wx.navigateTo({
      url: `editAddress/editAddress?id=${e.currentTarget.dataset.id}`,
    })
  },

  newAddress:function(){//新增地址
    if (this.data.content.length <10){
      wx.navigateTo({
        url: 'newAddress/newAddress',
      })
    }
    else if (this.data.content.length >= 10){
      wx.showToast({
        title: "您的地址已超上限，请删除后再添加",
        icon: 'none',
      })
    }
  },
  getData(){
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/getUserAddress`, //仅为示例，并非真实的接口地址
      data: {
        loginUid: loginUid,
        userId: userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          content : res.data.data
        })
      }
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
    this.getData()
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