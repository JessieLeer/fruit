const app = getApp()
Page({
    data : {
        showkey : -1,
        selectedFlag : [],
        dataList : [],
			  minHeight : 0
    },
    clickMore(e){
        var index = e.currentTarget.dataset.index;
        if (this.data.selectedFlag[index]) {
            this.data.selectedFlag[index] = false;
        } else {
            this.data.selectedFlag[index] = true;
        }
        this.setData({
            selectedFlag: this.data.selectedFlag
        })
        
    },
	  getMinHeight(){
        let h ;
        let minHeight ;
        wx.getSystemInfo({
            success: function (res) {
                h = res.windowHeight
               
            }
        })
        minHeight = h - 152 - 41;
        this.setData({
            minHeight: minHeight
        })
    },
    onShow (){
        this.data.dataList.map((item,index)=>{
            this.data.selectedFlag[index] = false;
        })
			this.getMinHeight()
    }
})