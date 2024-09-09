<template>
        <el-container>
            <el-aside width="460px">
                <div >
                    <div  style="display: flex;"> 
                        <div  style="margin-top: 20px;margin-left: 20px;width: 80Px;">
                            <el-select v-model="version" placeholder="选择版本">
                                    <el-option
                                    v-for="item in versions"
                                    :key="item"
                                    :value="item">
                                    </el-option>
                            </el-select>
                        </div>
                        <div  style="margin-top: 20px; margin-left: 20px;">
                            <el-button type="primary" plain @click="dialogTableVisible = true">History</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button type="primary" plain @click="dialogFormVisible = true">Save</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button :disabled="startTag !== 0" type="success" @click="start">Start</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button type="danger"  @click="reset" >Reset</el-button>
                        </div>
                    </div>
                    <div >
                        <div style=" width: 430px; margin-top: 20px;margin-left:20px; ">
                        <el-input  type="textarea"  :rows="10" placeholder="User Profile" v-model="male"></el-input>
                        </div>
                        <div style=" width: 430px; margin-top: 10px; margin-left:20px">
                            <el-input type="textarea"  :rows="10" placeholder="User Profile" v-model="female"></el-input>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-container>
                <el-main>Main</el-main>
            </el-container>
        </el-container>

   
        <!-- Save的对话框 -->
        <el-dialog title="保存测试结果" v-model="dialogFormVisible">
            <el-form :model="saveForm">
                <el-form-item label="Title" :label-width="formLabelWidth">
                    <el-input v-model="saveForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Describetion" :label-width="formLabelWidth">
                    <el-input v-model="saveForm.info" type="textarea"  :rows="3"  autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRecord" >确 定</el-button>
            </div>
        </el-dialog>
               
       <!-- 历史记录对话框 -->
       <el-dialog title="历史记录" v-model="dialogTableVisible">
            <el-table :data="gridData" max-height="250">
                <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="名称" width="120"></el-table-column>
                <el-table-column property="address" label="描述" width = "300"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button @click="getHistory(scope.row)" type="primary" plain size="small">查看</el-button>
                        <el-button @click="deleteHistory(scope.row)" type="danger" plain size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>


  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  
  export default {
    name: 'Home',
    data () {
        return {
            male: '',
            female: '',
            versions: [],
            version: 'v1.0',
            dialogFormVisible: false,
            dialogTableVisible: false,
            saveForm:{
                title:'',
                info:''
            },
            formLabelWidth: '120px',
            gridData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }],
            startTag: 0,
            BASE_URL: "http://localhost:10005"
        }
    },
    methods: {
        async  getVersion (){
            try {
                const response = await axios.get(this.BASE_URL+`/api/v1/host/versions`);
                console.log('请求成功：', response.data.data);
                this.versions = response.data.data
            } catch (error) {
                console.error('请求失败：', error);
            }
        },
        start() {
            if (this.startTag === 0 ){
                const now = new Date();
                this.startTag = now.getTime();
            }
            try {
                const response = await axios.post(this.BASE_URL+`/api/v1/host/start`,{
                    
                });
                console.log('请求成功：', response.data.data);
                this.versions = response.data.data
            } catch (error) {
                console.error('请求失败：', error);
            }
        },
        





        saveRecord() {
            this.$alert('这是一段内容', '标题名称', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
        },
        deleteHistory(row){
            this.$alert('确认删除该条测试记录？', '请确认', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
        },
        getHistory(row){
            console.log(row)
        },
        saveRecodeDialog() {
            console.log("111111111")
            this.dialogFormVisible = true
            console.log(this.dialogFormVisible)
        },
        recordHistory() {
            console.log("")
        },
        reset() {
            this.$alert('您是否确认删除当前profile,并清除会话历史！', '请确认', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
        },
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
    },
    mounted() {
    this.getVersion(); // 页面初始化时调用 fetchInitialData 方法
  }
    // setup() {
    //   const responseData = ref(null);
  
    //   const sendPostRequest = async () => {
    //     try {
    //       const response = await axios.post('https://dev.apiteamn.com', {
    //         // 请求体数据
    //         key1: 'value1',
    //         key2: 'value2'
    //       });
  
    //       // 请求成功后的响应数据
    //       responseData.value = response.data;
    //     } catch (error) {
    //       console.error('Error making POST request:', error);
    //       responseData.value = error.message;
    //     }
    //   };
  
    //   return {
    //     sendPostRequest,
    //     responseData
    //   };
    // }
  };
  </script>
  
  <style>
  /* 添加样式 */
  </style>
  