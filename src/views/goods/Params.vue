<template>
  <div>
      <breadcrumb :breadcrumbprop="breadcrumbprop"/>
   <el-card>
        <el-alert
    title="注意: 只允许为第三级分类设置相关参数!"
    type="warning"
    :closable="false"
    show-icon>
  </el-alert>
  <!--选择商品分类区域-->
          <el-row class="cat_opt" >
              <el-col >
                   <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框(clearable)-->
          <el-cascader
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
           
          ></el-cascader>
              </el-col>
          </el-row>
          <!-- tab 页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
   <!--添加动态参数的面板-->
    <el-tab-pane label="动态参数" name="many">
         <!--添加参数的按钮-->
          <el-button
            type="primary"
            
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!--动态参数表格-->
           <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
                <!--展开行-->
            <el-table-column type="expand">
                <template v-slot="scope">
                     <!--循环渲染Tag标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
              <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                  prop="attr_name"
                  label="参数名称" >
              </el-table-column>
              <el-table-column label="操作" >
                    <!--操作-->
        <template v-slot='scope'>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
              </el-table-column>
          </el-table>
    </el-tab-pane>
   <!--添加静态属性的面板-->
    <el-tab-pane label="静态属性" name="only"> 
        <!--添加属性的按钮-->
          <el-button
            type="primary"
            
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!--静态属性表格-->
           <el-table :data="onlyTableData" border stripe>
                 <!--展开行-->
            <el-table-column type="expand">
                <template v-slot="scope">
                     <!--循环渲染Tag标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
              <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                  prop="attr_name"
                  label="属性名称" >
              </el-table-column>
              <el-table-column label="操作" >
                    <!--操作-->
        <template v-slot='scope'>
          <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
              </el-table-column>
          </el-table>
          </el-tab-pane>
   
  </el-tabs>
       
          </el-card>
          <!--添加参数的对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
       @close="addDialogClosed"
    >
      <!--添加参数的对话框-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
</span>
    </el-dialog>
     <!--修改参数的对话框-->
     <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--添加参数的对话框-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import {mixingetcatelist} from 'common/mixin'
import {getparamslist,getsetdatamo,getedieren,getautorEdieren,getremovePe} from "network/goods"
export default {
mixins: [mixingetcatelist],
name: 'Params',
components: {
    breadcrumb,
},
data () {
    return {
        breadcrumbprop:['商品管理','参数列表'],
        cateProps:[],
         //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger:"hover"
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //被激活的页签的名称
      activeName: "many", //默认值动态参数
      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
       //动态参数的数据
      manyTableData: [],
      //静态属性的数据
      onlyTableData: [],
      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数属性", trigger: "blur" }
        ]
      },
       //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //修改的表单数据对象
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数属性", trigger: "blur" }
        ]
      },
      inputVisible:false,
      inputValue: ''
    }
},
methods:{
    //级联选择框选中项变化，会触发这个函数
    handleChange(){
    this.onlyTableData=[],
    this.manyTableData=[],
    this.selectedCateKeys=[]
    this.getparamslist()
    },
    //tab 页签点击事件的处理函数
    handleClick(){
       this.getparamslist()
    },
    getparamslist(){
          getparamslist(this.cateId,{sel:this.activeName}).then(resu=>{
          const { data: res}= resu;
          if(res.meta.status !=200){
              return this.$message.error('获取参数列表失败')
          }
          
          res.data.forEach(item=>{
              item.attr_vals=item.attr_vals? item.attr_vals.split(' '):[]
              item.inputVisible=false;
              item.inputValue='';
          })
          if(this.activeName==='only'){
              this.onlyTableData=res.data;
          }else{
              this.manyTableData=res.data;
          }
          console.log(res);
      })  
    },
    //监听添加对话框的关闭事件
    addDialogClosed(){
         this.$refs.addFormRef.resetFields();
    },
    //监听添加对话框的确认事件
    addParams(){
        this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        getsetdatamo(this.cateId,
        {attr_name: this.addForm.attr_name,attr_sel: this.activeName})
        .then(resu=>{
            const { data: res}= resu;
             if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getparamslist();
        })
        })
    },
    // 编辑
    showEditDialog(id){
        getedieren(this.cateId,id,{attr_sel: this.activeName }).then(resu=>{
             const { data: res}= resu;
              if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败！");
      }
      this.editForm = res.data;
      console.log("当前参数信息", this.editForm);
        })
        this.editDialogVisible = true;
    },
    // //监听编辑对话框的关闭事件
    editDialogClosed(){
         //重置修改的表单
         this.$refs.editFormRef.resetFields();

    },
    //点击按钮，修改参数信息
    editParams(){
         this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        getautorEdieren(this.cateId,this.editForm.attr_id,{ attr_name: this.editForm.attr_name, attr_sel: this.activeName})
        .then(resu=>{
            const { data: res}= resu;
               if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }
        this.$message.success("修改参数成功！");
        this.editDialogVisible = false;
        this.getparamslist();
        })
        
        })
        
    },
    // 根据id删除对应的参数项
    async removeParams(id){
         const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //用户取消了删除的操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }
      //删除的业务逻辑
      getremovePe(this.cateId,id).then(resu=>{
          const { data: res}= resu;
          if(res.meta.status !== 200){
              return this.$message.error("删除失败！");
          }
          this.$message.success("删除成功!")
           
        this.getparamslist();
      })
    },
    //  失去焦点或者按下enter
    handleInputConfirm(role){
          if(role.inputValue.trim().length === 0){
        role.inputValue = '';
        role.inputVroleisible = false;
        return;
      }
      //如果没有return，则证明输入的内容，需要做后续处理
       role.attr_vals.push(role.inputValue.trim());
      role.inputValue = '';
      role.inputVisible = false;
      //需要发起请求，保存这次操作
       this.saveget(role)
    },
    //显示输入框
    showInput(role){
         role.inputVisible=true;
         //自动获取焦点
          this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleClose(index, role){
        row.attr_vals.splice(index,1);
      this.saveget(role)
    },
    //发起请求 修改参数项
    saveget(role){
        getautorEdieren(this.cateId,role.attr_id,{ attr_name:role.attr_name, attr_sel: role.attr_sel,attr_vals:role.attr_vals.join(' ')})
      .then(resu=>{
          const { data: res}= resu;
            if(res.meta.status !==200){
        return this.$message.error('修改参数项失败！');
      }
      this.$message.success('修改参数项成功!');
      })
    }
},
created () {
    
},
computed: {
    
         //如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
     //动态计算标题的文本
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
    
}
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
.cat_opt{
    margin: 15px 0;
}
.el-button{
    margin-bottom: 15px;
}
.el-tag{
    margin: 0 10px;
}
 .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>