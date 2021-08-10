<template>

    <el-container  class="home_container">
  <el-header>

    <div class="left_hone">
<img src="../assets/heima.png" alt="">
<span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="cleartoken">退出</el-button>

  </el-header>
  <el-container>
    <el-aside :width="iscollapse ? '64px':'200px'">
<div class="toggle_button" @click="togglecollape">|||</div>
       <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff" unique-opened  :collapse='iscollapse' :collapse-transition="false"
      router :default-active='activepath'>

      <el-submenu :index="item.id+''"  :key="item.id" v-for="item in menulist">
        <template slot="title">
          <i :class="iconobj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>

          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="save('/'+subitem.path)">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template></el-menu-item>

      </el-submenu>
    </el-menu>

    </el-aside>
    <el-main>

     <router-view></router-view>

    </el-main>
  </el-container>
</el-container>

</template>
<script>
export default {
  data () {
    return {
      activepath: '',
      iscollapse: false,
      iconobj: { 125: 'iconfont icon-users', 103: 'iconfont icon-tijikongjian', 101: 'iconfont icon-shangpin', 102: 'iconfont icon-danju', 145: 'iconfont icon-baobiao' },
      menulist: []
    }
  },
  methods: {
    cleartoken () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async  getmenulist () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
      this.menulist = res.data
    },
    togglecollape () {
      this.iscollapse = !this.iscollapse
    },
    save (activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activepath = activepath
    }
  },
  created () {
    this.getmenulist()
    this.activepath = window.sessionStorage.getItem('activepath')
  }

}
</script>
<style lang="less" scoped>
.el-header{background-color: #373d41;display: flex;justify-content: space-between;padding-left: 0;align-items: center;color: #fff
;font-size: 20px;>div{
  display: flex;align-items: center;
  span{margin-left: 15px;}
}}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.home_container{height: 100%;}
.iconfont{margin-right: 10px;}
.el-menu{border-right: 0;}
.toggle_button{background-color: #4a5064;color: white;text-align: center;line-height: 24px;font-size: 10px;letter-spacing: 0.2em;cursor: pointer;}
</style>
