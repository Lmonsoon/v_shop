<template>
  <div>
       <breadcrumb :breadcrumbprop="breadcrumbprop"/>
       <el-card>
            <!--搜索与添加区域-->
       <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getorders">
            <el-button slot="append" icon="el-icon-search" @click="getorders"></el-button>
          </el-input>
        </el-col>
      </el-row>
 <!--订单列表数据-->
      <el-table :data="orderList" border stripe>
           <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
         <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgessBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
          <!-- 修改地址的对话框-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="150px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
      <!--展示物流进度的对话框-->
     <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!--timeline时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import {getorders,getkuk} from "network/order"
import { formatDate } from "common/utils";
import cityData from "./citydata";
export default {
name:'Order',
data () {
    return {
        breadcrumbprop:["订单管理","订单列表"],
         queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData, //属性名与值相同，可以简写
      progressVisible: false,
      progressInfo: []
    }
}, 
components: {
    breadcrumb,
 
       
},
created () {
    this.getorders()
},
methods: {
    getorders(){
        getorders(this.queryInfo).then(resu=>{
            const { data: res } = resu;
            console.log(res);
             if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      console.log("订单数据列表:", res.data);
      this.total = res.data.total;
      this.orderList = res.data.goods;
        })
    },
    showBox(){
        this.addressVisible = true
    },
    showProgessBox(){
        getkuk().then(resu=>{
            const { data: res } = resu;
              if (res.meta.status !== 200) {
        return this.$message.error("获取物流进度失败!");
      }
      this.progressInfo = res.data;
      console.log("测试订单号的物流进度：", this.progressInfo);
      this.progressVisible = true;
        })

          this.progressVisible = true;
    },
    addressDialogClosed(){
            this.$refs.addressFormRef.resetFields();
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getorders();
    },
     //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getorders();
    },
},
filters: {
    dateFormat(only){
             //1.将时间戳转成 Date 对象
      let date = new Date(only * 1000);

      //2.将 date 格式化
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
}
}
</script>

<style lang="less" scoped>
.el-card,.el-table,.el-pagination{
    margin-top: 15px;
}
</style>