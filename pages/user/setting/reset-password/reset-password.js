// page/user/setting/reset-password/reset-password.js
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
    console.log(this.data.Value)
      if (that.data.Value != that.data.nextValue  ){
        wx.showToast({
          title: "密码不一致",
          icon: 'none',
        })
      }else{
       
      }
    
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
    
  
    console.log(e.detail.value.password);
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