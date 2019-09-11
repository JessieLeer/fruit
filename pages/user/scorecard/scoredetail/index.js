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
    console.log(new Date(this.data.date))
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/integral`, //仅为示例，并非真实的接口地址
      data: {
        uid: 18679208206,
        itime: ParamsDate ? ParamsDate : ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
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