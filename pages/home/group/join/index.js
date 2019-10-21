const app = getApp()

Page({
	data: {
		id: '',
		order: {}
	},
	onLoad(option) {
		this.setData({
			id: option.id
		})
		this.show()
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/groupUserShare`,
			data: {
				gid: this.data.id
			},
			success(res) {
				for(let i = 0; i < parseFloat(res.data.data.guserNumber); i++) {
					if(res.data.data.userImgList[i]) {
						
					}else{
						res.data.data.userImgList[i] = {
							userImg: "add-o",
							userName: ""
						}
					}
				}
				res.data.data.need = res.data.data.userImgList.filter((item) => {
					return item.userImg == 'add-o'
				}).length
				res.data.data.gendTime = res.data.data.gendTime.replace(/-/g, '/')
				let leftCount = Math.ceil((new Date(res.data.data.gendTime) - new Date()) / 86400000)
				if(leftCount > 0) {
					res.data.data.leftCount = leftCount
				}else{
					res.data.data.left = _this.calTime({start: new Date().getTime(), end: new Date(_this.addDate(_this.data.order.gendTime,1)).getTime()})
				}
				_this.setData({
					order: res.data.data
				})
				app.globalData.groupbuy = _this.data.order
				if(leftCount == 0) {
					setInterval(() => {
						_this.setData({
							'order.left': _this.calTime({start: new Date().getTime(), end: new Date(_this.addDate(_this.data.order.gendTime,1)).getTime()})
						})
					}, 1000)
				}
			}
		})
	},
	addDate(date,days){ 
    let d = new Date(date) 
    d.setDate(d.getDate()+days) 
    let m = d.getMonth() + 1 
    return d.getFullYear()+'/'+m+'/' + d.getDate() 
  }, 
	calTime(e) {
		//时间差的毫秒数      
		let leftDay = e.end - e.start
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
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	}
})