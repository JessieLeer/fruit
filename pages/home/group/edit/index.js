import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		cuser: {},
		orderId: '',
		orderInfo: {},
		pay: {
			show: false,
			paShow: false,
			balanceShow: false,
			type: '',
			password: '',
			passFocus: false
		},
	},
	onLoad(option) {
		this.initCuser()
	},
	/*-- 初始化用户 --*/
	initCuser(e) {
		let _this = this
		wx.getStorage({
			key: 'cuser',
			success (res) {
				_this.setData({
					cuser: res.data
				})
				_this.confirm()
			}
		})
	},
	/*-- 确认订单信息 --*/
	confirm(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/confirm`,
			data: {
				carts: [
					{
						commodityId: app.globalData.groupbuy.sid,
						number: 1,
						name: app.globalData.groupbuy.shopName,
						sellingPrice: app.globalData.groupbuy.gprice,
						originalPrice: app.globalData.groupbuy.originalPrice,
						headImage: app.globalData.groupbuy.shopImg
					}
				],
				storeId: app.globalData.groupbuy.storeId,
				userId: this.data.cuser.userId
			},
			success(res) {
				_this.setData({
				  orderInfo: res.data.data	
				})
			}
		})
	},
	
	onPayshow(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/commit`,
			method: 'post',
			data: {
				carts: JSON.stringify([
					{
						commodityId: app.globalData.groupbuy.sid,
						number: 1,
						name: app.globalData.groupbuy.shopName,
						sellingPrice: app.globalData.groupbuy.gprice,
						originalPrice: app.globalData.groupbuy.originalPrice,
						headImage: app.globalData.groupbuy.shopImg
					}
				]),
			  postType: 1,
				storeId: app.globalData.groupbuy.storeId,
				userId: this.data.cuser.userId
			},
			success(res) {
				if(res.data.code == 200) {
					_this.setData({
						orderId: res.data.data.id,
						'pay.show': true,
					})
				}else{
					Toast({
						message: res.data.message
					})
				}
			}
		})
	},
	onClose(e) {
		this.setData({
			'pay.show': false
		})
		wx.redirectTo({
			url: `/pages/home/order/detail/index?id=${this.data.orderId}`
		})
	},
	onpayChange(e) {
		this.setData({
			'pay.type': e.detail
		})
	},
	handlePass(e) {
		this.setData({
			'pay.paShow': true,
			'pay.passFocus': true
		})
	},
	passInput(e) {
		this.setData({
			'pay.password': e.detail
		})
		if(this.data.pay.password.length == 6 && this.data.pay.type == 'balance') {
			let _this = this
			wx.request({
				url: `${app.globalData.url}/api/pay/balance`,
				data: {
					orderId: this.data.orderId,
					payPwd: this.data.pay.password,
					userId: this.data.cuser.userId
				},
				success(res) {
					if(res.data.code == 200) {
						_this.paySuccess()
					}else{
						Toast(res.data.message)
					}
				}
			})
		}
	},
	paySuccess(e) {
		wx.redirectTo({
			url: `/pages/home/order/success/index?id=${this.data.orderId}`
		})
	},
	passClose(e) {
		this.setData({
			'pay.paShow': false,
			'pay.password': ''
		})
	}
})