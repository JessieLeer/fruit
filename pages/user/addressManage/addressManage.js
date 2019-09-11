// page/user/addressManage/addressManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        id: "01",
        address:'绿地新城',
        addressMain:"商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层商务D2楼13层",//详细地址
        name:"李先生",//姓名
        tel:"18888888888",//联系电话
        icon:"1",//地址标签
      },
      {
        id: "01",
        address: '绿地新城',
        addressMain: "商务D2楼13层",//详细地址
        name: "李先生",//姓名
        tel: "18888888888",//联系电话
        icon: "2",//地址标签
      },
      {
        id: "01",
        address: '绿地新城',
        addressMain: "商务D2楼13层",//详细地址
        name: "李先生",//姓名
        tel: "18888888888",//联系电话
        icon: "3",//地址标签
      },
      {
        id: "01",
        address: '绿地新城',
        addressMain: "商务D2楼13层",//详细地址
        name: "李先生",//姓名
        tel: "18888888888",//联系电话
        icon: "4",//地址标签
      },
      {
        id: "01",
        address: '绿地新城',
        addressMain: "商务D2楼13层",//详细地址
        name: "李先生",//姓名
        tel: "18888888888",//联系电话
        icon: "1",//地址标签
      },
      {
        id: "01",
        address: '绿地新城',
        addressMain: "商务D2楼13层",//详细地址
        name: "李先生",//姓名
        tel: "18888888888",//联系电话
        icon: "1",//地址标签
      }
      ]
  },

  iconSign:function(){//判断地址类型
  
  },

  toEdit:function(){
    wx.navigateTo({
      url: 'editAddress/editAddress',
    })
  },

  newAddress:function(){//新增地址
    console.log(this.data.content.length);
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