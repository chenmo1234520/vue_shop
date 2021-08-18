<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
<el-row :gutter="10">
    <el-col :span="6"><el-input placeholder="请输入内容" v-model="goodsinfo.query" clearable @clear="updatalist">
    <el-button slot="append" icon="el-icon-search" @click="updatalist" ></el-button>
  </el-input></el-col>
  <el-col :span="18"><el-button type="primary" @click="goaddpage">添加商品</el-button></el-col>
</el-row>
 <el-table
    :data="goodslist" border
    stripe
    style="width: 100%">
     <el-table-column
    type="index"
      label="#">
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格(元)"
      width="95px">
    </el-table-column>
    <el-table-column
      prop="goods_number"
      label="商品数量"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="add_time"
      label="创建时间"
      width="140px">
      <template slot-scope="scope">
        {{scope.row.add_time | dataformat}}
    </template>
    </el-table-column>

    <el-table-column
      label="操作" width="130px">
      <template slot-scope="scope">
<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="deletegoods(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>

<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsinfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="goodsinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

    </div>
</template>
<script>
export default {
  data () {
    return {
      goodsinfo: { pagenum: 1, pagesize: 10, query: '' },
      goodslist: [],
      total: 0
    }
  },
  created () {
    this.getgoodslist()
  },
  methods: {
    async  getgoodslist () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsinfo })

      if (res.meta.status !== 200) return this.$message.error('获取列表信息错误！')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.goodsinfo.pagesize = val
      this.getgoodslist()
    },
    handleCurrentChange (val) {
      this.goodsinfo.pagenum = val
      this.getgoodslist()
    },
    updatalist () {
      this.$message.success('获取数据成功！')
      this.getgoodslist()
    },
    async   deletegoods (row) {
      const msg = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg !== 'confirm') return this.$message.info('已经取消删除！')

      const { data: res } = await this.$http.delete('goods/' + row.goods_id)

      if (res.meta.status !== 200) return this.$message.error('删除商品失败！')
      this.getgoodslist()
      this.$message.success('删除商品成功！')
    },
    goaddpage () {
      this.$router.push('/goods/add')
    }

  }

}
</script>
<style lang="less" scoped>

</style>
