// page/user/payCode/payCode.js
//const QR = require('../../../utils/wxqrcode.js');
import QR from '../../../utils/qrCode.js';
var barcode = require('../../../utils/index')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  /*data: {
    // qrcode
    text: '',
    qrcode: ''
  },*/
 
  /**
   * 生命周期函数--监听页面加载
   */
  /*onLoad: function (options) {
    this.setData({
      text: options
    });
    var that = this;
    let qrcodeSize = that.getQRCodeSize()
    that.createQRCode(that.data.text, qrcodeSize)
    console.log(that.data.text);
  },
  getQRCodeSize: function () {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = res.windowWidth / 750; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = 300 * scale;
      size = width;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
      size = 150;
    }
    return size;
  },
  createQRCode: function (text, size) {
    //调用插件中的draw方法，绘制二维码图片
    let that = this
    try {
      // console.log('QRcode: ', text, size)
      let _img = QR.createQrCodeImg(text, {
        size: parseInt(size)
      })
      that.setData({
        'qrcode': _img
      })
    } catch (e) {
      console.log(e)
    }
  },
  bind_text(e) {
    let text = e.detail.value;
    this.setData({
      text: text
    });
  },
  bind_sumbit(e) {
    let te = parseInt(Math.random() *100000000); 
    this.onLoad(te);
  },*/


  data: {
    imagePath: '',
    // 存储定时器
    setInter: '',
    tip: 'null',
    st: null,  //记录每次自动刷新的开始时间
    expireTime: 30,  //过期时间，这里设置为20秒,
    url : '',
    isShow : false
  },
  onLoad: function (options) {
    var size = this.setCanvasSize();//动态设置画布大小
    let ct = Date.parse(new Date())
    // let url = 'current_time=' + ct
    this.getQRcode()
  },
  getQRcode(){
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/refreshPayCode`, //仅为示例，并非真实的接口地址
      data: {
        loginUid,
        userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          url : res.data.data.payCode,
          isShow : true
        })
        that.autoRefresh()
      }
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 400/ 750; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth* scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  // 生成二维码
  createQrCode: function (canvasId, cavW, cavH) {
    let that = this
    let ct = Date.parse(new Date())
    if ((ct - that.data.st) > that.data.expireTime * 1000) { //超时，停止刷新
      this.setData({
        tip: that.data.expireTime + '秒超时，停止刷新'
      })
      clearInterval(that.data.setInter)
    } else {
      let url = this.data.url;
      //console.log('当前生成时间是。。。。', ct)
      //调用插件中的draw方法，绘制二维码图片
      QR.api.draw(url, canvasId, cavW, cavH);
      setTimeout(() => { this.canvasToTempImage(); }, 500);
    }

  },

  // 自动刷新二维码，5秒刷新一次，先生成一次，再5秒后执行一次
  autoRefresh: function () {
    console.log(23432342)
    let that = this;
    that.setData({
      st: Date.parse(new Date()),
      tip: '正在刷新'
    })
    let size = that.setCanvasSize();//动态设置画布大小
    barcode.barcode('firstCanvas', that.data.url, 285 * 2, 108 * 2)
    that.createQrCode("mycanvas", size.w, size.h) //先生成一次
    // that.data.setInter = setInterval(function () {
    //  // console.log('定时一次', Date.parse(new Date()))
    //   that.createQrCode("mycanvas", size.w, size.h)
    // }, 10000);
  },
  // 取消自动刷新
  stopRefresh: function () {
    let that = this
    this.setData({
      tip: '已停止自动刷新'
    })
    //console.log('点击取消自动刷新')
    clearInterval(that.data.setInter)
  },
  // 手动刷新一次，先清除定时器，再重新开启一个定时器
  manuRefresh: function () {
    this.setData({
      isShow : false,
    })
    let that = this
    this.getQRcode()
    //console.log('手动刷新')
    clearInterval(that.data.setInter)
  },

  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        //console.log('生成临时图片路径。。。。', tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    //console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
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

  },
  gotopay(){
    wx.openOfflinePayView({})
  }
})