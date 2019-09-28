// page/user/addressManage/editAddress/editAddress.js
// page/user/addressManage/newAddress/newAddress.js
import arealist from '../area'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSel: true,
    icon: 1,
    dataSet: {
      mobile: "",
      name: "",
      addr: "",
      detailAddr: "",
      tag: "家",
    },
    arealist: [],
    areakey: false,
    currentadress: "",
    defaultFlag: 0,
    id: ''
  },
  inputTel(e) {
    this.data.dataSet.mobile = e.detail.value
  },
  inputName(e) {
    this.data.dataSet.name = e.detail.value
  },
  inputAdd(e) {
    this.data.dataSet.addr = e.detail.value
  },
  inputBlo(e) {
    this.data.dataSet.detailAddr = e.detail.value
  },
  confirm_select(e) {
    var str = '';
    e.detail.values.map((item, index) => {
      str += ` ${item.name}`
    })
    this.setData({
      areakey: false,
      'dataSet.addr': str
    })
  },
  cancel_selcect() {
    this.setData({
      areakey: false
    })
  },
  chooseAdd() {
    this.setData({
      areakey: true
    })
  },
  selSex: function () {
    if (this.data.isSel) {
      this.setData({
        isSel: false
      })
    } else {
      this.setData({
        isSel: true
      })
    }
  },
  sel: function (e) {
    var viewDataSet = e.target.dataset;
    var viewText = viewDataSet.text;
    this.setData({
      'dataSet.tag': viewText
    })
  },
  popConfirm: function () {
    wx.showModal({
      title: '',
      content: '确认删除此收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确认回调')
        } else {
          console.log('点击取消回调')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  newAddress() {
    for (var key in this.data.dataSet) {
      console.log(key)
      if (this.data.dataSet[key] == '') {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return;
      }
    }
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/addUserAddress?loginUid=${loginUid}&userId=${userId}`, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        // "loginUid": loginUid,
        // "userId": userId,
        "userAddr": {
          "addr": that.data.dataSet.addr,
          "defaultFlag": that.data.defaultFlag?1:0,
          "delFlag": 0,
          "detailAddr": that.data.dataSet.detailAddr,
          "mobile": that.data.dataSet.mobile,
          "name": that.data.dataSet.name,
          "tag": that.data.dataSet.tag
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面

            })
          },800)
        }
      }
    })
  },
  switch1Change(e) {
    console.log(e)
    this.setData({
      'dataSet.defaultFlag': e.detail.value
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
    console.log(arealist)
    this.setData({
      arealist
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