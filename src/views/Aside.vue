<template>
  <el-col>
    <el-menu
      background-color="#373d41"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activePath"
      router
    >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <!-- 菜单模板区域 -->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <el-menu-item
          :index="itemx.path"
          v-for="itemx in item.children"
          :key="itemx.id"
          @click="saveNavState(itemx.path)"
        >
          <i class="el-icon-menu"></i>
          <span>{{itemx.authName}}</span>
          </el-menu-item
        >
      </el-submenu>
    </el-menu>
  </el-col>
</template>

<script>
import { getMenuList } from "network/home";
export default {
  name: "Aside",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    getMenuList() {
      getMenuList().then((resu) => {
        const { data: res } = resu;
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
        // console.log(res);
      });
    },
    saveNavState(activePath){
    sessionStorage.setItem('activePath', activePath)
    // this.activePath=activePath
    }
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}
.iconfont {
  margin-right: 20px;
}
</style>