<template>
    <base-layout>
        <template v-slot:main>
            <table style="width: 100%">
                <tr align="right">
                    <td colspan="2">
                        <el-button v-if="taskInfo.completed == 0 && taskClosed == 0" class="enroll-task custom-icon"  @click="dialogFormVisible = true" icon="el-icon-plus" type="info"></el-button>
                        <div v-else style="height: 50px"></div>
                        <!-- 세부업무 등록 -->
                        <el-dialog title="세부업무 등록" :visible.sync="dialogFormVisible" style="text-align: left; font-weight: bolder;" @closed="cancel">
                            <el-form :model="form">
                                <el-form-item label="세부업무명" :label-width="formLabelWidth">
                                    <el-input v-model="form.detailTask_name" autocomplete="off" placeholder="필수 사항입니다."></el-input>
                                </el-form-item>
                                <el-form-item label="세부업무내용" :label-width="formLabelWidth">
                                    <el-input type="textarea" v-model="form.detailTask_content" :rows="4" name="explanation" placeholder="선택 사항입니다." maxlength= "100" show-word-limit/> 
                                </el-form-item>
                                <el-form-item label="관련 체크리스트" :label-width="formLabelWidth">
                                    <el-select v-model="form.detailTask_checklists" multiple placeholder="Select">
                                        <el-option
                                        v-for="checklist in checklists"
                                        :key="checklist.checklist_num"
                                        :label="checklist.content"
                                        :value="checklist.checklist_num">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button class="btn" @click="dialogFormVisible = false">취소</el-button>
                                <el-button class="btn2" @click.native="enrollDetailTask">확인</el-button>
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
                                <el-form-item label="관련 체크리스트" :label-width="formLabelWidth">
                                    <el-select v-model="form.detailTask_checklists" multiple placeholder="Select">
                                        <el-option
                                        v-for="checklist in checklists"
                                        :key="checklist.checklist_num"
                                        :label="checklist.content"
                                        :value="checklist.checklist_num">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button class="btn" @click="dialogModifyFormVisible = false">취소</el-button>
                                <el-button class="btn2" type="primary" @click.native="modifyDetailTask">확인</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog title="세부업무 삭제" :visible.sync="deleteDialogVisible" width="30%" style="text-align: left; font-weight: bolder;">
                            <div>해당 세부업무를 삭제하시겠습니까?</div>
                            <span slot="footer" class="dialog-footer">
                                <el-button class="btn" @click="deleteDialogVisible = false">취소</el-button>
                                <el-button class="btn2" type="primary" @click.native="deleteConfirm">확인</el-button>
                            </span>
                        </el-dialog>
                    </td>
                </tr>
                <tr> 
                    <td style="width: 20%; padding-top: 20px;" valign="top">
                        <el-select v-model="selectChecklistOption" v-if="detailTasks.length && checklists.length" filterable placeholder="체크리스트 전체보기" style="width: 220px;" multiple>
                            <el-option v-for="checklist in checklists" :key="checklist.checklist_num" :value="checklist.checklist_num" :label="checklist.content"></el-option>
                        </el-select>
                        <el-select v-else filterable placeholder="Select" style="width: 220px;" disabled>
                        </el-select>

                        <el-select v-model="selectUserOption" v-if="detailTasks.length" filterable placeholder="Select" style="width: 220px;">
                            <el-option :value="0" :label="'전체 사용자 세부업무 보기'"></el-option>
                            <el-option :value="1" :label="'내 세부업무만 보기'"></el-option>
                        </el-select>
                        <el-select v-else filterable placeholder="Select" style="width: 220px;" disabled>
                        </el-select>
                    </td>
                    <td style="width: 80%; padding-top: 20px; text-align: justify;">
                        <div style="text-align: center; font-size: 24px; font-weight: bolder; color: #636b79;">{{taskInfo.task_name}}</div>
                        <hr />
                        <div v-if="selectedDetailTasks.length != 0">
                            <el-timeline>
                                <el-timeline-item v-for="detailTask in selectedDetailTasks" :key="detailTask.detail_task_num" :timestamp="`${detailTask.report_date}, ${detailTask.name} 님`" placement="top">
                                    <detail-task-users v-if="detailTask.worker == userNum" v-on:showModifyDialog="showModifyDialog" v-on:deleteDetailTask="deleteDetailTask" :detail_task_num="detailTask.detail_task_num" :workerName="detailTask.name" :detail_task_name="detailTask.detail_task_name" :content="detailTask.content" :report_date="detailTask.report_date" :profile_img="detailTask.profile_img" :checklists="detailTask.checklists"></detail-task-users>
                                    <detail-task v-else :workerName="detailTask.name" :detail_task_name="detailTask.detail_task_name" :content="detailTask.content" :report_date="detailTask.report_date" :profile_img="detailTask.profile_img" :checklists="detailTask.checklists"></detail-task>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                        <div v-else style="font-size: 18px; color: #C0C4CC; padding-top: 70px; text-align: center">
                            <span>(해당하는 세부 업무가 없습니다.)</span>
                        </div>
                    </td>
                </tr>
            </table>
        </template>
        <template v-slot:aside>
            <div style="display: inline-block; width: 50%;">
                <div class="label_title">시작일</div>
                <div class="detail_info" style="margin-bottom: 50px;">{{taskInfo.start_date}}</div>
            </div>
            <div style="display: inline-block;">
                <div class="label_title">마감일</div>
                <div class="detail_info" style="margin-bottom: 50px;">{{taskInfo.end_date}}</div>
            </div>
            <div class="label_title">업무 내용</div>
                <div v-if="taskInfo.explanation" class="detail_info" style="padding: 10px;">{{taskInfo.explanation}}</div>
                <div v-else style="padding: 10px;">(업무 내용이 없습니다.)</div>
            <div style="margin-top: 40px;"></div>
            <div v-if="checklists.length">
                <div class="label_title">업무 체크리스트</div>
                <div v-if="manager.manager === userNum && taskInfo.completed == 0 && taskClosed == 0" class="border detail_info" style="padding: 10px 0px;">
                    <div v-for="checklist in checklists" :key="checklist.checklist_num" id="checklists" style="padding: 0px 10px;">
                        <div v-if="checklist.completed == false">
                            <input type="checkbox" name="checklists" :label="checklist.content" @change="checklistCheck(checklist.checklist_num)" style="margin-right: 10px;"><label>{{checklist.content}}</label>
                        </div>
                        <div v-else>
                            <input type="checkbox" name="checklists" :label="checklist.content" @change="checklistCheck(checklist.checklist_num)" style="margin-right: 10px;" checked><label>{{checklist.content}}</label>
                        </div>
                    </div>
                </div>
                <div v-else class="border detail_info" style="padding: 10px 0px">
                    <div v-for="checklist in checklists" :key="checklist.checklist_num" id="checklists">
                        <li v-if="checklist.completed == false" style="padding: 0px 10px">{{checklist.content}}</li>
                        <li v-else style="padding: 0px 10px; text-decoration: line-through; color: rgb(192, 196, 204);">{{checklist.content}}</li>
                    </div>
                </div>
            </div>
            <div style="margin-top: 40px;"></div>
            <div class="label_title">관리자</div>
            <div style="margin-left: 10px; margin-top: 30px;">
                <div style="margin-bottom: 15px; display:flex; align-items: center;">
                    <el-avatar v-if="manager.profile_img" :size="45" class="img">
                        <img :src="require('../../../backend/uploads/' + manager.profile_img)" />
                    </el-avatar>
                    <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
                    <div style="margin-right: 20px"></div>
                    <span class="name text-overflow">{{manager.name}}</span><span>님</span>
                </div>
                <div v-if="manager.manager_role != 'undefined'" class="detail_info" style="margin-left: 65px">{{manager.manager_role}}</div>
            </div>
            <div v-if="workers.length" class="label_title" style="margin-top:40px;">실무담당자</div>
            <div v-for="worker in workers" :key="worker.user_num" style="margin-left: 10px; margin-top: 30px;"> 
                <div style="margin-bottom: 15px; display:flex; align-items: center;">
                    <el-avatar v-if="worker.profile_img" :size="45" class="img">
                        <img :src="require('../../../backend/uploads/' + worker.profile_img)" />
                    </el-avatar>
                    <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
                    <div style="margin-right: 20px"></div>
                    <span class="name text-overflow">{{worker.name}} </span><span>님</span>
                </div>
                <div v-if="worker.personal_role != 'undefined'" class="detail_info" style="margin-left: 65px">{{worker.personal_role}}</div>                
            </div>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import DetailTask from './DetailTask.vue';
import DetailTaskUsers from './DetailTaskUsers.vue';

export default {
    components: {
        BaseLayout,
        DetailTask,
        DetailTaskUsers,
    },
    data(){
        return{
            detailTasks: [],
            taskInfo: {},
            taskClosed: 0,
            taskNum: null,
            selectChecklistOption: null,
            selectUserOption: 0,
            workers: [],
            users: [],
            manager: {},
            dialogFormVisible: false,
            dialogModifyFormVisible: false,
            deleteDialogVisible: false,
            form: {
                detailTask_name: '',
                detailTask_content: '',
                detailTask_checklists: []
            },
            formLabelWidth: '120px',
            userNum: null,
            detailTaskNumtoModify: null,
            checklists: [],
            deleteDetailTaskNum: '',
            selectedDetailTasks: [],
        }
    },
    methods: {
        enrollDetailTask(){
            if(this.form.detailTask_name == ''){
                alert("세부업무명은 필수 사항입니다.");
            }
            else{
                this.$axios({
                    url: `http://localhost:3000/tasks/${this.taskNum}/detailTasks`,
                    method: 'post',
                    data: {
                        detail_task_name: this.form.detailTask_name,
                        content: this.form.detailTask_content,
                        report_date: this.$moment().format('YYYY-MM-DDTHH:mm'),
                        detailTask_checklists: this.form.detailTask_checklists
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
            this.form.detailTask_checklists = [];
        },
        date_ascending(a, b){
            var dateA = new Date(a['report_date']).getTime();
            var dateB = new Date(b['report_date']).getTime();
            return dateA > dateB ? 1 : -1;
        },
        showModifyDialog(detailTaskNum){
            this.detailTaskNumtoModify = detailTaskNum;

            this.$axios({
                url: `http://localhost:3000/tasks/${this.taskNum}/detailTasks/${detailTaskNum}`,
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                this.form.detailTask_name = res.data.detailTask.detail_task_name;
                this.form.detailTask_content = res.data.detailTask.content;
                for(var i=0; i<res.data.checklists.length; i++){
                    this.form.detailTask_checklists.push(res.data.checklists[i].checklist_num);
                }
            }).catch(err => {
                console.log("err: ", err)
            })      

            this.dialogModifyFormVisible = true;
        },
        modifyDetailTask(){
            this.$axios({
                url: `http://localhost:3000/tasks/${this.taskNum}/detailTasks/${this.detailTaskNumtoModify}`,
                method: 'put',
                data: {
                    detail_task_name: this.form.detailTask_name,
                    content: this.form.detailTask_content,
                    update_date: this.$moment().format('YYYY-MM-DDTHH:mm'),
                    detailTask_checklists: this.form.detailTask_checklists
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
        },
        deleteDetailTask(detailTaskNum){
            this.deleteDetailTaskNum = detailTaskNum;
            this.deleteDialogVisible = true;
        },
        deleteConfirm(){
            this.$axios({
                url: `http://localhost:3000/tasks/${this.taskNum}/detailTasks/${this.deleteDetailTaskNum}`,
                method: 'delete',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result == true){
                    alert("세부업무가 삭제되었습니다.");
                    this.$router.go();
                }
            }).catch(err => {
                console.log("err: ", err)
            });

            this.deleteDialogVisible = false;      
        },
        checklistCheck(checklistNum){
            console.log("checklistCheck " + checklistNum)
            this.$axios({
                url: `http://localhost:3000/tasks/${this.taskNum}/checklists/${checklistNum}`,
                method: 'put',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result == true){
                    // alert("세부업무가 삭제되었습니다.");
                    // this.$router.go();
                }
            }).catch(err => {
                console.log("err: ", err)
            }) 
        },
        selectDetailTasks(checklistNum, mine){
            this.selectedDetailTasks = [];

            if(checklistNum == null){
                if(mine == 0){
                    this.selectedDetailTasks = this.detailTasks;
                }
                else if(mine == 1){
                    this.selectedDetailTasks = this.detailTasks.filter((element) => { return element.worker == this.userNum});
                }
            }

            else if(mine == 0){
                this.selectedDetailTasks = this.detailTasks.filter(function(detailTask){
                    var exist = 0;
                    console.log(checklistNum === null)
                    for(var i=0; i < checklistNum.length; i++){
                        for(var j=0; j < detailTask.checklists.length; j++){
                            if(detailTask.checklists[j].checklist_num == checklistNum[i]){
                                exist = 1;
                                break;
                            }
                        }
                        if(exist == 0){
                            return false; 
                        }
                        else{
                            exist = 0;
                        }
                    }
                    return true; 
                });
            }
            else {
                this.selectedDetailTasks = this.detailTasks.filter(function(detailTask){
                    var exist = 0;
                    for(var i=0; i < checklistNum.length; i++){
                        for(var j=0; j < detailTask.checklists.length; j++){
                            if(detailTask.checklists[j].checklist_num == checklistNum[i]){
                                exist = 1;
                                break;
                            }
                        }
                        if(exist == 0){
                            return false; 
                        }
                        else{
                            exist = 0;
                        }
                    }
                    return true; 
                });

                this.selectedDetailTasks = this.selectedDetailTasks.filter((element) => { return element.worker == this.userNum});
            }
        }
    },
    created(){
        this.taskNum = this.$route.params.taskNum;

        this.$axios({
            url: `http://localhost:3000/users/info`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            this.userNum = res.data.user_num; 

        }).catch(err => {
            console.log("err: " + err);
        });
        
        this.$axios({
            url: `http://localhost:3000/tasks/${this.taskNum}/info`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            this.manager = res.data.manager;
            this.workers = res.data.workers; 
            this.taskInfo = res.data.info;
            this.checklists = res.data.checklists;

            const now = this.$moment().format('YYYY-MM-DDTHH:mm');

            if(this.taskInfo.end_date < now){
                this.taskClosed = 1;
            }

            this.taskInfo.start_date = this.$moment(res.data.info.start_date).format('YYYY/MM/DD h:mm A');
            this.taskInfo.end_date = this.$moment(res.data.info.end_date).format('YYYY/MM/DD h:mm A');

        }).catch(err => {
            console.log("err: " + err);
        });

        this.$axios({
            url: `http://localhost:3000/tasks/${this.taskNum}/detailTasks`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            // "detailTasks": detail_task_num, task_num, worker, detail_task_name, content, report_date
            // "manager": manager, manager_role, name, id, email, profile_img
            // "info": task_num, task_name, explanation, start_date, end_date, register_date, completed_date, label_color, completed
            // "workers": user_num, personal_role, name, id, email, profile_img
            
        
            // "checklists": [{"detail_task_num":2,"content":"항목1","completed":"1"},{"detail_task_num":1,"content":"항목2","completed":"0"},{"detail_task_num":2,"content":"항목2","completed":"0"}]
            for(var i=0; i< res.data.detailTasks.length; i++){
                res.data.detailTasks[i].checklists = [];
                for(var j=0; j< res.data.checklists.length; j++){
                    if(res.data.checklists[j].detail_task_num == res.data.detailTasks[i].detail_task_num){
                        res.data.detailTasks[i].checklists.push(res.data.checklists[j]);
                    }
                }
                res.data.detailTasks[i].report_date = this.$moment(res.data.detailTasks[i].report_date).format(`YYYY/MM/DD h:mm A`);
                // "detailTasks": detail_task_num, task_num, worker, detail_task_name, content, report_date, id, name, email, profile_img
                this.detailTasks.push(res.data.detailTasks[i]);

                this.selectedDetailTasks = this.detailTasks;
            }
            // [
            //      {"detail_task_num":5,"task_num":6,"worker":2,"detail_task_name":"세부업무2","content":"","report_date":"2021/05/27 4:52 PM","id":"2002eunah","name":"장은아","email":"2002eunah@naver.com","profile_img":null,"checklists"::[{"detail_task_num":5,"checklist_num":27,"content":"항목1","completed":"0"},{"detail_task_num":5,"checklist_num":28,"content":"항목2","completed":"0"}]},
            //      {"detail_task_num":6,"task_num":6,"worker":3,"detail_task_name":"세부업무3","content":"세부업무다ㅏㅏ","report_date":"2021/05/27 4:52 PM","id":"synan0913","name":"이시연","email":"synan0913@naver.com","profile_img":"1622009452254_2(0).jpg","checklists":[]},
            //      {"detail_task_num":9,"task_num":6,"worker":4,"detail_task_name":"세부업무1","content":"세부업무 설명입니다. ","report_date":"2021/05/27 5:45 PM","id":"seongyeon38","name":"이승연","email":"seong@naver.com","profile_img":"1622010710752_4(1).jpg","checklists":["항목1"]},
            //      {"detail_task_num":10,"task_num":6,"worker":2,"detail_task_name":"dsdd","content":"fdf","report_date":"2021/05/28 3:16 PM","id":"2002eunah","name":"장은아","email":"2002eunah@naver.com","profile_img":null,"checklists":["항목2"]},
            //      {"detail_task_num":11,"task_num":6,"worker":4,"detail_task_name":"세부업무1","content":"세부업무 설명입니다. ","report_date":"2021/05/31 1:42 PM","id":"seongyeon38","name":"이승연","email":"seong@naver.com","profile_img":"1622010710752_4(1).jpg","checklists":["항목2"]}
            // ]
        }).catch(err => {
            console.log("err: " + err);
        });
    },
    watch: {
        selectChecklistOption: function(val){
            this.selectDetailTasks(val, this.selectUserOption);
        },
        selectUserOption: function(val){
            this.selectDetailTasks(this.selectChecklistOption, val);
        }
    }
}
</script>

<style scoped>
.custom-icon {
   font-size: 1.5rem;
   padding: 10px;
}

.label_title{
    font-size: 1.1em; 
    margin-bottom: 20px;
}

.border {
    border: 1px solid rgb(192, 196, 204);
    width: 100%; 
    min-height: 100px;
}

.name {
    font-size: 1.1rem; 
    font-weight: bolder; 
    max-width: 200px;
}

.img {
    border: 1px solid #a8a8a8;
    font-size: 1.2rem;
}

.detail_info {
    color: #585858;
}

hr {
  margin: 1.5em 0;
  text-align: center;
  border: none;
  margin-bottom: 50px;
}

hr:before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #E4E7ED;
  margin: 0 0.4em;
}

hr:after {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #E4E7ED;
  margin: 0 0.4em;
}

input[type=checkbox]:checked + label{
    text-decoration: line-through;
}

#checklists:not(:last-child) {
    margin-bottom: 10px;
}
</style>