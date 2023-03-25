import request from '../../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTypeVal:'请选择门店属性',
    shopTypeArr:['连锁直营','连锁加盟','单体店'],
    shopLocationVal:'请选择门店位置',
    strategyVal:'请选择奖励策略',  
    strategyDataArr:['测试1','测试2','测试3'],
    startegyData:[],
    addStrategyId:0, //新增的策略id
    addStrategyName:'',//策略名称
    addShopType:'',//门店属性
    addShopShotName:'',//门店简称
    addShopName:'',//门店名称
    addPhone:'',//手机号码
    addDec:'',//备注信息
    addShopTypeName:'',//连锁店名称
    region: ['请选择', '门店', '位置'],
    customItem: '全部'
  },

  //门店名称
  getShopName(e){
    let val = e.detail.value;
    console.log("输入的门店名称",val)
    this.setData({
      addShopName: val
    })
  },
  getShopShotName(e){
    let val = e.detail.value;
    console.log("输入的门店简称称",val)
    this.setData({
      addShopShotName: val
    })
  },
  //连锁店名称
  getShopTypeName(e){
    let val = e.detail.value;
    this.setData({
      addShopTypeName: val
    })
  },
  
  getShopCode(e){
    let val = e.detail.value;
    this.setData({
      addShopCode: val
    })
  },
  //手机号
  getPhone(e){
    this.setData({
      addPhone: e.detail.value
    })
  },
  getDec(e){
    this.setData({
      addDec: e.detail.value
    })
  },
  bindRegionChange: function (e) {

    let regionArr = e.detail.value;
    console.log(e)
    let newArr = []
    regionArr.forEach((item)=>{
      if(item=="全部"){
        item = ""
      }
      newArr.push(item)
    })
    console.log(newArr)
    this.setData({
      region: newArr
    })
  },
  getStrategyList(){
    request({
      url:'/delegate/strategy/fuzzyselect',
      method:'post',
      data:{
        "recordCount": 0,
	      "startIndex": 0,
  	    "strategyName": ""
      }
    }).then((res)=>{
      if(res.data.message=="success"&&res.data.code==200){
        let data = res.data.data;
        let arr = [];
        data.forEach((item)=>{
          arr.push(item.strategyName);
        })
        this.setData({
          strategyData:data,
          strategyDataArr:arr
        })
  
      }
      
    }).catch((err)=>{
      console.log(err)
    })
  },
  //选择奖励策略
  bindPickerStrageyChange(e){
    let i = e.detail.value;
    let strategyObj = this.data.strategyDataArr[i];
    console.log(strategyObj)
      this.setData({
        strategyVal:strategyObj
      })
   
    let dataList = this.data.strategyData;
    let obj = dataList.find((item)=>{
      return item.strategyName == strategyObj 
    })
    let addStrategyId = obj.strategyId;
    console.log("obj",obj)
    this.setData({
      addStrategyId:addStrategyId,
      addStrageyName:strategyObj
    })
    console.log(this.data.addStrategyId,this.data.addStrageyName)
  },
  bindPickerShopTypeChange(e){
    let i = e.detail.value;
    let val = this.data.shopTypeArr[i];
    
    console.log(val)
      this.setData({
        shopTypeVal:val,
        addShopType:val
      })
  },
  submit(){
    let bId = wx.getStorageSync('loginMsg').userId;
    let bName = wx.getStorageSync('loginMsg').userName;
    let data = {
      "activeStatus": 1,
      "address": "",
      "anticodeShare": 0,
      "approvalId": 0,
      "approvalStatus": 1,
      "approvalUserId": 0,
      "approvalUserName": "",
      "businessManagerId": bId,
      "businessManagerName": bName,
      "chainShopName": this.data.addShopTypeName,
      "cityId": 0,
      "cityName": this.data.region[1],
      "createTime": "",
      "districtId": 0,
      "districtName": this.data.region[2],
      "excelIndex": 0,
      "initial": "",
      "lat": "",
      "lng": "",
      "phoneNumber": this.data.addPhone,
      "pinyin": "",
      "properties": this.data.shopTypeVal,
      "provinceId": 0,
      "provinceName": this.data.region[0],
      "remarks": this.data.addDec,
      "shopAbbreviation":this.data.addShopShotName,
      "shopCode": this.data.addShopCode,
      "shopId": 0,
      "shopName": this.data.addShopName,
      "strategyId": this.data.addStrategyId,
      "strategyName": this.data.addStrategyName,
      "updateTime": ""
    }

    request({
      url:'/delegate/shop/insertbyapp',
      method:'post',
      data: data
    }).then((res)=>{
      if(res.data.message=="success"&&res.data.code==200){
        wx.showToast({
          title: "新增成功",
          icon:'success'
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch((err)=>{
      console.log(err)
      wx.showToast({
        title: "服务出错",
        icon:'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //获取奖励策略列表
    this.getStrategyList()
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