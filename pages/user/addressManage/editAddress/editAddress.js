import arealist from '../area'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSel: true,
    icon: 1,
    dataSet : {
      mobile : "",
      name : "",
      currentadress : "",
      detailAddr : "",
      tag : "家",
			defaultFlag: false
    },
    arealist : [],
    areakey : false,
    currentadress: "",
    defaultFlag: 0,
    id : ''
  },
  inputTel(e){
    this.data.dataSet.mobile = e.detail.value
  },
  inputName(e){
    this.data.dataSet.name = e.detail.value
  },
  inputAdd(e){

  },
  inputBlo(e){
    this.data.dataSet.detailAddr = e.detail.value
  },
  confirm_select(e){
    var str = '';
    e.detail.values.map((item,index)=>{
      str += ` ${item.name}`
    })
    this.setData({
      areakey: false,
      'dataSet.currentadress' : str
    })
  },
  cancel_selcect(){
    this.setData({
      areakey : false
    })
  },
  chooseAdd(){
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
    var that = this;
    wx.showModal({
      title: '',
      content: '确认删除此收货地址吗？',
      success: function (res) {
        if (res.confirm) {

          let loginUid = wx.getStorageSync('loginUid')
          let userId = wx.getStorageSync('userId')
          wx.request({
            url: `${app.globalData.url}/api/member/deleteUserAddress?loginUid=${loginUid}&userId=${userId}&addrId=${that.data.id}`, //仅为示例，并非真实的接口地址
            method: "POST",
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                  })
                }, 800)
              }else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          })
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
    this.setData({
      id: options.id
    })
    this.getData(options.id)
  },
  getData(id){
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/getUserAddressById`, //仅为示例，并非真实的接口地址
      data: {
        loginUid: loginUid,
        userId: userId,
        addrId : id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          content: res.data.data,
          'dataSet.currentadress': res.data.data.addr,
          'dataSet.name': res.data.data.name,
          'dataSet.detailAddr': res.data.data.detailAddr,
          'dataSet.mobile': res.data.data.mobile,
          'dataSet.tag': res.data.data.tag,
          'dataSet.defaultFlag': res.data.data.defaultFlag
        })
      }
    })
  },
  save(){
    for (var key in this.data.dataSet) {
      if (this.data.dataSet[key] == '' && key != 'defaultFlag'){
        wx.showToast({
          title : '请填写完整信息',
          icon : 'none'
        })
        return
      }
    }
		console.log(this.data.dataSet.defaultFlag)
    let loginUid = wx.getStorageSync('loginUid')
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.url}/api/member/updateUserAddress?loginUid=${loginUid}&userId=${userId}`, //仅为示例，并非真实的接口地址
      method : "POST",
      data: {
        "userAddr" : {
          "addr": that.data.dataSet.currentadress,
          "defaultFlag": that.data.dataSet.defaultFlag ? 1 : 0,
          "delFlag": 0,
          "detailAddr": that.data.dataSet.detailAddr,
          "id": that.data.id,
          "mobile": that.data.dataSet.mobile,
          "name": that.data.dataSet.name,
          "tag": that.data.dataSet.tag
        }
      },
      success(res) {
        if(res.data.code == 200 ){
          wx.showToast({
            title : res.data.message,
            icon : 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面

            })
          }, 800)
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  switch1Change(e){
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