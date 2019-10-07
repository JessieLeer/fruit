import Dialog from "../../../miniprogram_npm/vant-weapp/dialog/dialog"

//获取应用实例
const app = getApp()

Page({
	data: {
		shopId: '',
		histories: [],
		hots: [],
		cuser: {},
		goods: [],
		isLoadAll: false,
		isSearch: true,
		search: {
			value: '',
			page: 1
		},
		noGoodShow: false,
		localShopcarGoods: [],
		shopcarGoods: [],
		totalPrice: 0
	},
	onLoad(option) {
		this.setData({
			shopId: option.id
		})
		this.initCuser()
		this.historyIndex()
		this.hotIndex()
		this.initShopcar()
	},
	onShow() {
		this.initCuser()
		this.historyIndex()
		this.hotIndex()
		this.initShopcar()
	},
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
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
				_this.setShopcar()
				_this.calTotal()
			}
		})
	},
	setShopcar(e) {
		this.setData({
			shopcarGoods: this.data.localShopcarGoods.filter((item) => {
				return item.shopId == this.data.shopId
			})
		})
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
			}
		})
	},
	/*-- 获取历史搜索 --*/
	historyIndex(e) {
		setTimeout(() => {
			if(this.data.cuser.userId) {
			  let _this = this
				wx.request({
					url: `${app.globalData.url}/api/search/history`,
					data: {
						userId: this.data.cuser.userId
					},
					success(res) {
						_this.setData({
							histories: res.data.data
						})
					}
				})
		  }
		},1000)
	},
	/*-- 获取热门搜索 --*/
	hotIndex(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/search/hot`,
			success(res) {
				_this.setData({
					hots: res.data.data
				})
			}
		})
	},
	
	/*-- 清空历史搜索 --*/
	clearHistory(e) {
		Dialog.confirm({
			message: '确认清空历史搜索？'
		}).then(() => {
			let _this = this
			wx.request({
				url: `${app.globalData.url}/api/search/history/del`,
				data: {
					userId: this.data.cuser.userId
				},
				success(res) {
					_this.historyIndex()
				}
			})
		}).catch(() => {
			// on cancel
		})
	},
	
	/*-- 点击标签进行搜索或者跳转 --*/
	handleTagClick(e) {
		this.setData({
			isSearch: false,
			'search.value': e.currentTarget.dataset.search.value,
			'search.page': 1,
			goods: []
		})
		this.index()
	},
	
	/*-- 获取商品列表 --*/
	index(e) {
		wx.showLoading({
      title: '加载中',
    })
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/commodity/search`,
			data: {
				pageNum: this.data.search.page,
				pageSize: 10,
				storeId: this.data.shopId,
				userId: this.data.cuser.userId ? this.data.cuser.userId : '',
				value: this.data.search.value
			},
			success(res) {				
				for(let item of res.data.data) {
					let incart = _this.data.shopcarGoods.filter((itemer) => {
						return itemer.id == item.id
					})[0]
					if(incart) {
						item.count = incart.count
					}else{
						item.count = 0
					}
					item.shopId = _this.data.shopId
				}
				wx.hideLoading()
				_this.setData({
					goods: _this.data.goods.concat(res.data.data)
				})
				_this.setData({
					noGoodShow: _this.data.goods.length == 0
				})
			}
		})
	},
	
	onFocus(e) {
		this.setData({
			isSearch: true,
		})
	},
	onChange(e) {
		this.setData({
			'search.value': e.detail
		})
	},
 	onSearch(e) {
		this.setData({
			isSearch: false,
			goods: [],
			'search.page': 1
		})
		this.index()
	},
	
	/*-- 上拉刷新 --*/
	refresh(e) {
		this.setData({
			goods: [],
			'search.page': 1
		})
		this.index()
	},
	
	/*-- 下拉加载更多商品 --*/
	loadMore(e) {
		if(this.data.isLoadAll) {
		}else{
			this.setData({
				'search.page': this.data.search.page + 1
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
	
	/*-- 计算购物车总价 --*/
	calTotal(e) {
		let total = 0
		for(let item of this.data.shopcarGoods){
			total += item.count * item.sellingPrice
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
			return item.shopId != this.data.shopId
		})
		this.handleShopcar()
	}
})