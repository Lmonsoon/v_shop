<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/image/b.png" alt="" />
      </div>
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user "
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-passwd "
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { Button } from "element-ui";
import { getLogindata } from "network/login";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        //验证用户名
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证正密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        const { username, password } = this.loginForm;
        getLogindata(username, password).then((resu) => {
          const { data: res } = resu;
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error("登入失败");
          this.$message({
            message: "恭喜你，登入成功",
            type: "success",
          });
          sessionStorage.setItem("token", res.data.token);
          this.$router.push({ path: "/home" });
        });
      });
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #eee;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      border: 1px solid #eee;
      background-color: #eee;
      box-shadow: 0 0 10px #eee;
      transform: translate(160px, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
.btns {
  display: flex;
  // flex-flow: row nowrap;
  justify-content: center;
}
.login_form {
  padding: 0 20px;
}
</style>