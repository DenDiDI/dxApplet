//页面功能说明，1、根据业务员id获取到门店数据 2、切换门店获取门店商品扫码统计、商品扫码数量统计、商品销售趋势图和排行版
import {
  _getShopList,
  _getScanCodeOrSaleNumByShopId,
  _getGoodsScanNumByShopId, //根据门店id获取商品扫码数量统计（qianwu)
  _getGoodsTop10,
  _getGoodsListByShopName,
  _getShopGoodsSaleTrend
} from '../../../utils/getData'
import {initPieChartCommon,initLineChartCommon, initTwoLineChart} from '../../../utils/mychart.js'
import * as echarts from '../../../ec-canvas/echarts.min.js'




Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateData:{
      interval: 0,
      startT: "",
      endT:"",
      timeType: 1,
      echartFlg:true //所有图表默认显示
    },
    selShopEchart:'',//选择那个图表的门店标识
    endT: "",
	  id: 0,
    interval: 0,
    allShopData:[],
    searchShopData:[],
    allGoodsData:[],
    searchGoodsData:[],
    selShopTxt1:'全部门店', //第一个图表选择的门店
    selShopId1:0,//第一个图表选择门店的id
    selShopTxt2:'全部门店', //第二个图表选择的门店
    selShopId2:0,//第二个门店的id
    selShopTxt3:'全部门店', //第三个图表选择的门店
    selGoodsTxt3:'全部商品',//第三个图表选择的商品
    selGoodsId:0,//第三个图表选择的商品id
    selShopId3:0,//第二个门店的id
    selShopTxt4:'全部门店',  //第四个图表选择的门店
    selShopId4:0,
    selMonthTxt:'全部',
    chartFlg1:true,
    chartData:[],
    monthIdx:0,
    monthList:['全部','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
	  startT: "",
    timeType: 1,
    minDate: new Date(2021, 11, 31).getTime(),
    maxDate: new Date().getTime(),
    show:false,
    showShop:false,
    showGoods:false,
    // shopSelectList:[],
    // goodsSelectList:[],
    inpShopValue:'',
    inpGoodsValue:'',

    // shopSelectId:0,//门店商品扫码统计的选择门店的id
    // shopSelectId2:0,//商品销量趋势图的选择门店的id
    // echart1Show:true,
    chartFlg2:true,
    echart3Show:true,
    echart4Show:true,
    // goodsSelectList: [], //趋势图的商品选择列表
    goodsSelectId:0,  //商品趋势图的商品选择id
    pieList:[],//饼图数据
    ec1: {
      lazyLoad:true
    },
    ec2: {
      lazyLoad:true
    },
    ec3: {
      lazyLoad:true
    },
    goodsTop10Data:[],
    showMonth:false,
    selectIdx:2,  //默认选择今天的数据
    spSalesValueList:[20,10,2],// 销售额数据 测试
    spScanCountList:[10,20,30],// 扫码数量 测试
    spEchart1X:["维生素c","蛋白粉",'测试'],//门店商品扫码统计X轴 测试
    shopGoodsScanList: [],
    shopGoodsScanCount: [],
    shopGoodsSalesValue:[],
    spEchart3X:['6','7','8','9','10','11'],//趋势图测试数据
    spEchart3Y:[10,20,13,15,8,10],  //趋势图测试数据
    spEchart3List: [],
    spEchart3Value: [],
    testPieList:[
      { value: 108, name: '测试商品说封就封'},
      { value: 735, name: '测试2装有很长测试商品说'},
      { value: 580, name: '测试商品3装有测试'},
      { value: 484, name: '测试商品4装有很测试商'},
      { value: 300, name: '测试商品5装有会更好'}],
  },

  //饼图
  init_chart2:function(id,value){
    let Component = this.selectComponent(id) 
    Component.init((canvas,w,h,dpr)=> { 
      const chart= echarts.init(canvas, null, {
        width: w,
        height: h,
        devicePixelRatio:dpr
      });
    initPieChartCommon(chart,value)
    return chart;
  })
  },
  //折线图
  init_chart3:function(id,list,value){
    let Component = this.selectComponent(id) 
      Component.init((canvas,width,height,dpr)=> { 
        const chart= echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio:dpr
      });
      initLineChartCommon(chart,list,value)
      return chart;
    })
  },
  handleDateChange(e){
    this.setData({
      endT: e.detail.endT,
      interval: e.detail.interval,
      startT: e.detail.startT,
      chartFlg2: e.detail.echartFlg,
      echart3Show: e.detail.echartFlg,
      timeType: e.detail.timeType
    })
    if(e.detail.echartFlg){
      this.getGoodsEchart2();
      this.getGoodsEchart3();
    }
    this.getEchart1_scanNum()
  },
  showPopup(e) {
    let shopChart = e.currentTarget.dataset.chart;
    this.setData({ 
      showShop: true,
      selShopEchart:shopChart,
      chartFlg2: false,
      echart3Show: false
      });
  },
  showGoodsPopup(e){
    this.setData({ 
      showGoods: true,
      chartFlg2: false,
      echart3Show: false
     });
  },
  showMonthPopup(e){
    let flg = this.data.showMonth
    this.setData({
      showMonth:!flg
    })
  },
  selMonthVal(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      showMonth:false,
      monthIdx:index,
      selMonthTxt:this.data.monthList[index]
    })
    this.getShopTop10Data();
  },
  getShopTop10Data(){
    let data = {
      "month": this.data.monthIdx,
    	"shopId": this.data.selShopId4
    }
    _getGoodsTop10(data,(res)=>{
      let data = res;
      if(data.length==0){ 
        this.setData({
          echart4Show:false
        })
        return;
      }
      let maxNum = 0;
      data.forEach((item)=>{
        maxNum = maxNum>item.count?maxNum:item.count
      })
      let n  = []
      data.forEach((item)=>{
      let obj = {
        num:item.count/maxNum*100+'%',
        name:item.goodsbaseName,
        numData:item.count,
        color:'#61dfaf'
      }
      n.push(obj);
    })
      this.setData({
        goodsTop10Data:n,
        echart4Show:true
      }) 
    })
  },
  //获取商品零售额统计(显示前五项)
  getGoodsEchart2(){
    this.setData({
      pieList:[]
    })
    let data = {
      "endT": this.data.endT,
	    "id": this.data.selShopId2,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getGoodsScanNumByShopId(data,(res)=>{
      if(res.length==0){
        this.setData({
          chartFlg2:false
        })
        return;
      }
      let pieList = []
      let data = res;
      data.forEach((item)=>{
        let obj = {
          value:item.radio,
          name: item.goodsbaseName
        }
        pieList.push(obj);
      })

      this.setData({
        pieList:pieList,
        chartFlg2:true
      })
      this.init_chart2("#sp-echart2",this.data.pieList);
    })
  },

  onCloseGood(){
    this.setData({
      showGoods:false,
      searchGoodsData:this.data.allGoodsData
    })
  },

  getDateSelect(){
    this.setData({
      show:true
    })
  },
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
    return item.goodsBaseName.indexOf(key)>-1;
  })
  this.setData({
    searchGoodsData:arr
  })
},
  //选择商品
  selGoodsChange(e){
    this.setData({
      goodsSelectId: e.detail
    })
    //根据选择的商品id加载echart3 商品趋势图
    this.getGoodsEchart3()
  },
  //指定门店下面的商品数据 shopname为空查所有
  getShopGoodsByShopName(){
    let shopName= this.data.selShopTxt3=="全部门店"?"":this.data.selShopTxt3;
    let data = {
      "name": shopName
    }
    _getGoodsListByShopName(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          echart3Show:false
        })
        return;
      }
      let goodsList = [];
      data.forEach((item)=>{
        let obj = {
          goodsBaseName:item.goodsBaseName,
          goodsBaseId:item.goodsBaseId
        }
        goodsList.push(obj);
      })
      let first = {
        goodsBaseName:'全部商品',
        goodsBaseId:0
      }
      goodsList.unshift(first)
      this.setData({
        echart3Show:true,
        allGoodsData:goodsList,
        searchGoodsData:goodsList
      })
     this.getGoodsEchart3();
    })
   
  },
  //根据商品id加载商品趋势图
  getGoodsEchart3(){
    let data = {
      "id": this.data.goodsSelectId
    }
    _getShopGoodsSaleTrend(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          echart3Show:false
        })
        return;
      }
      let spEchart3X = [];
      let spEchart3Y = []
      data.forEach((item)=>{
        spEchart3X.push(item.mouth);
        spEchart3Y.push(item.zpcount);
      })
      this.setData({
        echart3Show:true,
        spEchart3List: spEchart3X,
        spEchart3Value: spEchart3Y
      })
      this.init_chart3('#sp-echart3',this.data.spEchart3List,this.data.spEchart3Value);
    })
    
  },
  //根据门店id加载门店商品扫码统计图  扫码数量
  getEchart1_scanNum(shopId){
    let data = {
      "endT": this.data.endT,
	    "id": shopId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getScanCodeOrSaleNumByShopId("scan",data,(res)=>{
      let data = res;
      if(data.length==0){ 
        this.setData({
          chartFlg1:false
        })
        return;
      }
      let maxNum = 0;
      data.forEach((item)=>{
        maxNum = maxNum>item.scanCodeCount?maxNum:item.scanCodeCount
      })
      let n  = []
      data.forEach((item)=>{
      let obj = {
        num:item.scanCodeCount/maxNum*100+'%',
        name:item.goodsBaseName,
        numData:item.scanCodeCount,
        color:'#61dfaf'
      }
      n.push(obj);
    })
      this.setData({
        chartData:n,
        chartFlg1:true
      }) 
    },()=>{
      this.setData({
        chartFlg1:false
      })
    })
   
  },
  //根据门店id加载门店商品扫码统计图  销售额  
  getEchart1_salseNum(shopId){
    let data = {
      "endT": this.data.endT,
	    "id": shopId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getScanCodeOrSaleNumByShopId("sale",data,(res)=>{
      if(res.length==0){
        this.setData({
          chartFlg1:false
        })
        return;
      }
      let maxNum = 0;
      res.forEach((item)=>{
        maxNum = maxNum>item.total?maxNum:item.total
      })
    
      let n  = []
      res.forEach((item)=>{
      let obj = {
        num:item.total/maxNum*100+'%',
        name:item.goodsbaseName,
        numData:item.total,
        color:'#458ef2'
      }
      n.push(obj);
    })
     console.log(n)
      this.setData({
        chartData:n,
        chartFlg1:true
      })
    },()=>{
      this.setData({
        chartFlg1:false
      })
    })

  },
  //点击销售额选择销售的数据
  getSaleNum(){
    let id = this.data.selShopId1;
    this.getEchart1_salseNum(id)
  },
  //点击扫码数量选择扫码的数据
  getScanNum(){
    let id = this.data.selShopId1;
    this.getEchart1_scanNum(id);
  },
  //根据业务员id获取门店列表
  getShopList(){
    _getShopList((res)=>{
      if(res.length==0)return;
      let shopId = 0 //第一个门店的id
      let firstAll = {
        shopId:0,
        shopName:'全部门店'
      }
      let arr = res;
      arr.unshift(firstAll);
      this.setData({
        allShopData:arr,   //所有门店数据
        searchShopData:res  //单独筛选的门店数据
      })
      //门店扫码统计
      this.getEchart1_scanNum(shopId);
      this.getGoodsEchart2(); //零售额占比统计饼图
      this.getShopGoodsByShopName();//获取所有门店下的商品
      this.getShopTop10Data()
    })
  },
  getSelectVal(e){
    let id = e.target.dataset.id;
    let val = this.data.searchShopData.find((item)=>{
      return item.shopId == id
    });
    let shopEchart = this.data.selShopEchart; //获取到是要切换哪个的门店
    console.log("val",val,id)
    //门店商品扫码统计的门店切换
    if(shopEchart == "chart1"){
      this.setData({
        selShopTxt1:val.shopName,
        selShopId1:id,
        showShop:false,
        chartFlg2:true,
        echart3Show: true,
        searchShopData:this.data.allShopData
      })
      this.getEchart1_scanNum(id);
      this.getGoodsEchart2();//商品扫码数量统计
      this.getGoodsEchart3();
      // this.getShopGoodsByShopName();//加载零售额占比统计图
    }else if(shopEchart == "chart2"){
      this.setData({
        selShopTxt2:val.shopName,
        selShopId2:id,
        showShop:false,
        chartFlg2:true,
        echart3Show: true,
        searchShopData:this.data.allShopData
      })
      this.getGoodsEchart2();//商品扫码数量统计
      this.getGoodsEchart3();
      // this.getShopGoodsByShopName();//加载零售额占比统计图

    }else if(shopEchart == "chart3"){
      this.setData({
        selShopTxt3:val.shopName,
        selShopId3:id,
        showShop:false,
        chartFlg2:true,
        echart3Show: true,
        searchShopData:this.data.allShopData
      })
      this.getGoodsEchart2();//商品扫码数量统计
      this.getShopGoodsByShopName()//商品销售趋势图 根据门店名字获取商品
    }else{
      this.setData({
        selShopTxt4:val.shopName,
        selShopId4:id,
        showShop:false,
        chartFlg2:true,
        echart3Show: true,
        searchShopData:this.data.allShopData
      })
      this.getShopTop10Data();
      this.getGoodsEchart2();//商品扫码数量统计
      this.getShopGoodsByShopName()//商品销售趋势图 根据门店名字获取商品
    }
    
  },
  getSelectGoodsVal(e){
    let id = e.target.dataset.id;
    let val = this.data.searchGoodsData.find((item)=>{
      return item.goodsBaseId == id
    });
    console.log(id)
    this.setData({
      selGoodsTxt3:val.goodsBaseName,
      showGoods:false,
      selGoodsId:id,
      chartFlg2:true,
      echart3Show: true,
      searchGoodsData:this.data.allGoodsData
    })
   //根据选择的商品id获取数据
   this.getGoodsEchart3(id)
   this.getGoodsEchart2();//商品扫码数量统计
  },
  closeShop(){
    this.setData({
      showShop:false,
      chartFlg2:true,
      echart3Show: true,
      searchShopData:this.data.allShopData
    })
    this.getGoodsEchart2();//商品扫码数量统计
    this.getShopGoodsByShopName();//获取所有门店下的商品
  },
  closeGoods(){
    this.setData({
      showGoods:false,
      chartFlg2:true,
      echart3Show:true,
      searchGoodsData:this.data.allGoodsData
    })
    this.getGoodsEchart2();//商品扫码数量统计
    this.getShopGoodsByShopName();//获取所有门店下的商品
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    // this.getEchart1_scanNum();//折线图
    // this.init_chart2("#sp-echart2",this.data.testPieList);
    // this.init_chart3('#sp-echart3',this.data.spEchart3X,this.data.spEchart3Y);
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
    //首次加载 所有的数据显示
    this.getShopList();
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