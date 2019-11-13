import Dialog from "../../miniprogram_npm/vant-weapp/dialog/dialog"

const app = getApp()

Component({
  properties: {
    isShow: {
			type: Boolean,
			default: false
		},
		type: {
			type: String
		},
		cost: {
			type: Number
		},
		paShow: {
			type: Boolean,
			default: false
		},
		balanceShow: {
			type: Boolean,
			default: true
		},
		password: {
			type: String
		},
		passFocus: {
			type: Boolean,
			default: true
		},
		orderId: {
			type: String
		}
  },
  data: {
		cuser: {},
		balance: 0,
		isInputShow: false,
		isPaypass: false
  },
	
  ready() { 
	},
	lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
			this.initUser()
		},
    moved() { 
			
		},
    detached() { 
			
		},
  },
	pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
			
		},
    hide() { 
		},
    resize() { 
			
		},
  },
  methods: {
		initUser(e) {
			let _this = this
			wx.getStorage({
				key: 'cuser',
				success(res) {
					_this.setData({
						cuser: res.data
					})
					_this.balanceShow()
					_this.paypaShow()
				}
			})
		},
		balanceShow(e) {
			let _this = this
			wx.request({
				url: `${app.globalData.custom.url}/api/user/balance`,
				data: {
					userId: this.data.cuser.userId
				},
				success(res) {
					_this.setData({
						balance: res.data.data
					})
				}
			})
		},
		paypaShow(e) {
			let _this = this
			wx.request({
				url: `${app.globalData.custom.url}/api/user/checkPayPwd`,
				data: {
					userId: this.data.cuser.userId
				},
				success(res) {
					_this.setData({
						isPaypass: res.data.code == 200
					})
				}
			})
		},
    onClose(e) {
			this.triggerEvent('onClose', {})
		},
		onClick(e) {
			if(e.currentTarget.dataset.name == 'balance' && this.properties.cost > this.data.balance) {
				
			}else{
				if(e.currentTarget.dataset.name == 'balance') {
					if(this.data.isPaypass) {
						this.setData({
							isInputShow: true
						})
						this.triggerEvent('onChange', e.currentTarget.dataset.name)
					}else{
						Dialog.confirm({
							message: '您还未设置支付密码，是否现在设置?'
						}).then(() => {
							wx.redirectTo({
								url: '/pages/user/setting/paysetting/phone-set'
							})
						}).catch(() => {
							// on cancel
						})
					}
				}else{
					this.setData({
						isInputShow: false
					})
					this.triggerEvent('onChange', e.currentTarget.dataset.name)
				}
			}
		},
		handleFocus(e) {},
		handlePass(e) {
			let _this = this
			if(this.properties.type == 'wechat') {
				wx.request({
					url: `${app.globalData.custom.url}/api/pay/wechat`,
					data: {
						openId: wx.getStorageSync('openid'),
						userId: this.data.cuser.userId,
						orderId: this.properties.orderId
					},
					success(res) {
						if(res.data.code == 200) {
							wx.requestPayment({
								timeStamp: res.data.data.timeStamp,
								nonceStr: res.data.data.nonceStr,
								package: res.data.data.packageStr,
								signType: res.data.data.signType,
								paySign: res.data.data.paySign,
								succcess(res) {
									_this.triggerEvent('wepaySuccess', {})
								},
								fail(res) {
									console.log(res)
								},
								complete(res) {
									if(res.errMsg == 'requestPayment:ok'){
										wx.request({
											url: `${app.globalData.custom.url}/api/pay/callBack`,
											data: {
												orderId: _this.properties.orderId
											},
											success(res) {
												_this.triggerEvent('wepaySuccess', {gid: res.data})
											}
										})										
									}
								}
							})
						}
					}
				})
			}else{
				this.triggerEvent('handlePass', {})
			}
		},
		
		/**
		 * 输入密码监听
		 */
		onPassChange(e){
			this.triggerEvent('passInput', e.detail)
		},
		
		onPassclose(e) {
			this.setData({
				isInputShow: false
			})
			this.triggerEvent('passClose', {})
			this.setData({
				isInputShow: true
			})
		}
  }
})
