import Dialog from "../../../miniprogram_npm/vant-weapp/dialog/dialog"

//获取应用实例
const app = getApp()

Page({
	data: {
		histories: [],
		hots: [],
		cuser: {},
		goods: [],
		isLoadAll: false,
		isSearch: true,
		search: {
			value: '',
			page: 1
		}
	},
	onLoad() {
		this.initCuser()
		this.historyIndex()
		this.hotIndex()
	},
	onShow() {
		this.initCuser()
		this.historyIndex()
		this.hotIndex()
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
					url: 'http://192.168.1.103:8080/api/search/history',
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
			url: 'http://192.168.1.103:8080/api/search/hot',
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
				url: 'http://192.168.1.103:8080/api/search/history/del',
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
		if(e.currentTarget.dataset.search.type == '1'){
			this.setData({
				isSearch: false,
				'search.value': e.currentTarget.dataset.search.value,
				'search.page': 1,
				goods: []
			})
			this.index()
		}else{
			console.log('功能暂时没开放')
		}
	},
	
	/*-- 获取商品列表 --*/
	index(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/commodity/search',
			data: {
				pageNum: this.data.search.page,
				pageSize: 10,
				userId: this.data.cuser.userId,
				value: this.data.search.value
			},
			success(res) {
				_this.setData({
					goods: _this.data.goods.concat(res.data.data)
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
	
})