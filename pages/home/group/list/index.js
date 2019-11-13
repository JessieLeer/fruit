const app = getApp()

Page({
	data: {
		gid: '',
		order: {
			
		}
	},
	onLoad(option) {
		this.setData({
			gid: option.id
		})
		this.show()
	},
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/groupUser`,
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
	}
})