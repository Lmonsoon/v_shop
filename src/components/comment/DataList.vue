<template>
    <el-table
      :data="goodsList"
       border stripe>
      <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { formatDate } from "common/utils";
import {getremogoli} from "network/goods"
export default {
name:'DataList',
props: {
    goodsList:{
        type:Array,
        default(){
            return []
        }
    },
    total:{
        type:Number,
        default:0
    }
},
data () {
    return {
        
    }
},
methods: {
   async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'      
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已经取消删除!');
        }
        console.log(id);
        getremogoli(id).then(resu=>{
            const { data: res}= resu;
             console.log(id);
            console.log(res);
                if(res.meta.status!==200){
        return this.$message.error('删除失败！');
      }
      this.$message.success('删除成功！');
      this.$parent.$parent.getGoodsList();
      
       })
     }
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

<style>

</style>