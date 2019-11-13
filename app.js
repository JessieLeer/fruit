let QQMapWX = require('./utils/qqmap-wx-jssdk.min.js')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'N4TBZ-BDWCU-ZQPVN-2XVXR-DNJYH-35B7S'
})

//app.js
App({
	globalData: {
		// 用户的地理位置信息
		position: {},
		shop: {},
		code : '',
		orderGoods: [],
		groupbuy: {},
		orderActive: 0,
		custom: {
			appId: 'wx6326bb7bd9f2a207',
			name: '缘疆佳园',
			//url: 'https://yjjy.ysk360.com',
			url: 'http://192.168.1.65:8082',
			logo: '/static/image/login_logo.png',
			phone: '13387085587'
		},
		/*custom: {
			appId: 'wx2abde02acd11b274',
			name: '云时空',
			url: 'https://yjjycs.ysk360.com',
			logo: '/static/image/login_logo1.png',
			phone: '400-056-6360'
		},*/
		/*custom: {
			appId: 'wx00ad98daf153da07',
			name: '鲁药',
			url: 'https://ly.ysk360.com',
			logo: '/static/image/login_logo2.jpg',
			phone: '0531-80660150'
		},*/
  },
  onLaunch() {
    // 登录
		let _this = this
    wx.login({
      success: res => {
			  wx.setStorageSync('code', res.code)
				wx.request({
					url: `${this.globalData.custom.url}/api/mini/getMiniOpenId`,
					data: {
						code: res.code
					},
					success(res) {
						wx.setStorageSync('openid', res.data.data.openid)
						wx.setStorageSync('session_key', res.data.data.session_key)		
					}
				})
      }
    })
  },
	userShow() {
		return new Promise((resolve,reject) => {
			wx.getSetting({
				success: res=> {
					if(res.authSetting['scope.userInfo']){
						wx.getUserInfo({
							success: res => {
								resolve(res)
							},
							fail: error => {
								reject(error)
							}
						})
					}else{
						wx.authorize({
							scope: 'scope.userInfo',
							success () {
								wx.getUserInfo({
									success: res => {
										resolve(res)
									},
									fail: error => {
										reject(error)
									}
								})
							}
						})
					}
				}
			})
		})
	},
	positionShow() {
		return new Promise((resolve, reject) => {
			// 获取用户信息
			wx.getSetting({
				success: res => {
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
								resolve(res.result)
							},
							fail(error) {
								reject('error')
							},
							complete(res) {
							}
						})
					}else{
						let _this = this
						wx.authorize({
							scope: 'scope.userLocation',
							success () {
								/*-- 根据坐标点获取地理位置信息 --*/
								qqmapsdk.reverseGeocoder({
									//获取表单传入的位置坐标,不填默认当前位置,示例为string格式
									location: '', 
									//是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
									//get_poi: 1, 
									success(res) {
										_this.globalData.position = res.result
										resolve(res.result)
									},
									fail(error) {
										reject('error')
									},
									complete(res) {
									}
								})
							}
						})
					}
				}
			})
		})
	}
})
