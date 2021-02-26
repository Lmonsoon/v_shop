<template>
  <div>
<!--  -->
  <breadcrumb :breadcrumbprop="breadcrumbprop"/>
  <el-card>
       <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <data-list :goodsList="goodsList" :total="total" />
        <!-- 分页区域 -->
           <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
  </el-card>
  <router-view />
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import DataList from "components/comment/DataList"
import {getGoodsList} from "network/goods"


export default {
    name:'List',
    
    components: {
    breadcrumb,
    DataList
       
},
    data () {
        return {
             breadcrumbprop:['商品管理','参数列表'],
             //查询参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10,
      },
      //商品列表
      goodsList:[],
       //总数据条数
      total:0,
        }
    },
    methods: {
        //根据分页获取对应的商品列表
       async getGoodsList(){
           const { data: res } =await getGoodsList(this.queryInfo)
           if(res.meta.status !== 200){
               return this.$message.error('获取参数列表失败')
           }
             this.goodsList = res.data.goods;
            this.total = res.data.total;

        },
        //进入添加商品页面组件
        goAddpage(){
            this.$router.push({name:'Add'})
        },
           //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
     //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    },
    created () {
        this.getGoodsList()
    }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
</style>