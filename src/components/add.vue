<template>
    <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
<el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon :closable=false>
  </el-alert>

  <el-steps :active="stepdata-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
   <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<el-form :model="addruleForm" :rules="addrules" ref="addruleref" label-width="100px" label-position='top'>

 <el-tabs tab-position="left"  v-model='stepdata' :before-leave='beforetabs' @tab-click="clicktabs" >
    <el-tab-pane label="基本信息" name="0">
 <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="addruleForm.goods_name"></el-input>
  </el-form-item>
   <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="addruleForm.goods_price" type="number"></el-input>
  </el-form-item>
   <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="addruleForm.goods_weight" type="number"></el-input>
  </el-form-item>
   <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="addruleForm.goods_number" type="number"></el-input>
  </el-form-item>

   <el-form-item label="商品分类" >
<el-cascader
    v-model="addruleForm.goods_cat"
    :options="categorieslist"
    :props="{ expandTrigger: 'hover',value:'cat_id' ,label:'cat_name',children:'children'}"
    @change="categoriesChange"></el-cascader>
  </el-form-item>

    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1" >
 <el-form-item :label="item.attr_name" v-for="item in mcatelist" :key='item.attr_id' >

 <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox :label="item2" :key='i' v-for="(item2,i) in item.attr_vals" border></el-checkbox>

  </el-checkbox-group>
 </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
<el-form-item :label="item.attr_name" v-for="item in ocatelist" :key='item.attr_id' >

    <el-input v-model="item.attr_vals"></el-input>
</el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
<el-upload :action="uploadurl" :headers='headersobj'
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture"
  :on-success='picsuccess'
  >
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">

  <quill-editor v-model="addruleForm.goods_introduce" />
     <el-button type="primary" class="btnadd" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>

  </el-form>
</el-card>
<el-dialog
  title="图片预览"
  :visible.sync="showdialogVisible"
  width="50%"
  >
  <img :src="this.imguir" alt="" style="width:100%;height:100%;" >

</el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      imguir: '',
      showdialogVisible: false,
      headersobj: { Authorization: window.sessionStorage.getItem('token') },
      mcatelist: [],
      ocatelist: [],
      uploadurl: 'http://127.0.0.1:8888/api/private/v1/upload',
      categorieslist: [],
      stepdata: '0',
      addruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []

      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }

        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }

        ]
      }
    }
  },
  methods: {
    async  getcategories () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类信息失败！')
      this.categorieslist = res.data
    },
    categoriesChange (val) {
      if (val.length !== 3) {
        this.addruleForm.goods_cat = []
      } else {
        this.addruleForm.goods_cat = val
      }
    },
    beforetabs (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addruleForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async clicktabs () {
      if (this.stepdata === '1') {
        const { data: res } = await this.$http.get('categories/' + this.getid + '/attributes', {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')

        res.data.forEach(item => {
          if (item.attr_vals.indexOf(',') >= 0) {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          } else {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          }
        })
        this.mcatelist = res.data
      } else if (this.stepdata === '2') {
        const { data: res } = await this.$http.get('categories/' + this.getid + '/attributes', {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
        this.ocatelist = res.data
      }
    },
    handleRemove (file) {
      const filepath = file.response.data.tmp_path
      const reindex = this.addruleForm.pics.findIndex(x => x.pic === filepath)
      this.addruleForm.pics.splice(reindex, 1)
    },
    handlePreview (file) {
      this.imguir = file.response.data.url
      this.showdialogVisible = true
      console.log(file)
    },
    picsuccess (res) {
      if (res.meta.status !== 200) return this.$message.error('图片上传失败！')
      const picinfo = { pic: res.data.tmp_path }
      this.addruleForm.pics.push(picinfo)
      this.$message.success('图片上传成功！')
    },
    add () {
      this.$refs.addruleref.validate(async valid => {
        if (!valid) {
          console.log(valid)
          return this.$message.error(('请填写必要表单！'))
        }
        const form = _.cloneDeep(this.addruleForm)
        form.goods_cat = this.addruleForm.goods_cat.join(',')

        this.mcatelist.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }

          this.addruleForm.attrs.push(newinfo)
        })

        this.ocatelist.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals }

          this.addruleForm.attrs.push(newinfo)
        })
        form.attrs = this.addruleForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }

  },
  created () {
    this.getcategories()
  },
  computed: {
    getid () {
      if (this.addruleForm.goods_cat.length === 3) {
        return this.addruleForm.goods_cat[2]
      }
      return null
    }

  }

}
</script>
<style lang="less" scoped>
.el-checkbox{margin: 0 5px 0 0 !important;}
.btnadd{margin-top: 15px;}
</style>
