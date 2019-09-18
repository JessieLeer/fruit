import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

//获取应用实例
const app = getApp()

Page({
	data: {
    userInfo: {},
    cardNo : null
  },
  onShow(){

  },
	onLoad() {
		// if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   this.bindGetUserInfo();
    // }
	},
	
	getPhoneNumber (e) {
    console.log(e.detail.encryptedData + "空格" + e.detail.iv + "空格" +app.globalData.code)
    // return
    var that = this;
		//3. 解密
    wx.request({

      url: `${app.globalData.url}/api/mini/getPhoneNumber`,
      data: {
        'decryptData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'code': app.globalData.code,
      },
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.request({
					url: `${app.globalData.url}/api/login`,
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
        console.log(res)
        that.loginGetCode()
        if (res.data.code == 500)return
        app.globalData.loginUid = res.data.data.loginUid;
        app.globalData.userId = res.data.data.userId;
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
        app.globalData.avatarUrl = res.userInfo.avatarUrl
        app.globalData.Nickname = JSON.parse(res.rawData).nickName
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
        app.globalData.code = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // wx.request({
        // 	url: 'https://api.weixin.qq.com/sns/jscode2session',
        // 	data: {
        // 		appId: 'wx2abde02acd11b274',
        // 		secret: '2d8018b4f34d5f8815bfd627cd75907f',
        // 		js_code: res.code,
        // 		grant_type: 'authorization_code'
        // 	},
        // 	success(res) {
        // 		_this.globalData.openid = res.data.openid 
        // 		_this.globalData.session_key = res.data.session_key
        // 	}
        // })
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