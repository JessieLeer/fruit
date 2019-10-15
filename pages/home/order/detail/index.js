import Dialog from "../../../../miniprogram_npm/vant-weapp/dialog/dialog"
import Toast from '../../../../miniprogram_npm/vant-weapp/toast/toast'
import qrcode from '../../../../utils/weapp-qrcode.js'

const app = getApp()

Page({
	data: {
		id: '',
		cuser: {},
		order: {},
		pay: {
			id: '',
			orderType: '',
			cost: 0,
			show: false,
			paShow: false,
			balanceShow: true,
			type: '',
			password: '',
			passFocus: false
		},
		logShow: false,
		logistics: {},
		emptyCoupon: {},
		waitime: 0
	},
	onLoad(option) {
		this.initUser()
		this.setData({
			id: option.id
		})
		this.waitShow()
		this.show()
	},
	initUser(e) {
		let _this = this
		wx.getStorage({
			key: 'cuser',
			success (res) {
				_this.setData({
					cuser: res.data
				})
			}
		})
	},
	countdown(e) {
		let t = setInterval(() => {
			this.setData({
				'order.life': this.data.order.life - 1
			})
			if(this.data.order.life < 0) {
				this.setData({
					'order.status': '已取消'
				})
				clearInterval(t)
			}
		},1000)
	},
	/*-- 获取待支付时间 --*/
	waitShow(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/waitPayTime`,
			success(res) {
				_this.setData({
					waitime: res.data.data
				})
			}
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/detail`,
			data: {
				orderId: this.data.id
			},
			success(res) {
				res.data.data.type = res.data.data.type == '0' ? '门店配送' : '到店自提'
				res.data.data.payType = res.data.data.payType == '0' ? '余额支付' : '微信支付'
				res.data.data.discountMoney = res.data.data.discountMoney ? `-¥${res.data.data.discountMoney}` : 0
				switch(parseInt(res.data.data.status)) {
					case 1:
						res.data.data.createTime = res.data.data.createTime.replace(/-/g, '/')
					  let life = (_this.data.waitime - Math.floor((new Date().getTime() - new Date(res.data.data.createTime).getTime()) / 1000)) 
						if(life < 0) {
							res.data.data.status = '已取消'
						}else{
							res.data.data.status = '待支付'
							res.data.data.life = life
							_this.countdown()
						}
						break
					case 2:
						res.data.data.status = '待配送'
						break
					case 3:
						res.data.data.status = '待自提'
						new qrcode('myQrcode',{
							text: res.data.data.qrCode,
							width: 200,
							height: 200,
							padding: 12, 
							// 二维码可辨识度
							correctLevel: qrcode.CorrectLevel.L, 
							callback: (res) => {
							}
						})
						break
					case 4:
						res.data.data.status = '配送中'
						break
					case 5:
						res.data.data.status = '已取消'
						break
					case 6:
						res.data.data.status = '已完成'
						break
				}
				if(res.data.data.groupId) {
					_this.setData({
						'pay.balanceShow': false
					})
				}
				_this.setData({
					order: res.data.data
				})
			}
		})
	},
	copy(e) {
		wx.setClipboardData({
      data: this.data.order.id + '',
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
	},
	
	/*-- 再来一单 --*/
	again(e) {
		let [
			id,
			shopId
		] = 
		[
			e.currentTarget.dataset.id,
			e.currentTarget.dataset.shopid
		]
		wx.request({
			url: `${app.globalData.url}/api/order/detail`,
			data: {
				orderId: id
			},
			success(res) {
				app.globalData.orderGoods = res.data.data.carts
				wx.navigateTo({
					url: `/pages/home/order/show/index?shopId=${shopId}`
				})
			}
		})
	},
	/*-- 取消订单 --*/
	cancel(e) {
		Dialog.confirm({
			message: '确认取消该订单吗？'
		}).then(() => {
			let [
				id,
				type,
				_this
			] = [
				e.currentTarget.dataset.id,
				e.currentTarget.dataset.type,
				this
			]
			wx.request({
				url: `${app.globalData.url}/api/order/cancel`,
				data: {
					orderId: id
				},
				success(res) {
					if(res.data.code == 200) {
						Toast('操作成功')
						_this.setData({
							'order.status': '已取消'
						})
					}
				}
			})
		}).catch(() => {
		})
	},
	/*-- 确认收货 --*/
	receipt(e) {
		let [
			id,
			type
		] = [
			e.currentTarget.dataset.id,
			e.currentTarget.dataset.type
		]
		let _this = this
 		wx.request({
			url: `${app.globalData.url}/api/order/receipt`,
			data: {
				orderId: id
			},
			success(res) {
				if(res.data.code == 200) {
					Toast('操作成功')
					_this.setData({
						'order.status': '已完成'
					})
				}
			}
		})
	},
	/*-- 查看物流 --*/
	logistics(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/logistics`,
			data: {
				orderId: e.currentTarget.dataset.id
			},
			success(res) {
				if(res.data.code == 200) {
					_this.setData({
						logShow: true,
						logistics: res.data.data
					})
				}else{
					Toast(res.data.message)
				}
			}
		})
	},
	onLogclose(e) {
		this.setData({
			logShow: false
		})
	},
	/*-- 支付订单 --*/
	onPayshow(e) {
		this.setData({
			'pay.id': e.currentTarget.dataset.id,
			'pay.orderType': e.currentTarget.dataset.type,
			'pay.show': true,
			'pay.cost': e.currentTarget.dataset.cost
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
			'pay.password': e.detail.value
		})
		if(this.data.pay.password.length == 6 && this.data.pay.type == 'balance') {
			let _this = this
			wx.request({
				url: `${app.globalData.url}/api/pay/balance`,
				data: {
					orderId: this.data.pay.id,
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
		Toast('操作成功')
		this.setData({
			'pay.show': false,
			'pay.paShow': false,
			'pay.password': ''
		})
						
		let status
		switch(this.data.pay.orderType) {
			case '门店配送':
				status = '待配送'
				break
			case '到店自提':
				status = '待自提'
				break
		}
		this.setData({
			'order.status': status
		})
	},
	passClose(e) {
		this.setData({
			'pay.paShow': false,
			'pay.password': ''
		})
	}
})