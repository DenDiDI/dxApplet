
//折线图：bi首页 商品扫码销量趋势图 疑似窜货数量分析
export function initLineChartCommon(chart,list,values) {
  var option = {
    grid: {
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '10rpx',
      containLabel: true
    },
    xAxis: {
     type: 'category',
     boundaryGap: false,
     disableGrid: false, //绘制X网格
     data: list,
     //去掉刻度
     axisTick: {
      show: false
     },
     //去掉x轴线
     axisLine: {
      show: false
     },
    },
    //y轴
    yAxis: [{
      name: '',
      type: 'value',
      min: 0,
      // max: 40,
      //y标轴名称的文字样式
      // nameTextStyle: {
      //  color: '#FFC560'
      // },
      //网格线
      splitLine: {
       show: true,
       lineStyle: {
        color: ['#999999']
       }
      },
      //去掉刻度
      axisTick: {
       show: false
      },
      //去掉y轴线
      axisLine: {
       show: false
      },
     },
    
    ],
    series: [{
      // name: 'leftData',
      type: 'line',
      animation: true, //动画效果
      // symbol: 'none',
      label : {
        normal : {
        show : true,//显示数字
        position : 'top',
        color: '#fff'
       }
      },
      //折线区域
      areaStyle: {
       //渐变颜色
       color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
         offset: 0,
         color: '#FA6C5C' // 0% 处的颜色
        }, {
         offset: 1,
         color: 'rgba(250,108,92,0)' // 100% 处的颜色
        }],
        global: false, // 缺省为 false
       },
      },
      //折线宽度
      lineStyle: {
       width: 1
      },
      color: '#FA6C5C',
      //设置固定的数据
      data:values
     },
    ]
   }
  chart.setOption(option);
  return chart;
}

//（导购员人数和门店总数的）饼图初始化
export function initPieChart(chart,data) {
  var option = {
    tooltip: {
      trigger: 'item',
      show:true,
      formatter : function(params) {
        return `${params.name}\n${params.value}`;
      }
    },
    legend: {
      left: 'center',
      bottom: 10,
      icon:'circle',
      textStyle:{
        fontSize: 12,//字体大小
        color: '#ffffff'//字体颜色
      },
    },
    color:['#21FCCA','#3B7CFF'],
    series: [
      {
        type: 'pie',
        radius: ['30%', '45%'],   //控制大小
        center: ["57%", "40%"],
        avoidLabelOverlap: false,
        label: {
          position: "center",
          normal: {
            textStyle: {
              fontSize: 12  ,// 改变标示文字的大小
              color:'#f1f1fe'
            },
            show: true,
            formatter: [" {a|{d}%}"].join("\n"), //用\n来换行
            rich: {
              a: {
                left: 10,
                padding: [-30, -10, 0, -20],  //位置按需要调整
              },
            },
          },
      },
        labelLine:{//指示线样式设置
          normal:{
            length: 18,//第一段指示线的长度
            lineStyle: {
              color: "#fff"  // 改变标示线的颜色
           }
          }  
        },
        data: data,
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
// 饼图：商品扫码数量统计
export function initPieChartCommon(chart,data) {
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: (data) => {
        if (!data.name)return '';
        let str = getEqualNewlineString(data.name, 7);
        return `${str}\n${data.value}`
      }
    },
    legend: {
      left: 'center',
      top: '48%',
      icon:'circle',
      textStyle:{
        fontSize: 12,//字体大小
        color: '#ffffff'//字体颜色
      },
      formatter: (name) => {
        if (!name) return ''
        return getEqualNewlineString(name, 20)
      }
    },
    color:['#FEE587','#49aefd','#427ffc','#4cfdcc','#f95adf','#F56C6C'],
    series: [
      {
        type: 'pie',
        radius: ['25%', '40%'],   //控制大小
        center: ["50%", "24%"],
        avoidLabelOverlap: false,
        label: {//文本样式
          normal: {
            formatter:(param)=>{
              return `${Number((param.data.value)*100).toFixed(1)}%`     
            },
            textStyle: {
              fontSize: 10  ,// 改变标示文字的大小
              color:'#f1f1fe'
              }
          },
        },
        labelLine:{//指示线样式设置
          length: 10,//第一段指示线的长度
          lineStyle: {
            color: "#fff"  // 改变标示线的颜色
         }
        },
        data: data,
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
export function initTwoLineChart(chart,list,values1,values2){
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    color:['#3089FB','#FA6C5C'],
    legend: {
      data: ['销售','库存'],
      bottom:10,
      icon:'circle',
      textStyle:{
        fontSize: 12,//字体大小
        color: '#ffffff'//字体颜色
      },
    },
    grid: {
      left: '3%',
      top: '12%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: list,
      axisTick: {
        show: false
       }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true
      },
      splitLine: {
        show: true,
        lineStyle: {
         color: ['#999999']
        }
      },
    },
    series: [
      {
        name: '销售',
        type: 'line',
        stack: 'Total',
        data: values1,
        label:{
          normal:{
            show:true,
            position: 'top',
            color:'#fff'
          }
        }
      },
      {
        name: '库存',
        type: 'line',
        stack: 'Total',
        data: values2,
        label:{
          normal:{
            show:true,
            position: 'top',
            color:'#fff'
          }
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

// 限制chart显示文字个数 超出换行
export function getEqualNewlineString(params, length) {
  let text = ''
  let count = Math.ceil(params.length / length) // 向上取整数
  // 一行展示length个
  if (count > 1) {
    for (let z = 1; z <= count; z++) {
      text += params.substr((z - 1) * length, length)
      if (z < count) {
        text += '\n'
      }
    }
  } else {
    text += params.substr(0, length)
  }
  return text
} 