import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"
import qrcode from '../../../utils/weapp-qrcode.js'
import barcode from '../../../utils/index'

//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		isFirstload: true,
		cuser: {},
		position: null,
		shop: {},
		cates: [],
		active: 1,
		banners: [],
		goods: [],
		page: 1,
		isLoadAll: false,
		shopcarGoods: [],
		localShopcarGoods: [],
		totalPrice: 0,
		caller: 0,
		noGoodShow: false,
		codeShow: false,
		isCateChange: false,
		cateHeight: 0,
		isLoading: true
	},

  onLoad(option) {	
		wx.showLoading({
      title: '加载中',
    })
		this.bannerIndex()
		this.initCuser()
		app.positionShow().then((res) => {
			this.setData({
				position: res,
				shop: app.globalData.shop,
				cates: [],
				goods: [],
				isFirstload: false
			})
			this.shopShow()
			wx.hideLoading()
		})
  },
	
	onShow(option) {
		this.bannerIndex()
		this.initCuser()
		if(this.data.isFirstload) {
		}else{
			if(this.data.shop.id == app.globalData.shop.id) {
				this.initShopcar()
			}else{
				wx.showLoading({
					title: '加载中',
				})
				app.positionShow().then((res) => {
					this.setData({
						position: res,
						shop: app.globalData.shop,
						cates: [],
						goods: []
					})
					this.shopShow()
					wx.hideLoading()
				})
			}
		}
	},
	
	/*-- 初始化购物车数据 --*/
	initShopcar(e) {
		this.setData({
			localShopcarGoods: wx.getStorageSync('shopcar') || []
		})
		this.setShopcar()
		this.calTotal()
	},
	setShopcar(e) {
		this.setData({ 
			shopcarGoods: this.data.localShopcarGoods.filter((item) => {
				return item.shopId == this.data.shop.id
			})
		})
		this.setData({
			goods: this.generateCarcount({goods: this.data.goods})
		})
	},
	generateCarcount(e) {
		if(this.data.cuser.userId) {
			for(let item of e.goods) {
				let incart = this.data.shopcarGoods.filter((itemer) => {
					return itemer.id == item.id
				})[0]
				if(incart) {
					item.count = incart.count
				}else{
					item.count = 0
				}
				item.shopId = this.data.shop.id
			}
		}else{
			for(let item of e.goods) {
				item.count = 0
				item.shopId = this.data.shop.id
			}
		}
		return e.goods
	},
	
	/*-- 初始化用户 --*/
	initCuser(e) {
		this.setData({
			cuser: wx.getStorageSync('cuser')
		})
	},
	
	/*-- 获取banner轮播图 --*/
	bannerIndex(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/banner/list`,
			data: {},
			success(res) {
				_this.setData({
					banners: res.data.data
				})
			}
		})
	},
	bannerGo(e) {
		let url
		switch(e.currentTarget.dataset.banner.type) {
			case '0':
				url = `/pages/home/good/index?shopId=${this.data.shop.id}&id=${e.currentTarget.dataset.banner.value}`
				break
			case '1':
				url = `/pages/home/group/show/index?id=${e.currentTarget.dataset.banner.value}`
				break
			case '2':
				url = `/pages/home/image/index?url=${e.currentTarget.dataset.banner.showImg}`
				break
		}
		wx.navigateTo({
			url: url
		})
	},
	
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
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
			this.cateIndex()
			this.initShopcar()
		}else{
			let _this = this
			wx.request({
				url: `${app.globalData.url}/api/curr/store`,
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
						_this.cateIndex()
						_this.initShopcar()
					}
				}
			})
		}
	},
	
	/*--获取分类列表--*/
	cateIndex(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/category/list`,
			data: {
				storeId: _this.data.shop.id
			},
			success (res) {
				if(res.data.data.length > 0) {
					_this.setData({
						cates: res.data.data.sort((a,b) => {
							return a.rank - b.rank
						})
					})
					_this.setData({
						active: _this.data.cates.filter((item) => {
							return item.onShow == '1'
						})[0].id,
						cateHeight: 68 * (_this.data.cates.filter((item) => {
							return item.onShow == '1'
						}).length) + 'px'
					})
					_this.index()
				}
			}
		})
	},
	
	/*-- 切换分类 --*/
	cateChange(e) {
		this.setData({
			active: e.target.id,
			goods: [],
			page: 1,
			isCateChange: true,
			isLoadAll: false,
			noGoodShow: false
		})
		wx.showLoading({
      title: '加载中',
    })
		this.index()
	},
	
	/*-- 获取商品列表 --*/
	index(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/commodity/category`,
			data: {
				userId: this.data.cuser.userId || '',
				storeId: this.data.shop.id,
				categoryId: this.data.active,
				pageNum: this.data.page,
				pageSize: 10
			},
			success(res) {
				if(_this.data.page == 1) {
					_this.setData({
						goods: []
					})
				}
				if(res.data.data.length == 0) {
					_this.setData({
						isLoadAll: true
					})
				}else{
					_this.setData({
						goods: _this.data.goods.concat(_this.generateCarcount({goods: res.data.data}))
					})
				}
				wx.hideLoading()
				_this.setData({
					noGoodShow: _this.data.goods.length == 0
				})
			}
		})
	},
	
	/*-- 上拉刷新 --*/
	refresh(e) {
		if(this.data.isCateChange){
			this.setData({
				isCateChange: false
			})
		}else{
			this.setData({
				page: 1
			})
			this.index()
		}
	},
	
	/*-- 下拉加载更多商品 --*/
	loadMore(e) {
		if(this.data.isLoadAll) {
		}else{
			this.setData({
				page: this.data.page + 1
			})
			this.index()
		}
	},
	
	/*-- 加入购物车 --*/
	addShopcar(e) {
		if(this.data.cuser.userId) {
			let id = e.currentTarget.dataset['good'].id
			let good = this.data.goods.filter((item) => {
				return item.id == id
			})[0]
			good.count = 1
			this.setData({
				goods: this.data.goods
			})
			this.data.localShopcarGoods.push(good)
			this.handleShopcar()
		}else{
			wx.navigateTo({
				url: '/pages/user/login/step0'
			})
		}
	},
	
	handleShopcar(e) {
		this.setData({
			localShopcarGoods: this.data.localShopcarGoods
		})
		this.setShopcar()
		wx.setStorage({
			key: 'shopcar',
			data: this.data.localShopcarGoods,
			success(res) {
			}
		})
		this.calTotal()
	},
	
	onCartChange(e) {
		let count = e.detail.count == undefined ? e.detail : e.detail.count
		let id = e.currentTarget.dataset['good'] ? e.currentTarget.dataset['good'].id : e.detail.id
		if(count == 0) {
			let i = this.data.localShopcarGoods.indexOf(this.data.shopcarGoods.filter((item) => {
				return item.id == id
			})[0])
			this.data.localShopcarGoods.splice(i,1)
		}else{
			this.data.localShopcarGoods.filter((item) => {
				return item.id == id
			})[0].count = count
		}
		this.data.goods.filter((item) => {
			return item.id == id
		})[0].count = count
		this.setData({
			goods: this.data.goods
		})
		this.handleShopcar()
	},
	
	formatFloat(e) {
		let m = Math.pow(10, e.digit)
		return parseInt(e.f * m, 10) / m
	},
	
	/*-- 计算购物车总价 --*/
	calTotal(e) {
		let total = 0
		for(let item of this.data.shopcarGoods){
			total = this.formatFloat({f:item.count * item.sellingPrice + total, digit: 1})
		}
		this.setData({
			totalPrice: total
		})
	},
	
	/*-- 清空购物车 --*/
	onCartClear() {
		for(let item of this.data.goods) {
			item.count = 0
		}
		this.setData({
			goods: this.data.goods
		})
		this.data.localShopcarGoods = this.data.localShopcarGoods.filter((item) => {
			return item.shopId != this.data.shop.id
		})
		this.handleShopcar()
	},
	
	/*-- 召唤开店 --*/
	calling(e) {
		wx.request({
			url: `${app.globalData.url}/api/call/store`,
			method: 'post',
			data: {
				latitude: this.data.position.location.lat,
				longitude: this.data.position.location.lng,
				userId: this.data.cuser.userId
			},
			success(res) {
				Toast(res.data.message)
			}
		})
	}
})
