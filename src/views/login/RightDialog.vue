<template>
   <!--分配权限的对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogColsed">
      <!--树形控件-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import {getsetallot,getrolestabbr} from "network/rights"
export default {
    name:'RightDialog',
    props:{
        rightsList:{
            type:Array,
            default(){
                return[]
            }
        }
    },
    data () {
        return {
            //控制分配权限对话框显示与隐藏
      setRightDialogVisible:false,
       //树形控件的属性绑定对象
      treeProps: {
          children: 'children',
          label: 'authName'
      },
      //默认选中的节点id值
      defKeys:[],
      //当前即将分配权限的角色id
      roleId:'',
        }
    },
    methods:{
        show(role){
            this.roleId=role.id;
             this.getLeafKeys(role,this.defKeys)
            this.setRightDialogVisible=true
        },
        //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr){
      //如果当前node节点不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item=>
      this.getLeafKeys(item,arr))
    },
    //点击为角色分配权限
        allotRights(){
             const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
    //   console.log("分配的权限",keys);
      const ids=keys.join(',');
      getsetallot(this.roleId,{rids:ids}).then(resu=>{
           const { data: res } = resu;
           console.log(res);
           if(res.meta.status!==200){
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getrolestabbr();
      this.setRightDialogVisible = false;
      })
        },
        setRightDialogColsed(){
            this.defKeys=[]
        },
         getrolestabbr(){
        getrolestabbr().then(resu=>{
             const { data: res } = resu;
             if(res.meta.status !=200){
                 return this.$message.error('获取角色列表失败！')
             }
             this.$emit('setrolesList',res.data)
             console.log(res.data);
            //  this.rolesList=res.data
            //  console.log(this.rolesList);
        })
    },
    }
}
</script>

<style>

</style>