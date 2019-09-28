let QQMapWX = require('./utils/qqmap-wx-jssdk.min.js')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'N4TBZ-BDWCU-ZQPVN-2XVXR-DNJYH-35B7S'
})

//app.js
App({
	globalData: {
		// 用户的微信信息
    userInfo: null,
		// 用户的地理位置信息
		position: {},
		// openid
		openid: '',
		// session_key
		userId : '',
		shop: {},
		code : '',
		orderGoods: [],
		session_key: '' ,
		groupbuy: {},
		url: 'https://yjjycs.ysk360.com',
		loginUid: '',
		avatarUrl : '',
		Nickname : '',
		mobile : ''
  },
  onLaunch() {
    // 登录
		let _this = this
    wx.login({
      success: res => {
			  wx.setStorageSync('code', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
				wx.request({
					url: 'https://api.weixin.qq.com/sns/jscode2session',
					data: {
						appId: 'wx2abde02acd11b274',
						secret: '2d8018b4f34d5f8815bfd627cd75907f',
						js_code: res.code,
						grant_type: 'authorization_code'
					},
					success(res) {
						wx.setStorageSync('openid', res.data.openid )
						wx.setStorageSync('session_key', res.data.session_key )
						_this.globalData.openid = res.data.openid
						_this.globalData.session_key = res.data.session_key				
					}
				})
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
				// 用户是否进行了获取信息的授权
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
						withCredentials: true,
            success: res => {
							// 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
				// 用户是否进行了获取位置信息的授权
				if(res.authSetting['scope.userLocation']) {
					/*-- 根据坐标点获取地理位置信息 --*/
					let _this = this
					qqmapsdk.reverseGeocoder({
						//获取表单传入的位置坐标,不填默认当前位置,示例为string格式
						location: '', 
						//是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
						//get_poi: 1, 
						success(res) {
							_this.globalData.position = res.result
						},
						fail(error) {
							console.error(error)
						},
						complete(res) {
						}
					})
				}else{
					wx.authorize({
						scope: 'scope.userLocation',
						success () {
							/*-- 根据坐标点获取地理位置信息 --*/
							let _this = this
							qqmapsdk.reverseGeocoder({
								//获取表单传入的位置坐标,不填默认当前位置,示例为string格式
								location: '', 
								//是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
								//get_poi: 1, 
								success(res) {
									_this.globalData.position = res.result
								},
								fail(error) {
									console.error(error)
								},
								complete(res) {
								}
							})
						}
					})
				}
      }
    })
  }
})
