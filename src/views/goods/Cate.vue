<template>
  <div>
      <breadcrumb :breadcrumbprop="breadcrumbprop"/>
      <el-card>
          <el-row >
              <el-col >
                  <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
              </el-col>
          </el-row>
          <!-- 表格区域 -->
          <tree-table class="butop" :data="catelist" :columns="columns"
        :selection-type="false"
        :expand-type="false" show-index index-text="#"
        border>
        <!--是否有效-->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
           <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
          <!--操作-->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
        </tree-table>
          <!-- 分页区域 -->
           <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </el-card>
      <!-- 添加分类对话框 -->
      <el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%"
  @close="addCateDialogClosed"
  >
 <el-form :model="addCateForm" :rules=" addCateFormRules" ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" >
    
          <!--options指定数据源-->
          <!--props 用来指定配置对象-->
          <el-cascader
            
            :options="ParentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable 
            
           
          ></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import breadcrumb from "components/comment/breadcrumb"
import {getcatelist,getcateset} from "network/goods"
export default {
 name:'Cate',
 
 components: {
    breadcrumb,
  
},
 data () {
     return {
        breadcrumbprop:['商品管理','商品分类'],
        //商品分类的数据列表
        catelist:[],
           //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
       //总数据
      total: 0,
       //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "isok"
          },
           {
          label: "排序",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "order"
          },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible:false,
       //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
       //父级分类的列表
      ParentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:"hover",
        checkStrictly:'true'
      },
      //选中的父级分类的id数组
      selectedKeys:[]
     }
 },
 methods: {
     //获取商品分类数据
     getcatelist() {
         getcatelist(this.queryInfo).then(resu=>{
             const { data: res}= resu;
              if(res.meta.status !=200){
                 return this.$message.error('获取权限列表失败！')
             }
            //  console.log(res);
             //把数据列表赋值给cateList
             
             this.catelist=res.data.result;
             //为总数据条数赋值
             this.total=res.data.total;
         })
     },
       //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getcatelist();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getcatelist();
    },
    // 点击按钮添加分类
    showAddCateDialog(){
      this.getParentCateList()
        this.addCateDialogVisible=true
    },
      //获取父级分类的数据列表
     getParentCateList() {
        getcatelist({ type: 2 }).then(resu=>{
            const { data: res}= resu;
              if(res.meta.status !=200){
                 return this.$message.error('获取父级分类数据失败！')
             }
             console.log(res.data);
             this.ParentCateList = res.data;

        })
     },
     //选择项发生变化触发这个函数
     parentCateChanged(){
        //如果selectedKeys数组中的length>0 证明选中的父级分类
      //反之，就说明没有选中任何父级分类
      if(this.selectedKeys.length>0){
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        
       }else{
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
       }
     },
     addCate(){
      //预验证
      this.$refs.addCateFormRef.validate(valid=>{
        if (!valid) return;
        console.log(valid);
        getcateset(this.addCateForm).then(resu=>{
          const { data: res}= resu;
          if (res.meta.status !=201){
             return this.$message.error("添加分类失败！");
          }
            this.$message.success("添加分类成功！");
            this.getcatelist() 
            this.addCateDialogVisible = false
        })
      });
       


       
       
     },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
 },
 created () {
        this.getcatelist() 
 }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 15px;
}
.butop{
    margin-top:15px;
}
.bosize{
  height: 300px;
}
.el-cascader{
  width: 100%;
  
}
.bqb{
  height: 300px !important;
}

  
</style>