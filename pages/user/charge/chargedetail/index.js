// pages/charge/index/index.js
import { timestampToString, moment } from '../../../../utils/cndealtime'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select : false,
    date: '',
    maxDate: new Date().getTime(),
    minDate : new Date(),
    valuecurrent : '',
    minusTotal : '',
    plusTotal : '',
    balance : 0,
    datalist : [],
    valuecurrent : ''

  },
  getData(ParamsDate){
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this;
    wx.request({
      url: `${app.globalData.custom.url}/api/member/balanceMx`, //仅为示例，并非真实的接口地址
      data: {
        userId,
        loginUid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          minusTotal: res.data.data.minusTotal,
          plusTotal: res.data.data.plusTotal,
          balance: res.data.data.balance,
          datalist: res.data.data.streamList,
          maxDate: new Date(res.data.data.maxTime).getTime() ? new Date(res.data.data.maxTime).getTime() : new Date().getTime(),
          minDate: new Date(res.data.data.minTime).getTime() ? new Date(res.data.data.minTime).getTime() : new Date().getTime(),
          valuecurrent: ParamsDate ? new Date(ParamsDate).getTime() : new Date(res.data.data.maxTime).getTime(),
          date: ParamsDate ? ParamsDate : '全部日期'
        })
      }
    })
  },
  showSelect(){
    if (this.data.select){
      this.setData({
        select: false
      })
    }else{
      this.setData({
        select: true
      })
    }
  },
  close(){
    this.setData({
      select: false
    })
  },
  confirm(e) {
    this.setData({
      select: false,
      date: timestampToString(e.detail, 'l'),
      valuecurrent: e.detail
    });
    this.getData(this.data.date)
  },
  chooseDate(e){
    this.setData({
      select: false,
      date: e.currentTarget.dataset.date
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