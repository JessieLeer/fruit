import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		cuser: {},
		orderId: '',
		groupId: '',
		orderInfo: {},
		pay: {
			show: false,
			paShow: false,
			balanceShow: false,
			type: 'wechat',
			password: '',
			passFocus: false
		},
		groupId: ''
	},
	onLoad(option) {
		this.setData({
			groupId: option.groupid
		})
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
			url: `${app.globalData.url}/api/group/groupAdd`,
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
				userId: this.data.cuser.userId,
				groupId: this.data.groupId
			},
			success(res) {
				if(res.data.code == 200) {
					_this.setData({
						groupId: res.data.data.groupId,
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
	
	paySuccess(e) {
		wx.redirectTo({
			url: `/pages/home/group/success/index?id=${this.data.groupId}`
		})
	},
	passClose(e) {
		this.setData({
			'pay.paShow': false,
			'pay.password': ''
		})
	}
})