import * as echarts from '../../ec-canvas/echarts.min.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        chartLineId: { type: String },
        canvasId: { type: String },
        height: { type: String },
        width: { type: String },
        options: { type: Object }
    },

    /**
     * 组件的初始数据
     */
    data: {
        ec: {
            lazyLoad: true, // 延迟加载
        },
    },
    lifetimes: {
        ready() {
            this[this.data.chartLineId] = this.selectComponent('#' + this.data.chartLineId);

            this.getData();
        },
        detached(e) {
            this[this.data.chartLineId] = null
            this[this.data.canvasId] = null
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getData() {
            this.initChart();
        },
        initChart() {
            this[this.data.chartLineId].init((canvas, width, height, dpr) => {
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // new
                })
                chart.setOption(this.getOption())
                return chart
            })
        },
        getOption() {
            var option = this.data.options;
            return option;
        },
    }
})
