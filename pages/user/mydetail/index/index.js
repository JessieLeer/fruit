import { moment } from '../../../../utils/cndealtime'
import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"
const app = getApp()
Page({
    data : {
        maxDate: new Date().getTime(),
        minDate: new Date('1900-01-01').getTime(),
        select: false,
        current: '',
        valuecurrent: new Date(1990,0,1).getTime(),
        avatar : '',
        Nickname : '',
        mobile : '' ,
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`;
            }
            return value;
        },
        level : ''
    },
    gotoHistory(){
        wx.navigateTo({
            url: "../history/index"

        })
    },
    chooseDate(){
			if(this.data.current == '1990-01-01'){
				this.setData({
          select : true
        })
			}else{
				Toast({
					message: '生日只能修改一次'
				})
			}
    },
    close(){
        this.setData({
            select: false
        })
    },
    confirm(e) {
        this.setData({
            select: false,
            current: moment(e.detail).format("YYYY-MM-DD"),
            valuecurrent: e.detail
        })
    },
    onShow(){
        this.getUserIndfo()
        this.setData({
            avatar: wx.getStorageSync('avatarUrl'),
            Nickname: wx.getStorageSync('Nickname'),
            mobile: wx.getStorageSync('mobile')
        })
    },
    save(){
        wx.request({
            url: `${app.globalData.url}/api/member/updateBirthday?loginUid=${wx.getStorageSync('loginUid')}&userId=${JSON.stringify(wx.getStorageSync('userId'))}&birthday=${this.data.current}`,
            method : 'POST',
            success(res) {
                wx.showToast({
                    title: res.data.message,
                    icon : 'success',
                    duration : 2000
                })
            }
        })
    },
    getUserIndfo(){
        var that = this;
        wx.request({
            url: `${app.globalData.url}/api/member/getUserInfo`,
            data: {
                loginUid: wx.getStorageSync('loginUid'),
                userId: wx.getStorageSync('userId')
            },
            success(res) {
                that.setData({
                  level: res.data.data.levelName,
                  current : res.data.data.birthday,
									username: res.data.data.username,
                    valuecurrent: res.data.data.birthday ? new Date(res.data.data.birthday).getTime() : new Date(1990, 0, 1).getTime(),
									mobile: res.data.data.mobile
                })
            }
        })
    }
})