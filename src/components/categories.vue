<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
 <el-button type="primary" style="margin-bottom:10px;" @click="showdia">添加分类</el-button>

    <zk-table :selection-type="false" :expand-type='false' show-index index-text='#'
      :data="catelist"  :columns="columns" border :show-row-hover='false'>

      <template slot="isok" scope="scope">
<i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:lightgreen;"></i>
<i v-else class="el-icon-error"  style="color:red;"></i>
      </template>
      <template slot="paixu" scope="scope">
<el-tag v-if="scope.row.cat_level===0">一级分类</el-tag>
<el-tag v-else-if="scope.row.cat_level===1" type="success">二级分类</el-tag>
<el-tag v-else type="warning">三级分类</el-tag>
      </template>
      <template slot="caozuo" slot-scope="scope">
          {{scope.r}}
<el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
<el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </template>
    </zk-table>

    <el-pagination
     @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog @close='cateclose'
  title="添加分类"
  :visible.sync="adddialogVisible"
  width="50%">

  <el-form :model="addcateForm" :rules="rules" ref="addruleForm" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addcateForm.cat_name"></el-input>
  </el-form-item>

  <el-form-item label="父级分类">
 <el-cascader
    v-model="selectedkeys"
    :options="parentcatalist"
    expandTrigger='hover'
    :props="cascprops"
    @change="handleChange" :collapse-tags='false' clearable change-on-select></el-cascader>

  </el-form-item>

  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addcate">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [],
      queryinfo: {
        type: 3, pagenum: 1, pagesize: 5
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', prop: 'cat_deleted', type: 'template', template: 'isok' },
        { label: '排序', prop: 'cat_level', type: 'template', template: 'paixu' },
        { label: '操作', type: 'template', template: 'caozuo' }
      ],
      adddialogVisible: false,
      addcateForm: { cat_name: '', cat_pid: 0, cat_level: 0 },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      parentcatalist: [],
      cascprops: { value: 'cat_id', label: 'cat_name', children: 'children' },
      selectedkeys: []

    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    async   getcatelist () {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$message.error('获取信息失败！')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryinfo.pagesize = newsize
      this.getcatelist()
    },
    handleCurrentChange (newpage) {
      this.queryinfo.pagenum = newpage
      this.getcatelist()
    },
    showdia () {
      this.getparent()
      this.adddialogVisible = true
    },
    async   getparent () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级列表信息失败！')
      this.parentcatalist = res.data
    },
    handleChange (value) {
      if (this.selectedkeys.length > 0) {
        this.addcateForm.cat_pid = this.selectedkeys[this.selectedkeys.length - 1]
        this.addcateForm.cat_level = this.selectedkeys.length
      } else {
        this.addcateForm.cat_pid = 0
        this.addcateForm.cat_level = 0
      }
    },
    async   addcate () {
      const { data: res } = await this.$http.post('categories', this.addcateForm)
      if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
      this.getcatelist()
      this.$message.success('添加分类成功！')
      this.adddialogVisible = false
    },
    cateclose () {
      this.$refs.addruleForm.resetFields()
      this.selectedkeys = []
      this.addcateForm.cat_pid = 0
      this.addcateForm.cat_level = 0
    }

  }

}
</script>
<style lang="less" scoped>

</style>
