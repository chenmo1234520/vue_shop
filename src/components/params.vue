<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
<el-alert
    title="注意:只允许为第三级分类设置相关参数！"
    type="warning" :closable="false"
    show-icon>
  </el-alert>
<el-row class="catopt">
    <el-col >
 <el-form  >
  <el-form-item label="选择商品分类">
<el-cascader
    v-model="categoriesvalue"
    :options="categorieslist"
    :props="{ expandTrigger: 'hover',value:'cat_id' ,label:'cat_name',children:'children'}"
    @change="categoriesChange"></el-cascader>
  </el-form-item>
  </el-form>

    </el-col>
</el-row>

   <el-tabs :value='tabssel' @tab-click="tabsClick">
    <el-tab-pane label="动态参数" name="many">
<el-button type="primary" size="mini" :disabled='isdisabled' @click="showadd">添加参数</el-button>

<el-table
    :data="dchanshulist" border
    style="width: 100%">
    <el-table-column type="expand">
<template slot-scope="scope">
 <el-tag
  :key="i"
  v-for="(tag,i) in scope.row.attr_vals"
  closable
  :disable-transitions="false"
  @close="handleClose(i,scope.row)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
</template>
    </el-table-column>

    <el-table-column
      label="#"
      type="index">
    </el-table-column>
    <el-table-column
      label="参数名称"
      prop="attr_name">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showeidta(scope.row.attr_id)">编辑</el-button>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="deldata(scope.row.attr_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
<el-button type="primary" size="mini" :disabled='isdisabled' @click="showadd">添加属性</el-button>

<el-table
    :data="jchanshulist" border
    style="width: 100%">
    <el-table-column type="expand">
<template slot-scope="scope">
 <el-tag
  :key="i"
  v-for="(tag,i) in scope.row.attr_vals"
  closable
  :disable-transitions="false"
  @close="handleClose(i,scope.row)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
</template>
    </el-table-column>
    <el-table-column
      label="#"
      type="index">
    </el-table-column>
    <el-table-column
      label="参数名称"
      prop="attr_name">
    </el-table-column>
    <el-table-column
      label="操作">
       <template slot-scope="scope">
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showeidta(scope.row.attr_id)">编辑</el-button>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="deldata(scope.row.attr_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-tab-pane>
  </el-tabs>

</el-card>

<el-dialog
  :title="'添加'+titletext"
  :visible.sync="adddialogVisible"
  width="50%">
 <el-form :model="addForm" :rules="rules" ref="addruleForm" label-width="100px" @close='addclose'>
  <el-form-item :label="titletext" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="quedadd">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  :title="'修改'+titletext"
  :visible.sync="ediadialogVisible"
  width="50%">
 <el-form :model="addForm" :rules="rules" ref="addruleForm" label-width="100px" @close='ediaclose'>
  <el-form-item :label="titletext" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="ediadialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="quededia">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      categorieslist: [],
      categoriesvalue: [],
      dchanshulist: [],
      jchanshulist: [],
      tabssel: 'many',
      isdisabled: true,
      adddialogVisible: false,
      ediadialogVisible: false,
      addForm: {
        attr_name: '',
        attr_id: 0
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getcategories()
  },
  methods: {
    async  getcategories () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类信息失败！')
      this.categorieslist = res.data
    },
    async  tabsClick (tab) {
      if (tab.index === '1') { this.tabssel = 'only' } else {
        this.tabssel = 'many'
      }
      this.gitchangdata()
    },
    async categoriesChange (value) {
      value = this.categoriesvalue

      this.gitchangdata()
    },
    async gitchangdata () {
      if (this.categoriesvalue.length !== 3) {
        this.categoriesvalue = []
        this.jchanshulist = []
        this.dchanshulist = []
        this.isdisabled = true
      } else {
        this.isdisabled = false
        const { data: res } = await this.$http.get(`categories/${this.carted}/attributes`, { params: { sel: this.tabssel } })
        if (res.meta.status !== 200) return this.$message.error('获取商品分类信息失败！')
        if (this.tabssel === 'many') { this.dchanshulist = res.data } else {
          this.jchanshulist = res.data
        }
        res.data.forEach(item => {
          if (item.attr_vals.indexOf(',') >= 0) {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          } else {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          }
        })
      }
    },
    showadd () {
      this.adddialogVisible = true
    },
    addclose () {
      this.$refs.addruleForm.resetFields()
    },
    async quedadd () {
      const { data: res } = await this.$http.post(`categories/${this.carted}/attributes`, {
        attr_sel: this.tabssel,
        attr_name: this.addForm.attr_name

      })
      if (res.meta.status !== 201) return this.$message.error('添加信息失败！')
      this.gitchangdata()
      this.$message.success('添加信息成功！')
      this.adddialogVisible = false
    },
    async  showeidta (attrid) {
      const { data: res } = await this.$http.get(`categories/${this.carted}/attributes/${attrid}`, { attr_sel: this.tabssel })
      if (res.meta.status !== 200) return this.$message.error('获取信息失败！')
      this.gitchangdata()
      this.addForm = res.data
      this.adddialogVisible = false
      this.ediadialogVisible = true
    },
    ediaclose () {
      this.$refs.addruleForm.resetFields()
    },
    async  quededia (attrid) {
      const { data: res } = await this.$http.put(`categories/${this.carted}/attributes/${this.addForm.attr_id}`, {
        attr_sel: this.tabssel,
        attr_name: this.addForm.attr_name

      })
      if (res.meta.status !== 200) return this.$message.error('修改信息失败！')
      this.gitchangdata()
      this.$message.success('修改信息成功！')
      this.adddialogVisible = false
    },
    async  deldata (id) {
      const confirmresualt = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmresualt !== 'confirm') return this.$message.info('已取消删除！')

      const { data: res } = await this.$http.delete(`categories/${this.carted}/attributes/${id}`)

      if (res.meta.status !== 200) return this.$message.error('删除信息失败！')

      this.gitchangdata()
      this.$message.success('删除信息成功！')
      this.adddialogVisible = false
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.seveattr(row)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async  seveattr (row) {
      const { data: res } = await this.$http.put(`categories/${this.carted}/attributes/${row.attr_id}`, {
        attr_sel: row.attr_sel,
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' ')

      })
      if (res.meta.status !== 200) return this.$message.error('修改信息失败！')
      this.$message.success('修改信息成功！')
    },

    async  handleInputConfirm (row) {
      const inputValue = this.inputValue
      if (inputValue.trim().length === 0) {
        this.inputVisible = false
        this.inputValue = ''
        return true
      }
      row.attr_vals.push(inputValue.trim())

      this.inputVisible = false
      this.inputValue = ''
      this.seveattr(row)
    }

  },
  computed: {
    titletext () {
      if (this.tabssel === 'many') return '动态参数'
      return '静态属性'
    },
    carted () {
      return this.categoriesvalue[2]
    }
  }

}
</script>
<style lang="less" scoped>
.catopt{margin-top: 15px;}

 .el-tag + .el-tag {
    margin-left: 10px;
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
