<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
<el-button type="primary">添加角色</el-button>
 <el-table
    :data="roleslist"
    style="width: 100%" stripe border="">
    <el-table-column type="expand">
      <template slot-scope="scope">
          <el-row  :class="['bdtop',i1===0?'bdtop':'','vcenter']" :key='item1.id' v-for="(item1,i1) in scope.row.children" >

              <!-- 一级权限 -->
              <el-col :span="5">

              <el-tag>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>

              </el-col>

              <!-- 二级三级权限 -->
              <el-col :span="19">
                         <el-row  :class="[i2 === 0?'':'bdtop','vcenter']" :key='item2.id' v-for="(item2,i2) in item1.children">
                             <el-col :span="6" >
                                 <el-tag type="success">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                            </el-col>

                             <el-col :span="18">
                                 <el-tag type="warning" closable @close="closetag(scope.row,item3.id)" :key='item3.id' v-for="item3 in item2.children">{{item3.authName}}</el-tag>
                                 </el-col>
                         </el-row>

           </el-col>

          </el-row>

      </template>
    </el-table-column>
     <el-table-column
      label="#"
      width="50" type="index">
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="角色描述"
      prop="roleDesc">
    </el-table-column>
    <el-table-column
      label="操作" >
      <template slot-scope="scope" >
   <el-tooltip  effect="dark"  disabled>
<el-button type="primary" icon="el-icon-edit" size="mini" @click="showxiugai(scope.row.id)">编辑</el-button>
</el-tooltip>
<el-tooltip  effect="dark" disabled>
<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuser(scope.row.id)">删除</el-button>
</el-tooltip>
<el-tooltip  effect="dark"   disabled>
<el-button type="warning" icon="el-icon-setting" size="mini" @click="showrights(scope.row)">分配权限</el-button>
</el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</el-card>

<el-dialog
  title="分配权限"
  :visible.sync="setrightsVisible"
  width="50%" @close='setrightsclosed'>
  <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all  :default-checked-keys='defkeys' ref="treeref">
  </el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setrightsVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotright">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      roleid: '',
      setrightsVisible: false,
      rightslist: [],
      roleslist: [],
      defkeys: [],
      treeProps: {
        children: 'children', label: 'authName'
      }
    }
  },
  created () {
    this.getroleslist()
  },
  methods: {
    async   getroleslist () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取信息失败！')
      this.roleslist = res.data
    },
    async  closetag (roles, id) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('取消了删除！')

      const { data: res2 } = await this.$http.delete('roles/' + roles.id + '/rights/' + id)

      if (res2.meta.status !== 200) return this.$message.error('删除失败！')
      roles.children = res2.data
    },
    async  showrights (role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败！')
      this.rightslist = res.data

      this.getleafkeys(role, this.defkeys)

      this.setrightsVisible = true
    },
    getleafkeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafkeys(item, arr)
      })
    },
    setrightsclosed () {
      this.defkeys = []
    },
    async  allotright () {
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(), ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleid + '/rights', { rids: idstr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getroleslist()
      this.setrightsVisible = false
    }
  }

}
</script>
<style lang="less" scoped>
.el-tag{margin: 7px;}
.bdwu{border-top: 0;}
.bdbottom{border-bottom: 1px solid gainsboro;}
.bdtop{border-top: 1px solid gainsboro;}
.vcenter{display: flex;align-items: center;}
</style>
