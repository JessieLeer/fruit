import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		shop: {},
		goods: [],
		cuser: {},
		shopId: '',
		orderInfo: {},
		active: 0,
		pay: {
			show: false,
			paShow: false,
			type: '',
			password: '',
			passFocus: false
		},
		orderId: '',
		localShopcarGoods: [],
	},
	onLoad(option) {
		this.setData({
			goods: app.globalData.orderGoods,
			shopId: option.shopId
		})
		this.initCuser()
		this.initShopcar()
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
	/*-- 初始化购物车数据 --*/
	initShopcar(e) {
		let _this = this
		wx.getStorage({
			key: 'shopcar',
			success(res) {
				_this.setData({
					localShopcarGoods: res.data,
				})
			}
		})
	},
	tabChange(e) {
		this.setData({
			active: e.detail.index
		})
	},
	confirm(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/order/confirm',
			data: {
				carts: this.data.goods.map((item) => {
					return {
						commodityId: item.id,
						number: item.count,
						name: item.name,
						sellingPrice: item.sellingPrice,
					  originalPrice: item.originalPrice,
						headImage: item.headImage
					}
				}),
				storeId: this.data.shopId,
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
			url: 'http://192.168.1.103:8080/api/order/commit',
			method: 'post',
			data: {
				carts: JSON.stringify(this.data.goods.map((item) => {
					return {
						commodityId: item.id,
						number: item.count,
						name: item.name,
						sellingPrice: item.sellingPrice,
					  originalPrice: item.originalPrice,
						headImage: item.headImage
					}
				})),
			  postType: this.data.active,
				addressId: this.data.active == '0' ? '' : this.data.orderInfo.fsId,
				storeId: this.data.shopId,
				userId: this.data.cuser.userId
			},
			success(res) {
				_this.data.goods.forEach((item) => {
					_this.data.localShopcarGoods.splice(_this.data.localShopcarGoods.findIndex(v => v.id == item.id), 1)
				})
				_this.setData({
					orderId: res.data.data.id,
					'pay.show': true,
					localShopcarGoods: _this.data.localShopcarGoods
				})
				wx.setStorage({
					key: 'shopcar',
					data: _this.data.localShopcarGoods,
					success(res) {}
				})
			}
		})
	},
	onClose(e) {
		this.setData({
			'pay.show': false
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
			wx.request({
				url: 'http://192.168.1.103:8080/api/pay/balance',
				data: {
					orderId: this.data.orderId,
					payPwd: this.data.pay.password,
					userId: this.data.cuser.userId
				},
				success(res) {
					if(res.data.code == 200) {
						wx.redirectTo({
							url: '/pages/home/order/success/index'
						})
					}else{
						Toast(res.data.message)
					}
				}
			})
		}
	},
	passClose(e) {
		this.setData({
			'pay.paShow': false,
			'pay.password': ''
		})
	}
})