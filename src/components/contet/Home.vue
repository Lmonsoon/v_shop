<template>
  <el-container class="home-cont">
    <el-header>
      <div>
        <img src="~assets/image/b.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出 </el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <Aside ref="aside" />
      </el-aside>
      <el-main>
    <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "views/Aside";
export default {
  name: "Home",
  data () {
      return {
          isCollapse:false,
      }
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    //切换表单
    togleCollapse() {
      this.$refs.aside._data.isCollapse = !this.$refs.aside._data.isCollapse;
    this.isCollapse=this.$refs.aside._data.isCollapse
    },
  },
  components: {
    Aside,
  },
};
</script>

<style lang="less" scoped>
.home-cont {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-content: center;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 70px;
      height: 60px;
      border-radius: 50%;
      // border: 1px solid #eee;
    }
  }
}
.el-aside {
  background-color: #373d41;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>

