import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		gid: '',
		order: {},
		cuser: {}
	},
	onLoad(option) {
		this.setData({
			gid: option.id
		})
		this.initCuser()
		this.show()
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
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/groupUser`,
			data: {
				gid: this.data.gid
			},
			success(res) {
				let leftCount = Math.ceil((new Date(res.data.data.gendTime) - new Date()) / 86400000)
				if(leftCount > 0) {
					res.data.data.leftCount = leftCount
				}else{
					res.data.data.left = _this.calTime({start: new Date().getTime(), end: new Date(res.data.data.gendTime + ' 24:00:00').getTime()})
				}
				_this.setData({
					order: res.data.data
				})
				app.globalData.groupbuy = _this.data.order
				if(leftCount == 0) {
					setInterval(() => {
						_this.setData({
							'order.left': _this.calTime({start: new Date().getTime(), end: new Date(_this.data.order.gendTime + ' 24:00:00').getTime()})
						})
					}, 1000)
				}
			}
		})
	},
	calTime(e) {
		//时间差的毫秒数      
		let leftDay = e.end - e.start
		let days = Math.floor(leftDay/(24*3600*1000))
		let leave1 = leftDay%(24*3600*1000)    
		let hours = Math.floor(leave1/(3600*1000))
		let leave2 = leave1%(3600*1000)        
		let minutes = Math.floor(leave2/(60*1000))
		let leave3 = leave2%(60*1000)      
		let seconds = Math.round(leave3/1000)
		return {
			hour: hours,
			minute: minutes,
			second: seconds
		}			
	},
	/*-- 加入拼图 --*/
	join(e) {
		let item = e.currentTarget.dataset.item
		wx.request({
			url: `${app.globalData.url}/api/group/groupAdd`,
			data: {
				carts: JSON.stringify([
					{
						commodityId: item.sid,
						number: 1,
						name: item.shopName,
						sellingPrice: item.gprice,
					  originalPrice: item.originalPrice,
						headImage: item.shopImg
					}
				]),
			  postType: 1,
				storeId: item.storeId,
				userId: this.data.cuser.userId,
				groupId: item.gid
			},
			method: 'post',
			success(res) {
				console.log(res)
				if(res.data.code == 200) {
					
				}else{
					Toast({
						message: res.data.message
					})
				}
			}
		})
	}
})