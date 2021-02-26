<template>
  <div>
        <!-- 面包屑导航 -->
  <breadcrumb :breadcrumbprop="breadcrumbpro"/>
  <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
       <el-table-column prop="level" label="等级">
           <template v-slot="scope">
               <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
           </template>
       </el-table-column>
        </el-table>
  </el-card>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import { getrightsList } from "network/rights"
export default {
name: 'Log',
components: {
    breadcrumb
},
data () {
    return {
        breadcrumbpro:["权限管理","权限列表"],
        rightsList:[]
    }
},
methods: {
    getrightsList(type){
        getrightsList(type).then(resu=>{
             const { data: res } = resu;
             if(res.meta.status !=200){
                 return this.$message.error('获取权限列表失败！')
             }
             this.rightsList=res.data
            //  console.log(this.rightsList);
        })
    }
},
created () {
    this.getrightsList("list")
},
// filters: {
//     levelfil(level){
//         switch(level){
//             case 0: return '一级';
//             case 1: return '二级';
//             case 2: return '三级';
//         }
//     }
// }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top:15px;
}
</style>