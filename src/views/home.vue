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
                            <el-button type="primary" plain @click="getHistoryList">History</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button type="primary" plain @click="dialogFormVisible = true">Save</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button :disabled="startTag !== 0" type="success" @click="start">Start</el-button>
                        </div>
                        <div style="margin-top: 20px;margin-left: 20px;">
                            <el-button type="danger" @click="reset" >Reset</el-button>
                        </div>
                    </div>
                    <div >
                        <div style=" width: 430px; margin-top: 20px;margin-left:20px; ">
                        <el-input  type="textarea"  :rows="13" placeholder="User Profile" v-model="male"></el-input>
                        </div>
                        <div style=" width: 430px; margin-top: 10px; margin-left:20px">
                            <el-input type="textarea"  :rows="13" placeholder="User Profile" v-model="female"></el-input>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-container>
                <el-main >
                    <div>
                        <!-- 聊天对话框 -->
                        <div class="chat-container">
                            <div
                                v-for="(message, index) in messages"
                                :key="index"
                                :class="['chat-bubble', message.sender === 'user' ? 'user-bubble' : 'server-bubble']"
                            >
                           <div class="message-text">{{ message.text }}</div>
                            </div>
                        </div>
                        <div class="input-area">
                            <el-input
                            v-model="userInput"
                            type="textarea"
                            :rows="4"
                            placeholder="Type your message..."
                            class="input-box"
                            clearable
                            ></el-input>
                            <!-- 发送按钮 -->
                            <el-button type="success"  class="send-button" @click="sendMessage">Send</el-button>
                        </div>     
                    </div>
                </el-main>
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
            <div style="text-align: right;">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRecord" >确 定</el-button>
            </div>
        </el-dialog>
               
       <!-- 历史记录对话框 -->
       <el-dialog title="历史记录" v-model="dialogTableVisible">
            <el-table :data="gridData" max-height="500">
                <el-table-column property="name" label="名称" width="150"></el-table-column>
                <el-table-column property="description" label="描述" width = "400"></el-table-column>
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
  import { ElAlert } from 'element-plus';
  
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
            gridData: [],
            startTag: 0,
            URL: "http://ec2-54-255-193-42.ap-southeast-1.compute.amazonaws.com",
            userInput: '',
            messages:[],
            nextStep: '',
            isDelete: 0,
            stopIndex: 0,

        }
    },
    methods: {
        async  getVersion (){
            try {
                const response = await axios.get(this.URL+`/api/v1/host/versions`);
                console.log('请求成功：', response.data.data);
                this.versions = response.data.data
            } catch (error) {
                console.error('请求失败：', error);
            }
        },
        async  start() {
            if (this.startTag === 0 ){
                const now = new Date();
                this.startTag = now.getTime();
            }
            try {
                const response = await axios.post(this.URL+`/api/v1/host/start`,{
                    "version": this.version,
                    "tag": this.startTag,
                    "male": this.male,
                    "female": this.female
                });
                this.messages.push({ text: response.data.data.ai_answer, sender: 'server' });
                this.nextStep = response.data.data.nextstep
                await this.run()
            } catch (error) {
                console.error('请求失败：', error);
            }
        },

        reset() {
            this.$alert('此操作将会删除当前Profile, 并清除会话历史！', '请确认', {
            confirmButtonText: '确定',
            callback: action => {
                this.male = '',
                this.female = ''
                this.startTag = 0
                this.userInput = ''
                this.messages = []
                this.messages.push( { text: 'Welcome to the chat!', sender: 'server' });
            }
            });
        },
        async sendMessage() {
            if (!this.userInput) return;
            // 添加用户输入到消息列表
            this.messages.push({ text: this.userInput, sender: 'user' });
            this.stopIndex++
            const index = 0
            await this.run()
            // 清空用户输入
            this.userInput = '';
        },

        async saveRecord() {
            try {
                const response = await axios.post(this.URL+`/api/v1/host/save`,{
                    "version": this.version,
                    "title": this.saveForm.title,
                    "description": this.saveForm.info,
                    "tag": this.startTag,
                    "message": this.messages
                });
                this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                this.dialogFormVisible = false

            } catch (error) {
                console.error('请求失败：', error);
            }
        },

        async run() {
            try {
                // 发起 HTTP POST 请求
                const res =  await axios.post(this.URL+`/api/v1/host/run`,{
                        "version": this.version,
                        "tag": this.startTag,
                        "content": this.userInput,
                        "next": this.nextStep
                    });

                // // 将服务器响应添加到消息列表
                if (res.data.data.ai_answer !== ""){
                    this.messages.push({ text: res.data.data.ai_answer, sender: 'server' });
                }
                this.nextStep = res.data.data.nextstep
                if (this.nextStep != 'useranswer'){
                    if (this.stopIndex < 8) {
                        await this.run()
                    }else{
                        this.$message({
                        type: 'danger',
                        message: '已达到对话次数上限：8'
                    });
                    }
                    
                }
            } catch (error) {
                console.error('Error making POST request:', error);
                // this.messages.push({ text: 'Error: Unable to fetch response from server', sender: 'server' });
            }
        },

        async deleteHistory(row){
            this.$alert('确认删除该条测试记录？', '请确认', {
            confirmButtonText: '确定',
            callback: action => {
                  this.isDelete = 1  
            }
            });
            if (this.isDelete == 1){
                try {
                    const response = await axios.post(this.URL+`/api/v1/host/history/`+row.id);
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    });
                    this.isDelete = 0
                    this.dialogTableVisible = false
                } catch (error) {
                    console.error('请求失败：', error);
                }
            }
        },
        async getHistory(row){
            try {
                    const response = await axios.get(this.URL+`/api/v1/host/history/`+row.id);
                     const data = response.data.data
                     this.male = data.male 
                     this.female = data.female
                     this.version = data.version
                     this.messages = data.messages
                     this.dialogTableVisible = false
                } catch (error) {
                    console.error('请求失败：', error);
                }
        },
        async getHistoryList(){
            this.dialogTableVisible = true
            try {
                    const response = await axios.get(this.URL+`/api/v1/host/histories`);
                    this.gridData = response.data.data
                } catch (error) {
                    console.error('请求失败：', error);
                }
        },
        recordHistory() {
            console.log("")
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
    this.messages.push( { text: 'Welcome to the chat!', sender: 'server' });

  },
//   setup() {
//     const apiUrl = 'https://dev.apiteamn.com'; // URL 变量
//     const userInput = ref('');
//     const messages = ref([
//       // 初始聊天记录
//       { text: 'Welcome to the chat!', sender: 'server' }
//     ]);
//     const sendMessage = async () => {
//       if (!userInput.value) return; // 如果没有输入内容，则不发送

//       // 添加用户输入到消息列表
//       messages.value.push({ text: userInput.value, sender: 'user' });

//       try {
//         // 发起 HTTP POST 请求
//         // const response = await axios.post(apiUrl, {
//         //   message: userInput.value // 发送用户输入到服务器
//         // });

//         // 将服务器响应添加到消息列表
//         // messages.value.push({ text: response.data.reply, sender: 'server' });
//          messages.value.push({ text: "这是模拟回复", sender: 'server' });
//       } catch (error) {
//         console.error('Error making POST request:', error);
//         messages.value.push({ text: 'Error: Unable to fetch response from server', sender: 'server' });
//       }

//       // 清空用户输入
//       userInput.value = '';
//     };
//     const reset = async () => {
//             alert('您是否确认删除当前profile,并清除会话历史！', '请确认', {
//             confirmButtonText: '确定',
//             callback: action => {
//                 this.male = "",
//                 this.female = ""
//                 this.startTag = 0;
//             }
//             });
//     };
//     return {
//       userInput,
//       messages,
//       sendMessage,
//       reset
//     };
//   }
  };
  </script>
  
  <style>
.chat-container {
  max-width: 950px;
  margin-top: 8px ;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-bubble {
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 5px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap; /* 保留空白和换行 */
  word-wrap: break-word; /* 强制长单词换行 */
  word-break: break-word; /* 强制长单词在容器边界内换行 */
}

.message-text {
  white-space: pre-wrap; /* 保留换行符并允许自动换行 */
}

.user-bubble {
  background-color: #d4f7d4; /* 绿色气泡 */
  align-self: flex-start;
  text-align: left;
}

.server-bubble {
  background-color: #f0ebeb; /* 白色气泡 */
  align-self: flex-start;
  text-align: left;
}

.input-area {
  display: flex;
  align-items: flex-start;
}

.input-box {
  margin-top: 10px;
  flex: 1;
  margin-right: 10px;
}

.send-button {
  align-self: flex-end;
}
  </style>
  