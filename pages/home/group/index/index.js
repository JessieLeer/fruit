import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"
import qrcode from '../../../../utils/weapp-qrcode.js'
import barcode from '../../../../utils/index'

const app = getApp()

Page({
	data: {
		position: null,
		shop: {},
		cuser: {},
		good: {
			page: 1,
			query: '',
			data: [],
			isLoadAll: false
		},
		noGroupShow: false,
		caller: 0,
		isLoading: true,
		key : true,
		updistance: 0,
		custom: app.globalData.custom
	},
	onLoad(option) {
		if(wx.getSystemInfoSync().system.indexOf('iOS') == -1){
			this.setData({
				updistance: 0
			})
		}else{
			this.setData({
				updistance: -60					 
			})						 
		}
		wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      this.setData({
				position: app.globalData.position,
				shop: app.globalData.shop,
		  })
			this.initCuser()
			this.shopShow()
      wx.hideLoading()
    }, 1000)
	},
	onShow() {
		this.initCuser()
		if(this.data.shop.id == app.globalData.shop.id) {
			if(this.data.noGroupShow) {
				this.setData({
					'good.page': 1
				})
				this.index()
			}else{
				this.refresh()
			}
			// this.refresh()
		}else{
			wx.showLoading({
				title: '加载中',
			})
			this.setData({
				position: app.globalData.position,
				shop: app.globalData.shop,
		  })
			this.shopShow()
		  	console.log(111222)
			
      wx.hideLoading()
		}

	},
	onShareAppMessage() {
  },
	/*-- 初始化用户 --*/
	initCuser(e) {
		this.setData({
			cuser: wx.getStorageSync('cuser')
		})
	},
	onSearChange(e) {
		this.setData({
			'good.query': e.detail
		})
	},
	/*-- 页面跳转 --*/
	go(e) {
		let url
		if(this.data.cuser.userId) {
			url = e.currentTarget.dataset.url
		}else{
			url = '/pages/user/login/step0'
		}
		wx.navigateTo({
			url: url
		})
	},
	goTab(e) {
		if(this.data.cuser.userId) {
			app.globalData.orderActive = 2
			console.log(app.globalData.orderActive)
			wx.switchTab({
				url: e.currentTarget.dataset.url
			})
		}else{
			this.go('/pages/user/login/step0')
		}
	},
	
	/*-- 查看会员码 --*/
	viewCode(e) {
		this.setData({
			codeShow: true
		})
		new qrcode('myQrcode',{
			text: this.data.cuser.cardNo,
			width: 200,
			height: 200,
			padding: 12, 
			// 二维码可辨识度
			correctLevel: qrcode.CorrectLevel.L, 
			callback: (res) => {
			}
		})
		barcode.barcode('firstCanvas', JSON.stringify(this.data.cuser.cardNo) , 280 * 2, 100 * 2)
	},
	onCodeClose(e) {
		this.setData({
			codeShow: false
		})
	},
	
	/*-- 获取最近店铺 --*/
	shopShow(e) {
		if(this.data.shop.id) {
			this.setData({
				isLoading: false
			})
			this.index()
		}else{
			let _this = this
			wx.request({
				url: `${app.globalData.custom.url}/api/curr/store`,
				data: {
					latitude: _this.data.position.location.lat,
					longitude: _this.data.position.location.lng,
				},
				success(res) {
					_this.setData({
						isLoading: false
					})
					if(res.data.message == '附近没有门店'){
						_this.setData({
							caller: res.data.data
						})
					}else{
						app.globalData.shop = res.data.data
						_this.setData({
							shop: res.data.data
						})
						_this.index()
					}
				}
			})
		}
	},
	
	index(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/groupNow`,
			data: {
				goodName: this.data.good.query,
				page: this.data.good.page,
				pageNum: 10,
				storeId: this.data.shop.id
			},
			success(res) {
				wx.stopPullDownRefresh();
				wx.hideLoading()
				if(_this.data.good.page == 1) {
					_this.setData({
						'good.data': []
					})
				}
				if(res.data.data.length == 0) {
					_this.setData({
						'good.isLoadAll': true
					})
				}else{
					for(let item of res.data.data) {
						item.leftCount = Math.ceil((new Date(item.gendTime) - new Date()) / 86400000)
					}
					_this.setData({
						'good.data': _this.data.good.data.concat(res.data.data)
					})
				}
				_this.setData({
					noGroupShow: _this.data.good.data.length == 0
				})
			}
		})
	},
	
	onSearch(e) {
		this.setData({
			'good.data': [],
			'good.page': 1
		})
		this.index()
	},
	
	/*-- 上拉刷新 --*/
	refresh(e) {
		this.setData({
			'good.data': [],
			'good.page': 1
		})
		wx.showLoading({
      title: '加载中',
    })
		this.index()
	},
	onReachBottom(){
		if (this.data.isLoadAll) {

		} else {
			this.setData({
				'good.page': this.data.good.page + 1
			})
			this.index()
		}
	},

	onPullDownRefresh(){
		this.refresh()
	},
	/*-- 下拉加载更多商品 --*/
	loadMore(e) {
		
	},
})