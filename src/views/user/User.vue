<template>
  <div>
      <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
<el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
   <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
         <el-table-column  label="状态">
        <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
         </el-table-column>
          <el-table-column  label="操作">
            <template v-slot="scope">
             <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
                @click="showSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
          </el-table-column>
        </el-table>    
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totle">
    </el-pagination>
</el-card>
<!-- 添加用户的对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @clear="editDialogClosed"
  >
  <!-- 内容主体 -->
  <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
 <!--修改用户的对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisiable"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配角色的对话框-->
      <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClosed">
        <div>
          <p>当前的用户:{{userInfo.username}}</p>
          <p>当前的角色:{{userInfo.role_name}}</p>
          <p>
            分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
  
  </div>
</template>

<script>
import {
    getUserList,
    getuserState,
    getsetUser,
    getshow,
    getputid,
    getdeleteuser,
    getsaveda
    } from "network/home";
    import {getrolestabbr} from 'network/rights'
export default {
    
 name:'User',
 data () {
      // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail=/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile=/^[1][1,2,3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
     return {
           // 获取用户列表查询参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 2
      },
       userlist: [],
      totle: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addUserForm:{},
      // 用户添加表单验证规则
      addUserFormRules:{
           username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在2～10个字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '用户密码的长度在6～18个字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }, 
    //   控制修改用户框的显示与隐藏
      editDialogVisiable:false,
      //修改的用户数据
      editForm:{},
      editFormRules:{
           email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户的手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
       //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo: {},
      //所有角色的数据列表
      rolesList: [],
      //已选中的角色id值
      selectedRoleId:'',
     }
    
 },
 methods:{
     getUserList(){
         getUserList(this.queryInfo).then(resu =>{
             const { data: res } = resu;
        if (res.meta.status !== 200) return this.$message.error("获取用户列表失败");
         this.userlist = res.data.users
      this.totle = res.data.total
            //  console.log(res);
         })
     },
      // 监听 pagesize改变的事件
     handleSizeChange(newSize){
         this.queryInfo.pagesize =newSize
         this.getUserList()
     },
     // 监听 页码值 改变事件
     handleCurrentChange(newSize){
          this.queryInfo.pagenum =newSize
         this.getUserList()
     },
     //状态改变
     userStateChanged(userinfo){
        //  console.log(userinfo);
         getuserState(userinfo).then(resu=>{
             const { data: res } = resu;
              if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功！')
         })
     },
     //展示编辑用户的对话框
     showEditDialog(id){
         getshow(id).then(resu=>{
             const { data: res } = resu;
              if (res.meta.status !== 200) {
         return this.$message.error("查询用户信息失败");
      }
     this.editForm = res.data;
         })
         this.editDialogVisiable=true
     },
      //根据id删除对应的用户信息
     async removeUserById(id){
          const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
        if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
       getdeleteuser(id).then(resu=>{
            const { data: res } = resu;
             if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      this.$message.success("删除用户成功！");
      this.getUserList();
       })
     },
     showSetRole(userinfo){ 
    
        getrolestabbr().then(resu=>{
             const { data: res } = resu;
             if(res.meta.status !=200){
                 return this.$message.error('获取角色列表失败！')
             }
             this.rolesList=res.data
            //  console.log(this.rolesList);
        })
    
       this.userInfo=userinfo;
       this.setRoleDialogVisible=true;
      
     },
     
    //   监听用户对话框的关闭事件
    editDialogClosed(){
        this.$refs.addUserFormRef.resetFields()
    },
     // 添加用户
    editUser () {
         this.$refs.addUserFormRef.validate(valid=>{
              // 表单预校验失败
        if (!valid) return
       
        getsetUser(this.addUserForm).then(resu=>{
            console.log(resu);
            console.log(this.addUserForm);
             const { data: res } = resu;
             console.log(res);
               if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }else{this.$message.success('添加用户成功！')}
        
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        this.getUserList()
        })
         })
       
    },
    //修改用户
    editUserInfo(){
         this.$refs.editFormRef.validate(valid=>{
              if (!valid) return;
              getputid(this.editForm.id, this.editForm.email,
            this.editForm.mobile).then(resu=>{
                 const { data: res } = resu;
             console.log(res);
                 if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败！");
        }
        //修改一般都会有这三个操作
        //关闭对话框
        this.editDialogVisiable = false;
        //刷新数据列表
        this.getUserList(); //直接调用method
        //提示修改成功
        this.$message.success("更新用户信息成功！");
            })
         })
    },
    editDialogClosed(){
         this.$refs.editFormRef.resetFields()
    },
    setRoleDialogClosed(){
      this.selectedRoleId='',
      this.userInfo=''
    },
    saveRoleInfo(){
        if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色');
      }
      getsaveda(this.userInfo.id,{rid:this.selectedRoleId}).then(resu=>{
        const { data: res}=resu
        if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败！");
      }
      this.$message.success("更新角色成功！");
     this.getUserList();
     this.setRoleDialogVisible = false;
      })
    }
 },
 created(){
  this.getUserList()
 }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom:15px;
    font-size:12px
}
.el-card{
    box-shadow:0 1px 1px rgba(0,0,0,0.5);
}
.el-table{
    margin-top:15px;
    font-size:12px
}
.el-pagination{
    margin-top:15px;
}
</style>