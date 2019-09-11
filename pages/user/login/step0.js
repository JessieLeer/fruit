import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

//获取应用实例
const app = getApp()

Page({
	data: {
    userInfo: {},
	},
	onLoad() {
		if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
	},
	
	getPhoneNumber (e) {
		//3. 解密
    wx.request({
      url: 'http://192.168.1.103:8080/api/login/getPhoneNumber',
      data: {
        'decryptData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'key': app.globalData.session_key
      },
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success(res) {
				wx.request({
					url: 'http://192.168.1.103:8080/api/login',
					data: {
						mobile: JSON.parse(res.data.data).phoneNumber,
						openid: app.globalData.openid
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
      },
      fail(err) {
        console.log(err)
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