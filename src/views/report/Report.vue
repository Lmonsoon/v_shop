<template>
  <div>
      <breadcrumb :breadcrumbprop="breadcrumbprop"/>
      <el-card>
           <!-- 2 .为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
      </el-card>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
//1. 导入echarts
import * as echarts from 'echarts';
import _ from 'lodash'
import {getre} from "network/report"
export default {
name:'Report',
   components: {
    breadcrumb,
       
},
data () {
    return {
        breadcrumbprop:['数据统计','数据报表'],
          //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
},
mounted () {
     var myChart = echarts.init(document.getElementById("main"));
     getre().then(resu=>{
         const { data: res } = resu;
         if(res.meta.status !== 200){
      return this.$message.error('获取折线图数据失败！');
    }
    //4 指定图表的配置项和数据
    const result = _.merge(res.data,this.options);
    //5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
     })
}
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
</style>