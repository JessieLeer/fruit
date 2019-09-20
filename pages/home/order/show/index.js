import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		shop: {},
		goods: [],
		goodIds: '',
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
		coupon: {
			show: false,
			data: [],
			useing: {},
			text: '无可用'
		},
		emptyCoupon: {}
	},
	onLoad(option) {
		this.setData({
			goods: app.globalData.orderGoods,
			goodIds: app.globalData.orderGoods.map((item) => {
				return item.id || item.commodityId
			}).toString(),
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
	/*-- 确认订单 --*/
	confirm(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/confirm`,
			data: {
				carts: this.data.goods.map((item) => {
					return {
						commodityId: item.id || item.commodityId,
						number: item.count || item.number,
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
				res.data.data.payMoney = res.data.data.totalMoney
				_this.setData({
					orderInfo: res.data.data
				})
				_this.couponIndex({quota: _this.data.orderInfo.totalMoney})
			}
		})
	},
	/*-- 获取当前订单可用优惠券 --*/
	openCoupon(e) {
		this.setData({
			'coupon.show': true
		})
	},
	couponIndex(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.70:8080/api/useList',
			data: {
				commodityId: this.data.goodIds,
				quota: e.quota,
				uid: this.data.cuser.userId
			},
			success(res) {
				_this.setData({
					'coupon.data': res.data.data,
					'coupon.text': res.data.data.length == 0 ? '无可用' : `${res.data.data.length}张可用`
				})
			}
		})
	},
	onCouponClose(e) {
		this.setData({
			'coupon.show': false
		})
	},
	couponSelect(e) {
		let coupon = e.currentTarget.dataset.coupon
		if(coupon.rid == undefined) {
			this.setData({
				'coupon.show': false,
			})
		}else{
			this.setData({
				'coupon.useing': coupon,
				'coupon.show': false,
				'coupon.text': coupon.rtype == '1' ? `减${coupon.money}元` : `${coupon.fracture * 10}折`,
			})
			let _this = this
			wx.request({
				url: 'http://192.168.1.70:8080/api/orderUse',
				data: {
					commodityId: this.data.goodIds.toString(),
					commodityQuota: this.data.goods.map((item) => {
						return item.sellingPrice * item.number
					}).toString(),
					quota: this.data.orderInfo.totalMoney,
					rid: coupon.rid
				},
				success(res) {
					_this.setData({
						'orderInfo.payMoney': parseFloat(res.data.total)
					})
				}
			})
		}
	},
	
	onPayshow(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/commit`,
			method: 'post',
			data: {
				carts: JSON.stringify(this.data.goods.map((item) => {
					return {
						commodityId: item.id || item.commodityId,
						number: item.count || item.number,
						name: item.name,
						sellingPrice: item.sellingPrice,
					  originalPrice: item.originalPrice,
						headImage: item.headImage
					}
				})),
			  postType: this.data.active,
				addressId: this.data.active == '1' ? '' : this.data.orderInfo.fsId,
				storeId: this.data.shopId,
				userId: this.data.cuser.userId
			},
			success(res) {
				if(res.data.code == 200) {
					if(_this.data.coupon.useing.rid) {
						wx.request({
							url: 'http://192.168.1.70:8080/api/couponUpdate',
							data: {
								rid: _this.data.coupon.useing.rid
							},
							success(res) {
								console.log(res)
							}
						})
					}
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