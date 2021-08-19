<template>
    <div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="10">
        <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="orderinfo.query" clearable >
    <el-button slot="append" icon="el-icon-search" @click="queryorder"></el-button>
  </el-input>
        </el-col>
    </el-row>

     <el-table
    :data="orderlist"
    stripe border
    style="width: 100%">
    <el-table-column
      label="#" type="index">
    </el-table-column>
    <el-table-column
      prop="order_number"
      label="订单编号">
    </el-table-column>
    <el-table-column
      prop="order_price"
      label="订单价格" width="85">
    </el-table-column>
    <el-table-column
      prop="pay_status"
      label="是否付款" width="75">
      <template slot-scope="scope">
<el-tag v-if="scope.row.pay_status=='0'" type="danger">未付款</el-tag>
<el-tag v-else type="success">已支付</el-tag>
     </template>
    </el-table-column>
     <el-table-column
      prop="is_send"
      label="是否发货" width="80">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="下单时间" width="220">
     <template slot-scope="scope">
{{ scope.row.create_time | dataformat}}
     </template>
    </el-table-column>
    <el-table-column
      label="操作" width="140">
      <template>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="diiadiz"></el-button>
<el-button type="success" icon="el-icon-location" size="mini" @click="showprogress"></el-button>
      </template>
    </el-table-column>
  </el-table>
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page='orderinfo.pagenum'
      :page-sizes="[1, 3, 5, 10]"
      :page-size='orderinfo.pagesize'
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
    title="修改地址"
    :visible.sync="dialeVisible"
    width="50%" @close='addresclosed'>

    <el-form :model="addressform" :rules="rules" ref="ruleFormref" label-width="100px" >
  <el-form-item label="省市区/县" prop="address1">

  <el-cascader
    v-model="addressform.address1"
    :options="citydata"
    expandTrigger='hover'
    ></el-cascader>

  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressform.address2"></el-input>
  </el-form-item>
</el-form>

    <div slot="footer">
        <el-button @click="dialeVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialeVisible = false">确 定</el-button>
    </div>
</el-dialog>

<el-dialog
    title="物流进度"
    :visible.sync="progressdialogVisible"
    width="50%">
    <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

</el-dialog>
    </div>
</template>
<script>
import citydata from './citydata'
export default {
  data () {
    return {
      addressform: {
        address1: [],
        address2: ''
      },
      citydata,
      rules: {
        address1: [
          { required: true, message: '请选择当前地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      orderinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      dialeVisible: false,
      progressdialogVisible: false,
      reverse: true,
      activities: [
        {
          time: '2019-03-19 13:07:40',
          ftime: '2019-03-19 13:07:40',
          context: '快件已签收 签收人: 家人 感谢使用圆通速递，期待再次为您服务',
          location: null
        },
        {
          time: '2019-03-19 07:49:12',
          ftime: '2019-03-19 07:49:12',
          context: '北京市顺义区顺义机场公司派件人: 侯国宝（155****5526） 正在派件',
          location: null
        },
        {
          time: '2019-03-19 06:38:38',
          ftime: '2019-03-19 06:38:38',
          context: '快件已到达 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 21:45:46',
          ftime: '2019-03-18 21:45:46',
          context: '快件已发往 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 19:32:10',
          ftime: '2019-03-18 19:32:10',
          context: '快件已到达 北京转运中心',
          location: null
        },
        {
          time: '2019-03-18 00:21:50',
          ftime: '2019-03-18 00:21:50',
          context: '快件已发往 北京转运中心',
          location: null
        },
        {
          time: '2019-03-17 21:25:35',
          ftime: '2019-03-17 21:25:35',
          context: '快件已到达 淮安转运中心',
          location: null
        },
        {
          time: '2019-03-17 19:16:06',
          ftime: '2019-03-17 19:16:06',
          context: '快件已发往 江苏省宿迁市沭阳县公司',
          location: null
        },
        {
          time: '2019-03-17 19:04:21',
          ftime: '2019-03-17 19:04:21',
          context: '江苏省宿迁市沭阳县公司取件人: 李红雨（15751571351） 已收件',
          location: null
        }
      ]
    }
  },
  methods: {
    async  getorderlist () {
      const { data: res } = await this.$http.get('orders', { params: this.orderinfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    queryorder () {
      this.getorderlist()
    },
    handleSizeChange (val) {
      this.orderinfo.pagesize = val
      this.getorderlist()
    },
    handleCurrentChange (val) {
      this.orderinfo.pagenum = val
      this.getorderlist()
    },
    diiadiz () {
      this.dialeVisible = true
    },
    addresclosed () {
      this.$refs.ruleFormref.resetFields()
    },
    async showprogress () {
      this.progressdialogVisible = true
    }
  },
  created () {
    this.getorderlist()
  }

}
</script>
<style lang="less" scoped>
.el-cascader{width: 100%;}
</style>
