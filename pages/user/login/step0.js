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
	getPhoneNumber(e) {
    let code = wx.getStorageSync('code')
    let openid = wx.getStorageSync('openid')
    // return
    var that = this
    //3. 解密
    wx.request({
      url: `${app.globalData.url}/api/mini/getPhoneNumber`,
      data: {
        'decryptData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'code': code,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
				let _res = res.data.data.phoneNumber
        if(res.data.data == null)return
				 wx.login({
					success: res => {
						wx.request({
							url: `${app.globalData.url}/api/mini/login`,
							data: {
								mobile: _res,
								loginType: 'wx',
								code: res.code
							},
							success(res) {
								if(res.data.code == 200) {
                  console.log(231321)
									wx.setStorage({
										key: 'cuser',
										data: res.data.data
									})
									wx.setStorageSync('loginUid', res.data.data.loginUid)
						      wx.setStorageSync('userId', res.data.data.userId)
									Toast.success('登录成功')
									that.setData({
										cardNo: res.data.data.cardNo
									})
									that.onGetUserinfo()
								}
							},
							fail(err) {
								console.log(err)
							}
						})
						
					}
				})
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