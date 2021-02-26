<template>
  <div>
<breadcrumb :breadcrumbprop="breadcrumbpro"/>
<el-card>
<el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
</el-row>
  <!--角色列表区域-->
   <el-table :data="rolesList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
            <template v-slot="scope">
                <el-row  v-for="(item1,i1) in scope.row.children"
              :key="item1.id" :class="[i1 === 0?'bdtop':'','conte']">
                    <!-- 一级权限 -->
                    <el-col :span="5">
                         <el-tag closable  @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 二级权限 -->
                    <el-col :span="19">
                        <!--通过for循环渲染二级权限-->
                <el-row  v-for="(item2,i2) in item1.children"
                  :key="item2.id" :class="[i2 === 0?'':'bdtop','vcenter','conte']">
                    <el-col :span="6">
                        <el-tag closable  type="success"  @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                        <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      
                    >{{item3.authName}}</el-tag>
                    </el-col>
                </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
       <el-table-column  label="操作">
           <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteuser(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
           </template>
       </el-table-column>
       </el-table>
</el-card>
<right-dialog :rightsList="rightsList" ref="RightDialogref" @setrolesList="setrolesList"></right-dialog>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import RightDialog from "./RightDialog"
import { getrolestabbr,getdeletecon,getdeleteuser,getrightsList } from "network/rights"
export default {
name:'Roles',
components: {
    breadcrumb,
    RightDialog
},
data () {
    return {
        breadcrumbpro:["权限管理","角色列表"],
        rolesList:[],
         //所有权限的数据
      rightsList:[],
    }
},
methods: {
    getrolestabbr(){
        getrolestabbr().then(resu=>{
             const { data: res } = resu;
             if(res.meta.status !=200){
                 return this.$message.error('获取角色列表失败！')
             }
             this.rolesList=res.data
            //  console.log(this.rolesList);
        })
    },
    //分配权限
    showSetRightDialog(role){
        this.getrightsList("tree")
        this.$refs.RightDialogref.show(role)
    },
    // 删除权限第三级
   async removeRightById(role, rightId){
         const confirmResult = await this.$confirm(
        "此操作将删除用户权限",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
        if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
       //console.log("确认了删除！");
        getdeletecon(role, rightId).then(resu=>{
             const { data: res } = resu;
              if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      //this.getRolesList();//这样会页面全部渲染
      role.children = res.data; //服务器返回的最新权限直接赋给role数据，不用刷新整个页面
        })
    },
    //删除角色
   async deleteuser(id){
          const confirmResult = await this.$confirm(
        "此操作将删除用户",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
        if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }
      getdeleteuser(id).then(resu=>{
           const { data: res } = resu;
           if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");}
        this.getrolestabbr();//这样会页面全部渲染
      })

    },
      getrightsList(type){
        getrightsList(type).then(resu=>{
             const { data: res } = resu;
             if(res.meta.status !=200){
                 return this.$message.error('获取权限列表失败！')
             }
             this.rightsList=res.data
            //  console.log(this.rightsList);
        })
    },
    setrolesList(data){
        console.log(data);
        this.rolesList=data;
        
    }
},
created () {
    this.getrolestabbr()
},
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
.el-tag{
  margin: 7px;  
}
.el-row{
    border-bottom:1px solid #eee
}
.bdtop{
    border-top:1px solid #eee
}
.vcenter{
 border-top:none
}
.bd{
     border-bottom:none
}
.conte{
    display: flex;
    align-items: center;
}
</style>