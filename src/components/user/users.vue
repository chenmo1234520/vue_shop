<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card class="box-card">
   <el-row :gutter="20" >

  <el-col :span="7">
      <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select" clearable @clear="getuserlist">
    <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
  </el-input>
  </el-col>

 <el-col :span="4"><el-button  type="primary" @click="adddialogVisible =true">添加用户</el-button></el-col>
</el-row>
<el-table :data="userlist" border stripe>
     <el-table-column type="index">
    </el-table-column>
    <el-table-column
        prop="username"
        label="姓名"
        width="width">
    </el-table-column>
     <el-table-column
        prop="email"
        label="邮箱"
        width="width">
    </el-table-column>
     <el-table-column
        prop="mobile"
        label="电话"
        width="width">
    </el-table-column>
     <el-table-column
        prop="role_name"
        label="角色"
        width="width">
    </el-table-column>

 <el-table-column  label="状态">
        <template slot-scope="scope">
<el-switch  @change="usertatechange(scope.row)"
  v-model="scope.row.mg_state" >
</el-switch>

        </template>
    </el-table-column>

    <el-table-column
        label="操作"
        width="180px">
        <template slot-scope="scope">

<el-tooltip  effect="dark" content="修改" placement="top" :enterable=false>
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showxiugai(scope.row.id)"></el-button>
</el-tooltip>
<el-tooltip  effect="dark" content="删除" placement="top" :enterable=false>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuser(scope.row.id)"></el-button>
</el-tooltip>
<el-tooltip  effect="dark" content="分配角色" placement="top" :enterable=false>
<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
</el-tooltip>
        </template>
    </el-table-column>
</el-table>

 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="adddialogVisible"
  @close=adddialogcosed
  width="50%">

<el-form :model="addform" :rules="addFormrules" ref="addFormref" label-width="70px" >
    <el-form-item label="用户名" prop="username">
    <el-input v-model="addform.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addform.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addform.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addform.mobile"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <!-- 按钮 -->
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser" >确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户对话框 -->
<el-dialog @close="xiugaiclosed"
  title="修改用户"
  :visible.sync="xiugaiVisible"
  width="50%">
 <el-form :model="xiugaiform" :rules="addFormrules"  ref="xiugaiFormref"  label-width="80px" >
 <el-form-item label="用户名">
    <el-input disabled v-model="xiugaiform.username" ></el-input>
  </el-form-item>

<el-form-item label="邮箱"  prop="email">
    <el-input v-model="xiugaiform.email"></el-input>
  </el-form-item>

  <el-form-item label="手机"  prop="mobile">
    <el-input v-model="xiugaiform.mobile"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="xiugaiVisible = false">取 消</el-button>
    <el-button type="primary" @click="xiugaiuser">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    var checkemail = (rules, value, callback) => {
      const regemail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regemail.test(value)) return callback()
      callback(new Error('请输入合法邮箱'))
    }
    var checkmobile = (rules, value, callback) => {
      const regemobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regemobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      xiugaiform: {},
      // 查询到的用户信息
      xiugaiVisible: false,
      // 修改用户对话框
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '用户名长度在3-15个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6-15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      adddialogVisible: false,
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  created () {
    this.getuserlist()
  },
  methods: {
    async   getuserlist () {
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$messgae.error('数据获取失败！')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryinfo.pagesize = newsize
      this.getuserlist()
    },
    handleCurrentChange (newpage) {
      this.queryinfo.pagenum = newpage
      this.getuserlist()
    },
    async  usertatechange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户失败！')
      }
      this.$message.success('更新用户成功！')
    },
    adddialogcosed () {
      this.$refs.addFormref.resetFields()
    },
    adduser () {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addform)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.adddialogVisible = false
        this.getuserlist()
      })
    },
    async  showxiugai (id) {
      this.xiugaiVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败！')
      this.xiugaiform = res.data

      this.$message.success('获取用户成功！')
    },
    xiugaiuser () {
      this.$refs.xiugaiFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.xiugaiform.id, this.xiugaiform)

        if (res.meta.status !== 200) return this.$message.error('修改用户失败！')

        this.xiugaiVisible = false
        this.getuserlist()
        this.$message.success('修改用户成功！')
      })
    },
    xiugaiclosed () {
      this.$refs.xiugaiFormref.resetFields()
    },
    async removeuser (id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res2 } = await this.$http.delete('users/' + id)
      if (res2.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.getuserlist()
      this.$message.success('删除用户成功！')
    }

  }
}
</script>
<style lang="less" scoped>

</style>
