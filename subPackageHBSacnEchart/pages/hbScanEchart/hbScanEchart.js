import {_getShopList,_getScanMoneyStatistics,_getScanGoodsbaseRadio} from '../../../utils/getData'
import * as echarts from '../../../ec-canvas/echarts.min.js'
import {initPieChartCommon } from '../../../utils/mychart.js'


Page({
  data: {
    dateData:{
      interval: 0,
      startT: "",
      endT:"",
      timeType: 1,
      echartFlg:true //所有图表默认显示
    },
    endT: "",
    hbList:[],
    saleList:[],
    searchData:[],
    allShopData:[],
    id: 0,
    selShopTxt:'全部门店',
    inpShopValue:'',
	  interval: 0,
	  startT: "",
    timeType: 1,
    showShop:false,
    chartFlg1:true,
    selectIdx:2,
    selIndex:1,//默认是红包金额显示
    echart2Show:false,
    shopSelectList: [],
    shopSelectId: 0,
    shopScanList: [],
    shopScanPrice: [],
    shopScanReward: [],
    ec2: {
      lazyLoad:true
    }
  },
    //饼图
    init_chart2:function(id,value){
      let Component = this.selectComponent(id) 
        Component.init((canvas,width,height,dpr)=> { 
          const chart= echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio:dpr
          });
          initPieChartCommon(chart,value)
        return chart;
      })
    },

getSearchList(e){
  let key = e.detail;
  console.log(key)
  if(key==""){
    this.setData({
      searchData:this.data.allShopData
    })
    return;
  }
  console.log(this.data.allShopData)
  let arr = this.data.allShopData.filter((item)=>{
    return item.shopName.indexOf(key)>-1;
  })
  this.setData({
    searchData:arr
  })
},
getSelectVal(e){
  let id = e.target.dataset.id;
  let val = this.data.searchData.find((item)=>{
    return item.shopId == id
  });
  this.setData({
    selShopTxt:val.shopName,
    shopSelectId:val.shopId,
    showShop:false,
    inpShopValue:'',
    searchData:this.data.allShopData
  })
},
closeShopList(){
  this.setData({
    showShop: false
  })
}, 
showPopup() {
  this.setData({ showShop: true });
},
//销售金额
getSaleNum(){
  this.setData({
    selIndex:2,
    chartData:this.data.saleList
  })
},
handleDateChange(e){
  this.setData({
    endT: e.detail.endT,
    interval: e.detail.interval,
    startT: e.detail.startT,
    echart2Show: e.detail.echartFlg,
    timeType: e.detail.timeType
  })
  if(e.detail.echartFlg){
    this.getScanRadioEchart()
  }
  this.getScanMoneyEchart()
},
//红包金额
getScanNum(){
  this.setData({
    selIndex:1,
    chartData:this.data.hbList
  })
},

//扫码金额统计
getScanMoneyEchart(){
  let data = {
    "endT": this.data.endT,
    "id": wx.getStorageSync('loginMsg').userId,
    "interval": this.data.interval,
    "startT": this.data.startT,
    "timeType": this.data.timeType
  }
  _getScanMoneyStatistics(data,(res)=>{
    let data = res
    if(data.length==0){
      this.setData({
        chartFlg1:false
      })
      return;
    }
    let maxMoneyNum = 0;
    let maxSaleNum = 0;
    data.forEach((item)=>{
      maxMoneyNum = maxMoneyNum>item.totalPrice?maxMoneyNum:item.totalPrice;
      maxSaleNum = maxSaleNum>item.totalReward?maxSaleNum:item.totalReward;
    })
    let sale= [];  //销售金额
    let hb = [];  //红包金额
      data.forEach((item)=>{
        let sobj = {
          shopName:item.shopName,
          num:item.totalPrice,
          numLen:(item.totalPrice/maxMoneyNum)*100+'%',
          color:"#61dfaf"
        }
        let hbobj = {
          shopName:item.shopName,
          num:item.totalReward,
          numLen:(item.totalReward/maxSaleNum)*100+'%',
          color:"#458ef2"
        }
        hb.push(hbobj);//红包金额
        sale.push(sobj); //销售金额
    })
    //当前选择的是红包金额还是销售金额 1 红包 2 销售
      this.setData({
      chartData:hb,  //默认显示红包
      hbList:hb,
      saleList:sale,
      chartFlg1:true
    })
  },()=>{
    this.setData({
      chartFlg1:false
    })
  })
  
},
//扫码商品占比
getScanRadioEchart(){
  let data = {
    "id": this.data.shopSelectId,
  }
  _getScanGoodsbaseRadio(data,(res)=>{
    let data = res;
    if(data.length==0){
      this.setData({
        echart2Show:false
      })
      return;
    }
    let pieList = []
    data = data.slice(0,5);
    data.forEach((item)=>{
      let obj = {
        value: item.scanCount,
        name: item.goodsbaseName
      }
      pieList.push(obj);
    })
    this.setData({
      pieList:pieList,
      echart2Show:true
    })
    this.init_chart2("#hbScan-echart2",this.data.pieList);
  },()=>{
    this.setData({
      echart2Show:false
    })
  })
 
},
getShopList(){
  _getShopList((res)=>{
    if(res.length==0){
      return;
    }
    let data = res;
    let firstAll = {
      shopId:0,
      shopName:'全部门店'
    }
    data.unshift(firstAll);
    this.setData({
      allShopData:data,
      searchData:data
    })
    this.getScanRadioEchart();
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
    this.getShopList();
    this.getScanMoneyEchart();
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