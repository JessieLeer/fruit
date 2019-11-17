import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

//获取应用实例
const app = getApp()

Page({
	data: {
    userInfo: {},
    cardNo : null,
    shopId : '',
		logo: app.globalData.custom.logo
  },
  onShow(){
    this.loginGetCode()
  },
  onLoad(options) {
    if (JSON.stringify(options) =='{}') return
    var scene = decodeURIComponent(options.scene)
    this.setData({
      shopId: scene.shopId
    })
	},
	getPhoneNumber(e) {
    let code = wx.getStorageSync('code')
    let openid = wx.getStorageSync('openid')
    // return
    var that = this
    //3. 解密
    wx.request({
      url: `${app.globalData.custom.url}/api/mini/getPhoneNumber`,
      data: {
        'decryptData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'code': code,
      },
      success(res) {
        if(res.data.data == null) return
				let _res = res.data.data.phoneNumber
				wx.login({
					success: res => {
						wx.request({
							url: `${app.globalData.custom.url}/api/mini/login`,
							data: {
								mobile: _res,
								loginType: 'wx',
								code: res.code
							},
							success(res) {
								if(res.data.code == 200) {
                  console.log(res.data.data)
									wx.setStorageSync('cuser', res.data.data)
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
            url: `../../bindVIP/index?shopId=${that.data.shopId}&type=wx`
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
      url: `./step1?shopId=${this.data.shopId}`
		})
	}
})