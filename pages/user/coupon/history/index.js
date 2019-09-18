const app = getApp()
Page({
    data : {
        showkey : -1,
        selectedFlag : [],
        dataList : []
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
    onShow (){
        this.data.dataList.map((item,index)=>{
            this.data.selectedFlag[index] = false;
        })
    }
})