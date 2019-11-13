// pages/charge/index/index.js
var app = getApp();
import { timestampToString,moment } from '../../../../utils/cndealtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select : false,
    income : 0,
    expenditure : 0,
    number : 0,
    date : '',
    minDate : '',
    maxDate: new Date().getTime(),
    valuecurrent : ''
  },
  showSelect(){
    this.setData({
      select: true
    })
  },
  close(){
    this.setData({
      select: false
    })
  },
  cancel(){
    this.setData({
      select: false
    })
  },
  gotoDoc(){
    wx.navigateTo({
      url: "../../documents/Doc/index?id=integral"
    })
  },
  confirm(e){
    this.setData({
      select: false,
      date: timestampToString(e.detail, 'l'),
      valuecurrent: e.detail
    })
    this.getData(this.data.date)
  },
  onShow(){
    this.getData()
  },
  getData(ParamsDate) {
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.custom.url}/api/integral`,
      data: {
        uid: userId,
        itime: ParamsDate ? ParamsDate : ''
      },
      success(res) {
        that.setData({
          income: res.data.income,
          expenditure: res.data.expenditure,
          number: res.data.number,
          datalist : res.data.data,
          maxDate: new Date(res.data.maxTime).getTime() ? new Date(res.data.maxTime).getTime() : new Date().getTime(),
          minDate: new Date(res.data.minTime).getTime() ? new Date(res.data.minTime).getTime() : new Date().getTime(),
          valuecurrent: ParamsDate ? new Date(ParamsDate).getTime() : new Date(res.data.maxTime).getTime(),
          date: ParamsDate ? ParamsDate : '全部日期'
        })
      }
    })
  }
})