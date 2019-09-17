import Toast from '../../../../miniprogram_npm/vant-weapp/toast/toast'

Page({
	data: {
		cuser: {},
		evaluate: {
			orderId: '',
			storeId: '',
			rate: 0,
			content: '',
			images: []
		}
	},
	onLoad(option) {
		this.setData({
			'evaluate.orderId': option.id,
			'evaluate.storeId': option.storeId
		})
		this.initCuser()
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
	onChange(event) {
    this.setData({
      'evaluate.rate': event.detail
    })
  },
	handleContent(e) {
		this.setData({
			'evaluate.content': e.detail
		})
	},
	/*-- 选择图片 --*/
	chooseImage(e) {
    wx.chooseImage({
			//可选择原图或压缩后的图片
      sizeType: ['original', 'compressed'],
			//可选择性开放访问相册、相机
      sourceType: ['album', 'camera'], 
      success: res => {
				if(this.data.evaluate.images.concat(res.tempFilePaths).length > 6) {
					Toast('图片最多只能上传六张')
				}else{
					for(let item of res.tempFilePaths){
						this.uploadImage({filePath: item})
					}
				}
      }
    })
  },
	/*-- 上传图片 --*/
	uploadImage(e) {
		let _this = this
		wx.uploadFile({
			url: 'http://192.168.1.103:8080/api/imgUpload',
			filePath: e.filePath,
			name: 'files',
			header: {
        "Content-Type": "multipart/form-data"
      },
			success(res) {
				res.data = JSON.parse(res.data)
				if(res.data.code == 200) {
					_this.data.evaluate.images.push(res.data.data)
					_this.setData({
						'evaluate.images': _this.data.evaluate.images
				  })
					console.log(_this.data.evaluate.images)
				}else{
					Toast('上传失败，请稍后再试')
				}
			}
		})
	},
	/*-- 删除图片 --*/
	del(e) {
		this.data.evaluate.images.splice(e.currentTarget.dataset.index,1)
		this.setData({
			'evaluate.images': this.data.evaluate.images
		})
	},
	/*-- 提交评价 --*/
	submit(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/evaluate/add',
			data: {
				content: this.data.evaluate.content,
				images: this.data.evaluate.images.toString(),
				orderId: this.data.evaluate.orderId,
				storeId: this.data.evaluate.storeId,
				userId: this.data.cuser.userId,
				star: this.data.evaluate.rate
			},
			method: 'post',
			success(res) {
				console.log(res)
				if(res.data.code == 200) {
					wx.redirectTo({
						url: '/pages/home/order/evaluate/success'
					})
				}
			}
		})
	}
})