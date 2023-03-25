import request from '../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopV:'请选择门店',
    shopDetail:null,
    inputList:[],
    s_result_show:false,
    s_result:[],
    s_result_suc:'3',
    s_result_fail:'2',
    loadingFlg:false,
  },
 //获取代理商下面的所有门店
 bindPickerShopTypeChange(){
  let id = wx.getStorageSync('dCode')
  wx.navigateTo({
    url: '/subPackageSelectPageBlack/pages/selectPageBlack/selectPageBlack?url='+'/manufacture/applets/shopList'+'&arg='+id+'&argName=shop',
  })
},
 //扫码防窜
 scanShop(e){
   let ar = JSON.stringify(this.data.inputList)
  wx.navigateTo({
    url: '/subPackageCamera/pages/scanCamera/scanCamera?arr='+ar+'&page=sreturn',
  })
},
submit(){
  if(!this.data.shopDetail){
    wx.showToast({
      title: '请先选择门店',
      icon:'none'
    })
    return;
  }
  let dataArr = this.data.inputList;
  let shopDetail = this.data.shopDetail;
  console.log(shopDetail.shopId)
    this.setData({
      loadingFlg:true,
    })
  let data = {
    "antiCodes": dataArr,
	  "shopId": shopDetail.shopId
  }
  request({
    url: '/delegate/goods/returnGoods',
    method:'post',
    data:data
  }).then((res)=>{
    this.setData({
      loadingFlg:false,
    })
    console.log(res);
    if(res.data.code==200&&res.data.message=="success"){
      wx.showToast({
        icon: 'success',
        title: '提交成功！',
        duration: 1000
      })
      let arr = [];
      this.setData({
        inputList:arr,
        s_result_show:true,
        s_result_suc:res.data.data.succCount,
        s_result_fail:res.data.data.failCount,
        s_result:res.data.data.errstrList
      })
   
      setTimeout(()=>{
        this.setData({
          s_result_suc:'',
          s_result_fail:'',
          s_result_show:false,
          s_result:[]
        })
      },3000)
 
    }else{
      wx.showToast({
        icon: 'none',
        title: res.data.message,
        duration: 1000
      })
  
    }  
  }).catch((err)=>{
    console.log(err)
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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