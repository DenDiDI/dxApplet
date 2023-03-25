App({
  onLaunch(){
    let that = this;
    console.log('onLaunch执行');
    // wx.login({
    //   success (res){
    //     if (res.code) {
    //       wx.setStorageSync('code', res.code)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
   
  },
  globalData:{
    billIds:[],
    log:''
  }
})

