import request from '../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanFunctionIsUseAble:true,
    sinputList:[],
    pageType:'' // code 表示从扫码页面过来的  sreturn 表示从退货页面过来的
  },

  getInp(){
    let index = e.target.dataset.id;
    let arr = this.data.sinputList;
    //替换原来的值
    arr.splice(index,1,e.detail.value)
    this.setData({
      sinputList:arr
    })
  },
  playMusic() {
    const innerAudioContext = wx.createInnerAudioContext()
    if (wx.setInnerAudioOption) {
      wx.setInnerAudioOption({
        obeyMuteSwitch: false,
        autoplay: true
      })
    }else {
      innerAudioContext.obeyMuteSwitch = false;
      innerAudioContext.autoplay = true;
    }
    innerAudioContext.src = 'assets/9360.wav' /**你要播放的音频文件的地址 可以放在线的也可以放本地的，本地的需要用绝对地址 */
    innerAudioContext.play()
    // innerAudioContext.onPlay(() => {
    //   /**开始播放是触发 */
    //   console.log('Start playback')
    // })
    innerAudioContext.onError((res) => {
      /**播放是有错误时触发 */
      console.log("播放error",res.errMsg)
      console.log("播放error",res.errCode)
    })
  },

  takeCode(e) {
    this.playMusic();
    const { result } = e.detail 
    let arr = this.data.sinputList;
    
    let obj = arr.find((item)=>{
      return item == result;
    })
    if(obj){
      wx.showToast({
        icon: 'none',
        title: "请勿重复扫码！",
        duration: 1000
      })
      return;
    }
    //判断是否是12位且没有扫描出网址的情况
    if(result.indexOf(".")>-1)return
    
    //判断是否是69开头
    if(result.indexOf("69")==0){
      wx.showToast({
        icon: 'none',
        title: "扫错了，请扫防窜码",
        duration: 1000
      })
      return;
    }
    if(result.length!=12)return
    // if (this.data.scanFunctionIsUseAble){
      //上传反窜码 连扫
      if(this.data.pageType=='code'){
        request({
          url: '/delegate/anticodeUpload/checkExist',
          method:'post',
          data:{
            anticode:result
          }
        }).then((res)=>{
          if(res.data.code==200&&res.data.message=="success"){
            if(res.data.data.zpcount==0){
              arr.push(result)
              this.setData({
                // scanFunctionIsUseAble: false,
                sinputList:arr,
              })
            }else{
              wx.showToast({
                icon: 'none',
                title: "系统已存在",
                duration: 1000
              })
            }
       
          }else{
            wx.showToast({
              icon: 'none',
              title: res.data.message,
              duration: 1000
            })
        
          }  
        }).catch((err)=>{
          wx.showToast({
            icon: 'none',
            title: err,
            duration: 1000
          })
        })
      }else{
        arr.push(result)
        this.setData({
          // scanFunctionIsUseAble: false,
          sinputList:arr,
        })
      }
     
      // setTimeout(()=>{
        // wx.showToast({ title: `扫描结果：${result}`, icon: 'none',duration:1000 })
        // this.setData({
        //   scanFunctionIsUseAble:true
        // })
      // },100)
      //每隔两秒可以扫一次
    // }
  },
  
  delCode(e){
    let indexId = e.target.dataset.id;
    let arr = this.data.sinputList;
        arr.splice(indexId,1);
          this.setData({
            sinputList: arr
        })
  },
  error(e) {
    console.log(e, '出错了');
  },
  //提交扫码的值
  submit(){
    let data = this.data.sinputList
    let pages = getCurrentPages();
    console.log("sss",data)
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      inputList:data
    })
    wx.navigateBack({ delta: 1, })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
      let newArr = JSON.parse(options.arr)
      this.setData({
        sinputList:newArr,
        pageType:options.page
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})