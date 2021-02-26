<template>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">
  首页</el-breadcrumb-item>
  <el-breadcrumb-item v-for="(item,index) of breadcrumbprop" :key=index>
      {{item}}
  </el-breadcrumb-item>
  
</el-breadcrumb>
</template>

<script>
export default {
name:'breadcrumb',
props:{
    breadcrumbprop:{
     type:Array,
     default(){
         return []
     }
    }
},
data(){
    return{

    }
}

}
</script>

<style>

</style>