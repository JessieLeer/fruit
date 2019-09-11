Page({
	data: {
		phone: {
			value: '',
			message: '请输入正确格式的手机号',
			verify: false
		},
		countdown: 0,
		sms: {
			value: '',
			verify: false
		},
	},
	
	onLoad(option) {
	},
	
	/*-- 监听手机号发生改变时验证手机格式 --*/
	phoneChange(event) {
    const phone = event.detail || event
    let message = ''
		let verify = false
    if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone)) {
      message = ''
			verify = true
    } else {
      message = '请输入正确格式的手机号'
			verify = false
    }
    this.setData({
			'phone.value': phone,
      'phone.message': message,
			'phone.verify': verify
    })
	},
	
	/*-- 发送手机验证码 --*/
	sendSms(e) {
		this.setData({
			countdown: 60
		})
		wx.request({
			url: '',
			data: {
				phone: this.data.phone.value
			},
			success(res) {
				console.log(res)
				if(res.data.retcode == '1'){
					let count = setInterval(() => {
						if(this.countdown > 0){
							this.countdown--
						}else{
							clearInterval(count)
						}
					},1000)
				}else{
					this.setData({
						countdown: 60
					})
				}
			}
		})
	},
	
	/*-- 监听验证码改变 --*/
	smsChange(e) {
		this.setData({
			'sms.verify': e.detail.length == 6
		})
	}
})