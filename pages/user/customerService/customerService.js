// page/user/cus/cus.js
var WxParse = require('../../../wxParse/wxParse');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        id: "01",
        title: "1、小程序订单如何付款？",
        contents: "目前付款方式有两种：微信支付、卡内余额支付",
        shows: false
      },
      {
        id: "02",
        title: "2、小程序是否能同时采用两种支付方式下单？",
        contents: "目前小程序只支持一种方式下单，如钱包余额不足，请先充值钱包余额。",
        shows: false
      },
      {
        id: "03",
        title: "3、订单取消/申请退款后，多久可以收到退款？",
        contents: "订单取消/申请退款后，退款将在1-3个工作日内原路返回到支付账户。如退款一直未到账，请联系电话客服为您处理。",
        shows: false
      },
      {
        id: "04",
        title: "4、收到货后，发现商品有问题如何处理？",
        contents: "申请售后，联系客服进行退货退款处理。",
        shows: false
      },
      {
        id: "05",
        title: "5、在小程序充值可以开发票吗？",
        contents: "目前付款方式有两种：微信支付、会员卡余额支付。目前付款方式有两种：微信支付、会员卡余额支付。",
        shows: false
      },
    ]
  },

  showHide(e) {

    var contentFor = this.data.content;

    for (var i = 0; i < contentFor.length; i++) {
      if (e.currentTarget.dataset.changeid == contentFor[i].id) {
        var printPrice = "content[" + i + "].shows";
        if (this.data.content[i].shows) {
          this.setData({
            [printPrice]: false
          });
        } else {
          this.setData({
            [printPrice]: true
          });
        }
      } else {
        var printPrice1 = "content[" + i + "].shows";
        this.setData({
          [printPrice1]: false
        });
      }
    }
  },

 
  tel: function () {
    wx.showActionSheet({
      itemList: ['13387085587', '呼叫'],
      success: function (res) {
        if (res.tapIndex == 1 || res.tapIndex == 0){
            wx.makePhoneCall({
              phoneNumber: '13387085587',
            })
        }
      },
      fail: function (res) {
        
      }
    })
    
  },
  getHtml(id){
    var that = this;
    //3. 解密
    wx.request({

      url: `${app.globalData.url}/api/mini/getContentById`,
      data: {
        contentId: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        WxParse.wxParse('article', 'html', res.data.data.contentText, that, 5);
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHtml(options.id)
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