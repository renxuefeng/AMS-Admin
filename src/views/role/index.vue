<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="handleAdd()">新增</el-button>
      <!-- <el-button class="filter-item" type="danger">删除</el-button> -->
      <el-table v-loading="listLoading" :data="list" stripe class="filter-item" style="width: 100%">
        <el-table-column label="角色名称" prop="roleName" width="180" />
        <el-table-column label="权限信息" prop="down.modulesName" width="180" />
        <el-table-column label="备注" prop="description" width="180" />
        <el-table-column label="创建人" prop="down.name" width="180" />
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ dateFormat("YYYY-mm-dd HH:MM",new Date(scope.row.createDateTime)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-bottom:5px;" class="text-center" background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" />
      <!-- 新建用户dialog -->
      <el-dialog width="35%" title="新建角色" modal :close-on-click-modal="false" :visible.sync="addForm">
        <el-form ref="addForm" :model="roleInfo" label-width="120px" :rules="addFormRules">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="roleInfo.roleName" maxlength="11" autocomplete="off" style="width:170px" />
          </el-form-item>
          <el-form-item label="权限">
            <el-select v-model="moduleList" multiple placeholder="请选择" style="width:50%">
              <el-option
                v-for="item in moduleOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="roleInfo.description" maxlength="4" autocomplete="off" style="width:90px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addForm = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户dialog -->
      <!-- <el-dialog width="35%" title="编辑用户" modal :close-on-click-modal="false" :visible.sync="editForm">
        <el-form :model="userInfo" label-width="120px">
          <el-form-item label="登录名">
            <el-input v-model="userInfo.userName" maxlength="11" autocomplete="off" style="width:170px" />
          </el-form-item>
          <el-form-item label="用户姓名">
            <el-input v-model="userInfo.name" maxlength="4" autocomplete="off" style="width:90px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="userInfo.status">
              <el-option
                v-for="item in optionsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editForm = false">取 消</el-button>
          <el-button type="primary" @click="editForm = false">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>

  </div>
</template>
<script>
import { roleListByPage, getModuleList, roleAdd, roleDel } from '@/api/role'
export default {
  data() {
    return {
      list: null,
      moduleList: [],
      moduleOptions: [],
      listLoading: true,
      total: null,
      listQuery: {
        startPage: 1,
        pageSize: 10
      },
      dialogTableVisible: false,
      editForm: false,
      addForm: false,
      roleInfo: {
        roleName: '',
        description: '',
        up: {
          modules: []
        }
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      },
      formLabelWidth: '120px',
      optionsStatus: [{
        value: 0,
        label: '启用'
      }, {
        value: 1,
        label: '禁用'
      }
      ],
      addFormRules: {
        userName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      roleListByPage(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.rowCount
        this.listLoading = false
      })
    },
    getModuleList() {
      getModuleList().then(response => {
        console.log(response.data)
        this.moduleOptions = response.data
        this.listLoading = false
      })
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    },
    handleAdd() {
      this.userInfo = {
        name: '',
        status: 0,
        userType: 0,
        workUnit: ''
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      }
      this.roleList = []
      this.getModuleList()
      this.addForm = true
    },
    handleEdit(index, row) {
      this.editForm = true
      this.userInfo = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        roleDel(row.id).then((res) => {
          if (res.success) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    // 禁用状态格式化
    statusFormatter(row, column) {
      const status = row.status
      if (status === 0) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    genderFormatter(row, column) {
      const gender = row.gender
      if (gender === 0) {
        return '男'
      } else {
        return '女'
      }
    },
    userTypeFormatter(row, column) {
      const userType = row.userType
      if (userType === 0) {
        return '前台用户'
      } else if (userType === 1) {
        return '超级管理员'
      } else if (userType === 2) {
        return '后台用户'
      } else if (userType === 3) {
        return '数据管理'
      } else {
        return '未定义'
      }
    },
    // 新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          // NProgress.start();
          const para = Object.assign({ moduleIDS: this.moduleList }, this.roleInfo)
          console.log(para)
          roleAdd(para).then((res) => {
            console.log(res)
            if (res.success) {
              this.addLoading = false
              this.$message({
                message: '添加成功！',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addForm = false
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.listQuery.startPage = val
      this.getList()
    }
  }
}
</script>
