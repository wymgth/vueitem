<template>
    <el-card class="card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>       
       <el-breadcrumb-item >用户管理</el-breadcrumb-item>       
       <el-breadcrumb-item >用户列表</el-breadcrumb-item>       
    </el-breadcrumb>
    <el-row>
        <el-col>
            <el-input placeholder="请输入用户名" v-model="query" class="input-with-select">
                    <el-button 
                    @click="searchUser()"
                    slot ="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
        </el-col>
    </el-row>
    <el-table 
    class="table" height="300"
    :data="tableData" style="width:100%">
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="100"></el-table-column>
        <el-table-column  label="创建日期" width="180">
            <template slot-scope="scope">
                {{scope.row.create_time|fmDate}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
        <el-switch
        @change="changeState(scope.row)"
        v-model="scope.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949"
        ></el-switch>
        </template>
       </el-table-column>
        <el-table-column prop label="操作" width="140">
            <template slot-scope="scope">
            <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                 @click="showDiaEdit(scope.row)"
            ></el-button>
            <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle @click="showDeleConfig(scope.row)"
            ></el-button>
            <el-button
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
                circle
                @click="showRoleDia(scope.row)"
            ></el-button>
            </template>
            </el-table-column>
                </el-table>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[2,4,6,8]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                ></el-pagination>
                <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
                <el-form :model="form">
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                    </el-form-item> <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                    </el-form-item> <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                    <el-button type="primary" @click="addUser()">确 定</el-button>
                </div>
                </el-dialog>

                 <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
                <el-form :model="form">
                     <el-form-item  label="用户名" :label-width="formLabelWidth">
                    <el-input disabled v-model="form.username" autocomplete="off"></el-input>
                    </el-form-item> <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                    </el-form-item> <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                    <el-button type="primary" @click="editUser()">确 定</el-button>
                </div>
                </el-dialog>

                <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
                <el-form>
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                    {{currUsername}}
                    </el-form-item>
                                      
                                      
                    <el-form-item label="角色" :label-width="formLabelWidth">
                        {{currRoleId}}
                    <el-select v-model="currRoleId" >
                        <el-option disabled label="请选择" :value="-1"></el-option>
        
                        <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName"
                        :value="v.id"></el-option>
                    

                    </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
                    <el-button type="primary" @click="setRole()">确 定</el-button>
                </div>
                </el-dialog>

                </el-card>

                </template>

<script>
export default {
data(){
    return {
        query:'',
        tableData:[],
        query:'',
        pagenum:1,
        pagesize:2,
        total:-1,
        dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
        dialogFormVisibleRole:false,
        form:{
            username:"",
            password:"",
            email:"",
            mobile:"",
        },
        formLabelWidth:"100px",
        currRoleId:-1,
        roles:[],
        currUsername:""
    }
},
created(){
    this.getTableData();
},
methods:{

    async setRole(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
          rid:this.currRoleId
      });
      this.dialogFormVisibleRole = false;
    },
    async showRoleDia(user){
        this.currUsername=user.username;
        this.dialogFormVisibleRole = true;
    const res = await this.$http.get(`roles`);
    console.log(res);
    const {meta:{msg,status},data}=res.data
    if (status===200){
        this.roles=data
    }
    const res2 = await this.$http.get(`users/${user.id}`);
    this.currRoleId=res2.data.data.rid;
    },
    async changeState(user){
       const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
    },
    async editUser(){
      const res = await this.$http.put(`users/${this.form.id}`,this.form);
      const {
          meta:{
              msg,status
          } 
      }= res.data;
          if(status ===200){
              this.dialogFormVisibleEdit =false;
              this.getTableData();
          }else {
              this.$message.warning(msg);
          }
    },
    async showDiaEdit(user){
      this.dialogFormVisibleEdit=true;
      const res=await this.$http.get(`users/${user.id}`);
    //   console.log(res);
    const {
        meta:{msg,status},
        data
    } = res.data;
    if (status ===200){
        this.form = data;
    }
    },
    showDeleConfig(user){
      this.$confirm('是否删我?再考虑考虑', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        .then(async () => {
            const res = await this.$http.delete(`users/${user.id}`);
            // console.log(res);
            const {
                meta:{msg,status}
            }=res.data;
            if (status===200){
               this.$message.success('删除成功');
               this.pagenum=1;
               this.getTableData()
            }else{
                this.$message.warning(msg);
            }
            
        })
        .catch(() => {
            this.$message.info('已取消删除')
        })
    },
    async addUser(){
      const res = await this.$http.post(`users`,this.form);
    //   console.log(res);
      const {
          meta:{msg,status}
      }=res.data;
      if (status===201){
          this.dialogFormVisibleAdd = false;
          this.getTableData();
      }else {
          this.$message.warningx(msg);
      }
    },

    showDiaAdd(){
        this.form={}
       this.dialogFormVisibleAdd=true;
    },
    searchUser(){
        this.getTableData();
    },
    handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // val是当前页码

      //前提: 每页2条:  比如 点击2页 -> 获取数据中第三第四条
      this.pagenum = val;
      this.getTableData();
    //   console.log(`当前页: ${val}`);
    },
   async getTableData(){
       
    const AUTH_TOKEN = localStorage.getItem('token');
    this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res= await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
    console.log(res);
    const {
        meta:{status,msg},
        data:{ total,users}
    }=res.data;
    if (status ===200){
        this.tableData=users;
        // console.log(this.tableData)
        this.total=total;
        this.$message.success(msg);
    }else {
        this.$message.warning(msg);
    }
   }
}

}
</script>

<style>
.card{
    height: 100%;
}
.input-with-select{
    margin-top:20px;
    width:350px;
}
</style>
