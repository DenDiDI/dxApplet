import request from '../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTypeVal:'请选择门店',
    shopTypeArr:['连锁直营','连锁加盟','单体店'],
    shopArr:[],
    shopV:'请选择门店',
    shopDetail:null,
    shopAllData:[],
    // bbarCode:'',  //条行码
    // goodsArr: [],  //商品列表
    // goodsAllData:[], //所有商品数据
    // goodsV:'请选择商品名称',
    // goodsDetail:null,
    // goodsMsg:{}, //选择的单个商品数据
    inputList:[],  //防窜码列表
    s_result:"",
    s_result_show:false,
    loadingFlg:false,
    inpLen:0
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
      url: '/subPackageCamera/pages/scanCamera/scanCamera?arr='+ar+'&page=code',
    })
  },
 
  //扫码条
  getBbarcode(e){
    let that = this;
    wx.scanCode({ //扫描API
      success(res) { //扫描成功
        that.setData({
          bbarCode:res.result
        })
        // that.getGoodsByBarCode()
      },
      fail(err){
        wx.showToast({
          title: '扫码失败！',
          icon:'error',
          duration: 1000
        })
      }
    })
  },
  addScanShop(){
    let arr = this.data.inputList;
    arr.push("");
    this.setData({
      inputList:arr
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
    // if(this.data.bbarCode==""){
    //   wx.showToast({
    //     title: '请先输入条形码',
    //     icon:'none'
    //   })
    //   return;
    // }
    // if(!this.data.goodsDetail){
    //   wx.showToast({
    //     title: '请先选择商品名称',
    //     icon:'none'
    //   })
    //   return;
    // }
    let dataArr = this.data.inputList;
    let id = wx.getStorageSync('loginMsg').userId;
    // let uname = wx.getStorageSync('loginMsg').userName;
    let shopDetail = this.data.shopDetail;
    // let goodsDetail = this.data.goodsDetail;
    // console.log(shopDetail,goodsDetail)
    // let flg = this.checkIsEmpty();
    // if(!flg)return;
      
      this.setData({
        loadingFlg:true,
      })
    request({
      url: '/delegate/anticodeUpload/upload',
      method:'post',
      data:{
        anticodes:dataArr,
        shopId:shopDetail.shopId,
        userId:id
      }
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
        //提交成功之后清空页面
        this.setData({
          inputList: arr,//防窜码
          shopV:'请选择门店',
          // bbarCode:'',
          inpLen:0,
          shopDetail:null,
          // goodsDetail:null,
          // goodsV:'请选择商品名称'
        })
        return;
      }else{
        wx.showToast({
          icon: 'error',
          title: '提交失败！',
          duration: 1000
        })
      //  this.setData({
      //   s_result_show:true,
      //   s_result:res.data.data
      // })
      // console.log(res.data.data)
      // setTimeout(()=>{
      //   this.setData({
      //     s_result_show:false,
      //     s_result:""
      //   })
      // },3000)
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
    this.setData({
      inpLen:this.data.inputList.length
    })
    console.log(this.data.inputList)
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