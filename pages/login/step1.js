Page({
	data: {
		phone: {
			value: '',
			message: '请输入正确格式的手机号',
			verify: false
		},
		countdown: 0,
		sms: '111111'
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
      'phone.message': message,
			'phone.verify': verify
    })
	}
})