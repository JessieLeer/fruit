import Dialog from "../../../miniprogram_npm/vant-weapp/dialog/dialog"
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'

const app = getApp()

Page({
	data: {
		active: 0,
		cuser: {},
		order0: {
			data: [],
			isLoadAll: false,
			page: 1
		},
		order1: {
			data: [],
			isLoadAll: false,
			page: 1
		},
		order2: {
			data: [],
			isLoadAll: false,
			page: 1
		},
		windowH: 0,
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
		logistics: {}
	},
	onLoad(option) {
		this.initSystem()
		this.initCuser()
	},
	onShow() {
		this.refreshOrder()
	},
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	/*-- 刷新订单数据 --*/
	refreshOrder(e) {
		this.setData({
			'order0.data': this.data.order0.data,
			'order1.data': this.data.order1.data,
			'order2.data': this.data.order2.data,
		})
	},
	/*-- 获取设备信息（屏幕高度等） --*/
	initSystem(e) {
		let _this = this
		wx.getSystemInfo({
			success (res) {
				_this.setData({
					windowH: res.windowHeight
				})
			}
		})
	},
	/*-- 初始化用户 --*/
	initCuser(e) {
		let _this = this
		wx.getStorage({
			key: 'cuser',
			success (res) {
				console.log(res)
				_this.setData({
					cuser: res.data
				})
				_this.index({type: 0})
				_this.index({type: 1})
				_this.index1()
			}
		})
	},
	/*-- 获取配送或者自提订单列表 --*/
	index(e) {
		let type = parseInt(e.type)
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/order/list`,
			data: {
				userId: this.data.cuser.userId,
				pageNum: this.data[`order${e.type}`].page,
				pageSize: 10,
				type: e.type
			},
			success(res) {
				if(res.data.data.length == 0) {
					switch(type) {
						case 0:
							_this.setData({
								'order0.isLoadAll': true
							})
							break
						case 1:
							_this.setData({
								'order1.isLoadAll': true
							})
							break	
					}
				}else{
					for(let item of res.data.data) {
						switch(item.status) {
							case '1':
								item.status = '待支付'
								break
							case '2':
								item.status = '待配送'
								break
							case '3':
								item.status = '待自提'
								break
							case '4':
								item.status = '配送中'
								break
							case '5':
								item.status = '已取消'
								break
							case '6':
								item.status = '已完成'
								break
						}
					}
					switch(type) {
						case 0:
							_this.setData({
								'order0.data': _this.data.order0.data.concat(res.data.data)
							})
							break
						case 1:
							_this.setData({
								'order1.data': _this.data.order1.data.concat(res.data.data)
							})
							break	
					}
				}
			}
		})
	},
	
	/*-- 获取拼团订单列表 --*/
	index1(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/group/order/list`,
			data: {
				userId: this.data.cuser.userId,
				pageNum: this.data.order2.page,
				pageSize: 10,
			},
			success(res) {
				if(res.data.data.length == 0) {
					_this.setData({
						'order2.isLoadAll': true
					})
				}else{
					for(let item of res.data.data) {
						switch(item.status) {
							case '1':
								item.status = '待支付'
								break
							case '2':
								item.status = '待配送'
								break
							case '3':
								item.status = '待自提'
								break
							case '4':
								item.status = '配送中'
								break
							case '5':
								item.status = '已取消'
								break
							case '6':
								item.status = '已完成'
								break
						}
					}
					_this.setData({
						'order2.data': _this.data.order2.data.concat(res.data.data)
					})
				}
			}
		})
	},

	/*-- 上拉刷新 --*/
	refresh(e) {
		let id = e.currentTarget.dataset.id
		switch(id) {
			case '0':
				this.setData({
					'order0.data': [],
					'order0.page': 1
				})
				this.index({type: id})
				break
			case '1':
				this.setData({
					'order1.data': [],
					'order1.page': 1
				})
				this.index({type: id})
				break
			case '2':
				this.setData({
					'order2.data': [],
					'order2.page': 1
				})
				this.index1({type: id})
				break
		}				 
	},
	
	/*-- 下拉加载更多商品 --*/
	loadMore(e) {
		let id = e.currentTarget.dataset.id
		if(this.data[`order${id}`].isLoadAll){
		}else{
			switch(id) {
				case '0':
					this.setData({
					  'order0.page': this.data[`order${id}`].page + 1
				  })
					this.index({type: id})
					break
				case '1':
					this.setData({
					  'order1.page': this.data[`order${id}`].page + 1
				  })
					this.index({type: id})
					break
				case '2':
					this.setData({
					  'order2.page': this.data[`order${id}`].page + 1
				  })
					this.index1({type: id})
					break	
			}
		}
	},
	
	onChange(e) {
		this.setData({
			active: e.detail.index
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
						_this.data[`order${type}`].data.filter((item) => {
							return item.id == id
						})[0].status = '已取消'
						_this.onShow()
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
 		wx.request({
			url: `${app.globalData.url}/api/order/receipt`,
			data: {
				orderId: id
			},
			success(res) {
				if(res.data.code == 200) {
					Toast('操作成功')
					_this.data[`order${type}`].data.filter((item) => {
						return item.id == id
					})[0].status = '已完成'
					_this.onShow()
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
			'pay.password': e.detail
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
		switch(parseInt(this.data.pay.orderType)) {
			case 0:
				status = '待配送'
				break
			case 1:
				status = '待自提'
				break
		}
		this.data[`order${this.data.pay.orderType}`].data.filter((item) => {
			return item.id == this.data.pay.id
		})[0].status = status
		this.onShow()
	},
	passClose(e) {
		this.setData({
			'pay.paShow': false,
			'pay.password': ''
		})
	}
})