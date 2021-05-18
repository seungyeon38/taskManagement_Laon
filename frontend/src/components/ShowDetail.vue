<template>
    <base-layout>
        <template v-slot:main>
            <table style="width: 100%">
                <tr align="right">
                    <td colspan="2">
                        <el-button v-if="taskInfo.complete == 0 && taskClosed == 0" id="enroll-detailTask" class="custom-icon"  @click="dialogFormVisible = true" icon="el-icon-plus" type="info"></el-button>
                        <div v-else style="height: 50px"></div>
                        <el-dialog title="세부업무 등록" :visible.sync="dialogFormVisible" style="text-align: left; font-weight: bolder;" @closed="cancel">
                            <el-form :model="form">
                                <el-form-item label="세부업무명" :label-width="formLabelWidth">
                                    <el-input v-model="form.detailTask_name" autocomplete="off" placeholder="필수 사항입니다."></el-input>
                                </el-form-item>
                                <el-form-item label="세부업무내용" :label-width="formLabelWidth">
                                    <el-input type="textarea" v-model="form.detailTask_content" :rows="4" name="explanation" placeholder="선택 사항입니다." maxlength= "100" show-word-limit/> 
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="enrollDetailTask">Confirm</el-button>
                            </span>
                        </el-dialog>
                        <!-- 세부업무 수정 -->
                        <el-dialog title="세부업무 수정" :visible.sync="dialogModifyFormVisible" style="text-align: left; font-weight: bolder;" @closed="cancel">
                            <el-form :model="form">
                                <el-form-item label="세부업무명" :label-width="formLabelWidth">
                                    <el-input v-model="form.detailTask_name" autocomplete="off" placeholder="필수 사항입니다."></el-input>
                                </el-form-item>
                                <el-form-item label="세부업무내용" :label-width="formLabelWidth">
                                    <el-input type="textarea" v-model="form.detailTask_content" :rows="4" name="explanation" placeholder="선택 사항입니다." maxlength= "100" show-word-limit/> 
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogModifyFormVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="modifyDetailTask">Confirm</el-button>
                            </span>
                        </el-dialog>
                    </td>
                </tr>
                <tr> 
                    <td style="width: 20%; padding-top: 20px;" valign="top">
                        <el-select v-model="complete" v-if="detailTask_list.length" filterable placeholder="Select" style="width: 220px;">
                        </el-select>
                        <el-select v-model="complete" v-else filterable placeholder="Select" style="width: 220px;" disabled>
                        </el-select>
                    </td>
                    
                    <td style="width: 80%; padding-top: 20px; text-align: justify;">
                        <div style="text-align: center; font-size: 25px; font-weight: bolder; color: rgb(169, 183, 202);">{{taskInfo.task_name}}</div>
                        <hr style="border:1px dashed rgb(169, 183, 202); margin-top: 30px; margin-bottom: 35px; height: 1px;">
                        <div v-if="detailTask_list.length != 0">
                            <el-timeline>
                                <el-timeline-item v-for="detailTask in detailTask_list" :key="detailTask.detail_task_num" :timestamp="`${detailTask.report_date}, ${detailTask.workerName} 님`" placement="top">
                                    <detail-task-users v-if="detailTask.worker == userNum" v-on:showModifyDialog="showModifyDialog" :detail_task_num="detailTask.detail_task_num" :workerName="detailTask.workerName" :detail_task_name="detailTask.detail_task_name" :content="detailTask.content" :report_date="detailTask.report_date" :profile_img="detailTask.profile_img"></detail-task-users>
                                    <detail-task v-else :workerName="detailTask.workerName" :detail_task_name="detailTask.detail_task_name" :content="detailTask.content" :report_date="detailTask.report_date" :profile_img="detailTask.profile_img"></detail-task>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                        <div v-else style="font-size: 18px; color: gray; padding-top: 70px; text-align: center">
                            <span>(등록된 세부 업무가 없습니다.)</span>
                        </div>
                    </td>
                </tr>
            </table>
        </template>
        <template v-slot:aside>
            <div style="display: inline-block; width: 50%;">
                <div class="label_title">시작일</div>
                <div style="margin-bottom: 50px;">{{taskInfo.start_date}}</div>
            </div>
            <div style="display: inline-block;">
                <div class="label_title">마감일</div>
                <div style="margin-bottom: 50px;">{{taskInfo.end_date}}</div>
            </div>
            <div class="label_title">업무 내용</div>
            <div style="border: 1px solid #a9b7ca; color: #757575; width: 100%; min-height: 100px;">
                <div v-if="taskInfo.explanation" style="padding: 10px;">{{taskInfo.explanation}}</div>
                <div v-else style="padding: 10px;">(업무 내용이 없습니다.)</div>
            </div>
            <div style="margin-top: 40px;"></div>
            <div class="label_title">관리자</div>
            <div class="task_content">
                <div style="font-size: 1.2em; margin-bottom: 15px; display:flex; align-items: center;">
                    <el-avatar v-if="manager.profile_img" :size="45" style="border: 1px solid #a4a7ad;">
                        <img :src="require('../../../backend/uploads/' + manager.profile_img)" />
                    </el-avatar>
                    <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
                    <div style="margin-right: 20px"></div>
                    <span style="font-weight: bolder; max-width: 200px;" class="text-overflow">{{manager.name}} </span><span>님</span>
                </div>
                <div v-if="manager.manager_role != 'undefined'" style="margin-left: 65px">{{manager.manager_role}}</div>
            </div>
            <div v-if="workers.length" class="label_title" style="margin-top:40px;">실무담당자</div>
            <div v-for="worker in workers" :key="worker.user_num" class="task_content"> 
                <div style="font-size: 1.1em; margin-bottom: 15px; display:flex; align-items: center;">
                    <el-avatar v-if="worker.profile_img" :size="45" style="border: 1px solid rgb(207, 211, 211);">
                        <img :src="require('../../../backend/uploads/' + worker.profile_img)" />
                    </el-avatar>
                    <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
                    <div style="margin-right: 20px"></div>
                    <span style="font-weight: bolder; max-width: 200px;" class="text-overflow">{{worker.name}} </span><span>님</span>
                </div>
                <div v-if="worker.personal_role != 'undefined'" style="margin-left: 65px">{{worker.personal_role}}</div>                
            </div>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import DetailTask from './DetailTask.vue';
import DetailTaskUsers from './DetailTaskUsers.vue';

// 컴포넌트는 루트 인스턴스가 생성되기 전에 정의해야 한다. 
export default {
    components: {
        BaseLayout,
        DetailTask,
        DetailTaskUsers,
    },
    data(){
        return{
            detailTask_list: [],
            taskInfo: {},
            taskClosed: 0,
            taskNum: null,
            complete: '',
            workers: [],
            users: [],
            manager: {},
            dialogFormVisible: false,
            dialogModifyFormVisible: false,
            form: {
                detailTask_name: '',
                detailTask_content: ''
            },
            formLabelWidth: '120px',
            userNum: null,
            detailTaskNumtoModify: null
        }
    },
    methods: {
        enrollDetailTask(){
            if(this.form.detailTask_name == ''){
                alert("세부업무명은 필수 사항입니다.");
            }
            else{
                this.$axios({
                    url: 'http://localhost:3000/DetailTasks',
                    method: 'post',
                    data: {
                        task_num: this.taskNum,
                        detail_task_name: this.form.detailTask_name,
                        content: this.form.detailTask_content,
                        report_date: this.$moment().format('YYYY-MM-DDTHH:mm'),
                    },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "same-origin"
                }).then(res => {
                    if(res.data.result == true){
                        alert("세부업무가 등록되었습니다.")
                        this.dialogFormVisible = false;
                        this.$router.go()
                    }
                }).catch(err => {
                    console.log("err: ", err)
                })      
            }
        },
        cancel(){
            this.form.detailTask_name = '';
            this.form.detailTask_content = '';
        },
        date_ascending(a, b){
            var dateA = new Date(a['report_date']).getTime();
            var dateB = new Date(b['report_date']).getTime();
            return dateA > dateB ? 1 : -1;
        },
        showModifyDialog(detailTaskNum){
            this.detailTaskNumtoModify = detailTaskNum;

            this.$axios({
                url: `http://localhost:3000/DetailTasks/${detailTaskNum}`,
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                this.form.detailTask_name = res.data.detailTask.detail_task_name;
                this.form.detailTask_content = res.data.detailTask.content;

            }).catch(err => {
                console.log("err: ", err)
            })      

            this.dialogModifyFormVisible = true;
        },
        modifyDetailTask(){
            this.$axios({
                url: `http://localhost:3000/DetailTasks/${this.detailTaskNumtoModify}`,
                method: 'put',
                data: {
                    // detail_task_num: this.detailTaskNumtoModify,
                    detail_task_name: this.form.detailTask_name,
                    content: this.form.detailTask_content,
                    update_date: this.$moment().format('YYYY-MM-DDTHH:mm'),
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result == true){
                    alert("세부업무가 수정되었습니다.")
                    this.dialogModifyFormVisible = false;
                    this.$router.go();
                }
            }).catch(err => {
                console.log("err: ", err)
            })      
        }
    },
    created(){
        this.taskNum = this.$route.params.taskNum;

        this.$axios({
            url: `http://localhost:3000/getUsers`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            this.users = res.data;

            this.$axios({
                url: `http://localhost:3000/showDetail/${this.taskNum}`,
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"    
            }).then(res => {
                // "detailTasks": detail_task_num, task_num, worker, detail_task_name, content, report_date
                // "manager": manager, manager_role, name, id, email, profile_img
                // "info": task_num, task_name, explanation, start_date, end_date, register_date, complete_date, label_color, complete
                // "workers": user_num, personal_role, name, id, email, profile_img
                this.manager = res.data.manager;
                this.workers = res.data.workers; // 이걸 users로 바꿔야 함 
                this.taskInfo = res.data.info;
                
                this.userNum = res.data.userNum;

                const now = this.$moment().format('YYYY-MM-DDTHH:mm');

                if(this.taskInfo.end_date < now){
                    this.taskClosed = 1;
                }

                this.taskInfo.start_date = this.$moment(res.data.info.start_date).format('YYYY/MM/DD h:mm A');
                this.taskInfo.end_date = this.$moment(res.data.info.end_date).format('YYYY/MM/DD h:mm A');

                for(var i=0; i< res.data.detailTasks.length; i++){
                    if(res.data.detailTasks[i].worker == this.manager.manager){
                        res.data.detailTasks[i].workerId = this.manager.id;
                        res.data.detailTasks[i].workerName = this.manager.name;
                        res.data.detailTasks[i].workerEmail = this.manager.email;
                        res.data.detailTasks[i].profile_img = this.manager.profile_img;
                    }
                    else{
                        for(var j=0; j<this.users.length; j++){
                            if(res.data.detailTasks[i].worker == this.users[j].user_num){
                                res.data.detailTasks[i].workerId = this.users[j].id;
                                res.data.detailTasks[i].workerName = this.users[j].name;
                                res.data.detailTasks[i].workerEmail = this.users[j].email;
                                res.data.detailTasks[i].profile_img = this.users[j].profile_img;
                                break;
                            }
                        }
                    }
                    res.data.detailTasks[i].report_date = this.$moment(res.data.detailTasks[i].report_date).format(`YYYY/MM/DD h:mm A`);

                    // "detailTasks": detail_task_num, task_num, worker, detail_task_name, content, report_date, workerId, workerName, workerEmail, profile_img
                    this.detailTask_list.push(res.data.detailTasks[i]);
                }
            }).catch(err => {
                console.log("err: " + err);
            });
        }).catch(err => {
            console.log("err: " + err);
        });

        
    },
}
</script>

<style scoped>
.custom-icon {
   font-size: 1.5rem;
   padding: 10px;
}

#enroll-detailTask{
    padding: 0px;
    float: right; 
    width: 50px; 
    height: 50px;
}

#enroll-detailTask:focus{
    opacity: 1 !important;
    background-color: #909399;
}

#enroll-detailTask:hover{
    opacity: 1 !important;
    background-color: #a6a9ad;
}

.label_title{
    font-weight: bold; 
    font-size: 1.05em; 
    margin-bottom: 20px;
}

.task_content{
    margin-left: 10px;
    margin-top: 30px;
}
</style>