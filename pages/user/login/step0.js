import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

//获取应用实例
const app = getApp()

Page({
	data: {
    userInfo: {},
    cardNo : null,

  },
  onShow(){
    this.loginGetCode()
  },
	onLoad() {
	},
  getWxStorage(){

  },
	getPhoneNumber (e) {
    let code = wx.getStorageSync('code');
    let openid = wx.getStorageSync('openid');
    // return
    var that = this;
    //3. 解密
    wx.request({

      url: `${app.globalData.url}/api/mini/getPhoneNumber`,
      data: {
        'decryptData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'code': code,
      },
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if(res.data.data == null)return
				console.log('hello')
				console.log(res)
				console.log('world')
        wx.request({
					url: `${app.globalData.url}/api/mini/login`,
					data: {
						mobile: res.data.data.phoneNumber,
            openid: openid
					},
					success(res) {
						if(res.data.code == 200) {
							wx.setStorage({
								key: 'cuser',
								data: res.data.data
							})
							Toast.success('登录成功')
							setTimeout(() => {
								wx.navigateBack()
							},2000)
						}
					},
					fail(err) {
						console.log(err)
					}
				})
        that.loginGetCode()
        if (res.data.code == 500)return
       
        wx.setStorageSync('loginUid', res.data.data.loginUid)
        wx.setStorageSync('userId', res.data.data.userId)
        that.setData({
          cardNo: res.data.data.cardNo
        })
        that.onGetUserinfo()
			
      },
      fail(err) {
        console.log(err)
      }
    }) 
  },
  onGetUserinfo(){
    var that = this
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        wx.setStorageSync('Nickname', JSON.parse(res.rawData).nickName)
        if (!that.data.cardNo){
          wx.navigateTo({
            url: '../../bindVIP/index'
          })
        }else{
          wx.navigateBack()
        }
      }
    })
  },
  loginGetCode(){
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
      }
    })
  },
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset['url']
		})
	}
})