import {
  _getShopList,  //获取门店列表
  _getGoodsListByShopName, //根据门店名称获取商品列表
  _getShopAndGoodsByUserId,  //根据业务员id获取门店和商品动销
  _getGoodsUseStatusByGoodsname
} from '../../../utils/getData'
import * as echarts from '../../../ec-canvas/echarts.min.js'
import {initTwoLineChart} from '../../../utils/mychart.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartIndex:1,
    chartFlg1:true,
    allShopData:[],
    searchShopData:[],
    allGoodsData:[],
    searchGoodsData:[],
    selShopTxt:'全部门店',
    selGoodsTxt:'全部商品',
    inpGoodsValue:'',
    inpShopValue:'',
    selectIdx:2,
    endT: "",
    dateData:{
      interval: 0,
      startT: "",
      endT:"",
      timeType: 1,
      echartFlg:true //所有图表默认显示
    },
	  id: 0,
	  interval: 0,
	  startT: "",
    timeType: 1,
    chartData:[],
    shopSelectList:[], //门店的数据列表
    shopSeletId:0,  //选择的门店
    goodsSelectList: [], //商品的数据列表
    goodsSeletId: 0, //选择的商品
    minDate: new Date(2021, 11, 31).getTime(),
    maxDate: new Date().getTime(),
    showShop:false,
    showGoods:false,
    echart3Show: true,
    echart3list: [],
    goodsUseList: [],
    goodsUnUseList: [],
    ec3: {
      lazyLoad:true
    }
  },

  init_chart3:function(id,list,value1,value2){
    let Component = this.selectComponent(id); 
    console.log(Component)
      Component.init((canvas,width,height,dpr)=> { 
        const chart= echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio:dpr
      });
      initTwoLineChart(chart,list,value1,value2)
        return chart;
      })
},
showShopPopup() {
  this.setData({ showShop: true,echart3Show:false});
},
//显示门店或者商品筛选面板
showGoodsPopup() {
  this.setData({ showGoods: true,echart3Show:false });
},
//日期筛选
handleDateChange(e){
  this.setData({
    endT: e.detail.endT,
    interval: e.detail.interval,
    startT: e.detail.startT,
    echart3Show: e.detail.echartFlg,
    timeType: e.detail.timeType
  })
  if(e.detail.echartFlg){
    this.getGoodsDxEchart()
  }
  this.getShopAndGoodsData();
},
//门店筛选
getSearchShopList(e){
  let key = e.detail;
  if(key==""){
    this.setData({
      searchShopData:this.data.allShopData
    })
    return;
  }
  let arr = this.data.allShopData.filter((item)=>{
    return item.shopName.indexOf(key)>-1;
  })
  this.setData({
    searchShopData:arr
  })
},
//商品筛选
getSearchGoodsList(e){
  let key = e.detail;
  if(key==""){
    this.setData({
      searchGoodsData:this.data.allGoodsData
    })
    return;
  }
  let arr = this.data.allGoodsData.filter((item)=>{
    return item.goodsbaseName.indexOf(key)>-1;
  })
  this.setData({
    searchGoodsData:arr
  })
},
//选择的门店
getSelectShopVal(e){
  let id = e.target.dataset.id;
  let val = this.data.searchShopData.find((item)=>{
    return item.shopId == id
  });

  this.setData({
    selShopTxt:val.shopName,
    showShop:false,
    echart3Show:true,
    searchShopData:this.data.allShopData
  })
  //根据门店获取该门店下面的所有商品
  this.getGoodsList()
},
//商品动销趋势选择的商品
getSelectGoodsVal(e){
  console.log(e)
  let goodsName = e.target.dataset.name;
  this.setData({
    selGoodsTxt:goodsName,
    showGoods:false,
    echart3Show:true,
    searchGoodsData:this.data.allGoodsData
  })
  this.getGoodsDxEchart()
},

  getShopAndGoodsData(){
    let data = {
      "endT": this.data.endT,
	    "id": wx.getStorageSync('loginMsg').userId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getShopAndGoodsByUserId(data,(res)=>{
    let data = res;
    let goodsArr = data.goodsBaseSaleCounts;
    let shopArr = data.shopSalesCounts;
    if(this.data.chartIndex==1){
      if(shopArr.length==0){
        this.setData({
          chartFlg1:false
        })
      }else{
        let maxNum = 0;
        shopArr.forEach((item)=>{
          maxNum = maxNum>item.salescount?maxNum:item.salescount
        })
        let n = []
       shopArr.forEach((item)=>{
         let obj = {
           name: item.shopName,
           num: item.salescount/maxNum*100+'%',
           dataNum:item.salescount
         }
         n.push(obj)
       })
       console.log(n)
        this.setData({
          chartData:n,
          chartFlg1:true,
        })  
      }
    }else{
      if(goodsArr.length==0){
        this.setData({
          chartFlg1:false
        })
      }else{
        let maxNum = 0;
        goodsArr.forEach((item)=>{
          maxNum = maxNum>item.zpcount?maxNum:item.zpcount
        })
        let n = []
        goodsArr.forEach((item)=>{
          let obj = {
            name: item.goodsbaseName,
            num: item.zpcount/maxNum*100+'%',
            dataNum:item.zpcount
          }
          n.push(obj)
        })
        this.setData({
          chartData:n,
          chartFlg1:true,
        })       
      }
    }
    })
  },
  //门店商品动销数据统计柱状图切换选择门店
  getChartSelShop(){
    this.setData({
      chartIndex:1
    })
    this.getShopAndGoodsData()
  },
  //门店商品动销数据统计柱状图切换选择商品
  getChartSelGood(){
    this.setData({
      chartIndex:2
    })
    this.getShopAndGoodsData()
  },
  //获取门店数据
  getShopList(){
    _getShopList((res)=>{
      if(res.length==0)return;
      let data = res;
      let firstAll = {
        shopId:0,
        shopName:'全部门店'
      }
      data.unshift(firstAll);
      this.setData({
        allShopData:data,
        searchShopData:data,
      })
      this.getGoodsList()
    })
  },
  //获取门店下面的商品
  getGoodsList(){
    let shopName = this.data.selShopTxt == "全部门店"?"":this.data.selShopTxt;
    let data = {
      "name": shopName
    }
    _getGoodsListByShopName(data,(res)=>{
      let arr = [];
      res.forEach((item)=>{
        let obj = {
          goodsBaseName: item.goodsBaseName,
          goodsBaseId:item.goodsBaseId
        }
        arr.push(obj)
      })
      let fobj = {
        goodsBaseName: "全部商品",
        goodsBaseId:0
      }
      arr.unshift(fobj)

      this.setData({
        allGoodsData:arr,
        searchGoodsData:arr
      })
      
      //调用商品动销趋势图方法
      this.getGoodsDxEchart();
    })
  },
  //根据商品名称获取数据
  getGoodsDxEchart(){
    let goodsName = this.data.selGoodsTxt=="全部商品"?"":this.data.selGoodsTxt
    let data = {
      "name": goodsName
    }
    _getGoodsUseStatusByGoodsname(data,(res)=>{
      if(res.length==0){
        this.setData({
          echart3Show:false
        })
        return;
      }
      let goodsX = [];
      let goodsUseList = [];
      let goodsUnUseList = [];
      res.forEach((item)=>{
        goodsX.push(item.mouth);
        goodsUseList.push(item.useCount);
        goodsUnUseList.push(item.unuseCount);
      })
      this.setData({
        echart3list: goodsX,
        goodsUseList: goodsUseList,
        goodsUnUseList: goodsUnUseList
      })
      this.init_chart3("#dx-echart3",this.data.echart3list,this.data.goodsUseList,this.data.goodsUnUseList);
    })
  },
  getDateSelect(){
    this.setData({
      show:true
    })
  },

  closeShop(){
    this.setData({
      showShop:false,
      echart3Show:true
    })
    this.getGoodsDxEchart()
  },
  closeGoods(){
    this.setData({
      showGoods:false,
      echart3Show:true
    })
    this.getGoodsDxEchart()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
  
   //门店和商品动销率
  //  this.getShopAndGoodsData();
   //获取指定业务员的门店
   this.getShopList();

 
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
    this.getShopAndGoodsData();
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