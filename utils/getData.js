import request from './require'
//根据获取门店列表数据（通用接口）
export function _getShopList(suc) {
  let id =  wx.getStorageSync('loginMsg').userId;
  request({
    url:'/delegate/appBusinessManager/selectShopByBmId',
    method:'post',
    data:{
      "id": id
    }
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data)
    }
  }).catch((err)=>{
    console.log(err)
  })
}
//根据门店名称获取商品列表（动销率）
 export function _getGoodsListByShopName(data,suc){
  request({
    url:'/delegate/appBusinessManager/selectGoodsBaseByShopName',
    method:'post',
    data: data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data)
    }
  }).catch((err)=>{
    console.log(err)
  })
 }
 //根据业务员id获取门店/商品动销数量统计
 export function _getShopAndGoodsByUserId(data,suc){
  request({
    url:'/delegate/appBusinessManager/saleRatio',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data)
    }
  }).catch((err)=>{
    console.log(err)
  })
 }
//根据商品名字获取商品库存和销售数据（动销率）
 export function _getGoodsUseStatusByGoodsname(data,suc){
  request({
    url:'/delegate/appBusinessManager/goodsbaseSalesTrend',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }
  }).catch((err)=>{
    console.log(err)
  })
 }

 //根据门店id获取该门店下的扫码数量/销售数量（商品扫码-门店商品扫码统计）
 export function _getScanCodeOrSaleNumByShopId(str,data,suc,fail){
   let url = '';
   if(str == "scan"){
    url = "/delegate/appBusinessManager/shopGoodsBaseScanStatistics"
   }
   if(str == "sale"){
    url = "/delegate/appBusinessManager/scanGoodsBaseSaleStatistics"
    }
  request({
    url:url,
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }else{
      fail()
    }
  
  }).catch((err)=>{
    console.log(err);
  })
 }

 //根据门店获取商品扫码数量的前五项
 export function _getGoodsScanNumByShopId(data,suc){
  request({
    url:'/delegate/appBusinessManager/scanGoodsBaseSaleRadioStatistics',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }
    
  }).catch((err)=>{
    console.log(err)
  })
 }
//商品销售排行版前10
 export function _getGoodsTop10(data,suc){
  request({
    url:'/delegate/appBusinessManager/scanGoodsSaleRank',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }
    
  }).catch((err)=>{
    console.log(err)
  })
 }
//根据门店id获取数据 疑似窜货数量分析（门店窜货数量趋势）
export function _getGoodsCuanHuoByShopId(data,suc,fail){
  request({
    url:'/delegate/appBusinessManager/goodsFleeingTrend',
    method:'post',
    data:data
  }).then((res)=>{
    console.log(res)
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
      
    }else{
      fail()
    }
  
  }).catch((err)=>{
    console.log(err)
  })
}
//根据用户id获取门店窜货数量统计 疑似窜货数量分析（门店窜货数量统计）
export function _getShopGoodsFleeingCount(data,suc,fail){
  request({
    url:'/delegate/appBusinessManager/shopGoodsFleeingCount',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }else{
      fail();
    }
  }).catch((err)=>{
    console.log(err)
  })
}
//扫码金额统计
export function _getScanMoneyStatistics(data,suc,fail){
  request({
    url:'/delegate/appBusinessManager/scanMoneyStatistics',
    method:'post',
    data:data
  }).then((res)=>{ 
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data);
    }else{
      fail()
    }
    
  }).catch((err)=>{
    console.log(err);
  })
}

//扫码商品占比
export function _getScanGoodsbaseRadio(data,suc,fail){
  request({
    url:'/delegate/appBusinessManager/scanGoodsbaseRadio',
    method:'post',
    data:data
  }).then((res)=>{
    console.log("饼图",res)
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data)
    }else{
      fail()
    }
  }).catch((err)=>{
    console.log(err)
  })
}
//根据商品id加载商品趋势图
 export function _getShopGoodsSaleTrend(data,suc){
  request({
    url:'/delegate/appBusinessManager/shopGoodsSaleTrend',
    method:'post',
    data:data
  }).then((res)=>{
    if(res.data.message=="success"&&res.data.code==200){
      let data = res.data.data;
      suc(data)
    }
  
  }).catch((err)=>{
    console.log(err)
  })
 }

 //红包零售费比分析的商品零售额占比（前五）
 export function _getScanShopSaleRadio(data,suc){
  request({
    url:'/delegate/appBusinessManager/scanShopSaleRadio',
    method:'post',
    data:data
  }).then((res)=>{
    let data = res.data.data;
    suc(data);
  }).catch((err)=>{
    console.log(err)
  })
 }

 //红包零售费比分析 商品零售比统计
 export function _getScanGoodsBaseSaleRadio(data,suc){
  request({
    url:'/delegate/appBusinessManager/scanGoodsBaseSaleRadio',
    method:'post',
    data:data
  }).then((res)=>{
    let data = res.data.data;
    suc(data)
  }).catch((err)=>{
    console.log(err)
  })
 }