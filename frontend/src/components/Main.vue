<template>
    <base-layout>
        <template v-slot:main>
            <table style="width: 100%">
                <tr>
                    <td colspan="2" align="right">
                        <el-button id="enroll-task" class="custom-icon" @click.native="enrollTask" icon="el-icon-plus" type="info"></el-button>
                        <el-dialog title="업무 삭제" :visible.sync="dialogVisible" width="30%" style="text-align: left; font-weight: bolder;">
                            <span>해당 업무('{{deleteTaskName}}')를 삭제하시겠습니까?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="deleteConfirm">Confirm</el-button>
                            </span>
                        </el-dialog>
                        <!-- <button id="enroll-task" @click="enrollTask" style="width: 150px; height: 40px; font-size:0.95em;">업무 등록하기<img src="../img/arrow.png" style="width:18px"></button> -->
                        <!-- <el-button id="enroll-task" class="custom-icon" @click="dialogFormVisible = true" icon="el-icon-plus" type="info"></el-button> -->
                        <!-- <el-dialog title="업무 등록" :visible.sync="dialogFormVisible" style="text-align: left;" @closed="cancelEnroll">
                            <el-form :model="form" label-width=auto>
                                <div>
                                    <el-form-item label="업무명" for="task_name">
                                        <el-input v-model="form.task_name" type="text" name="task_name" placeholder="필수 사항입니다." class="text-overflow" style="width: 250px;" required /> 
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="업무 설명" for="explanation">
                                        <el-input v-model="form.explanation" type="textarea" :rows="4" name="explanation" placeholder="선택 사항입니다." style="width: 100%; min-width: 520px; font-family: inherit;" maxlength= "100" show-word-limit/> 
                                    </el-form-item>
                                </div>
                                <br/>
                                <div>
                                    <el-form-item label="시작/마감일 설정" for="duration" style="margin: 0px;">
                                        <table>
                                            <tr>
                                                <td>
                                                    업무 시작일
                                                </td>
                                                <td>
                                                    업무 마감일
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input v-model="form.start_date" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;" required/>
                                                </td>
                                                <td>
                                                    <input v-model="form.end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date" required/>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="라벨 색상" for="label_color">
                                        <div style="line-height: 40px;">
                                            <button type="button" @click="form.label_color='#F56C6C'" class="labelColor" style="background-color: #F56C6C"></button>
                                            <button type="button" @click="form.label_color='#E6A23C'" class="labelColor" style="background-color: #E6A23C"></button>
                                            <button type="button" @click="form.label_color='#67C23A'" class="labelColor" style="background-color: #67C23A"></button>
                                            <button type="button" @click="form.label_color='#409EFF'" class="labelColor" style="background-color: #409EFF"></button>
                                            <button type="button" @click="form.label_color='#909399'" class="labelColor" style="background-color: #909399"></button>
                                        </div>
                                    </el-form-item>
                                </div>
                                <br/>
                                <div>
                                    <el-form-item label="관리자" for="manager">
                                        <table style="border-spacing: 0px">
                                            <tr>
                                                <td valign="top">
                                                    <el-select v-model="form.manager" @change="workerReset" placeholder="선택해주세요." style="width: 220px;">
                                                        <el-option 
                                                            v-for="item in form.users" 
                                                            :key="item.user_num" 
                                                            :label="`${item.name} (${item.id})`" 
                                                            :value="item.user_num">
                                                        </el-option>
                                                    </el-select>
                                                </td>
                                                <td>
                                                    <div style="margin-left: 30px; width: 370px">
                                                        <el-input type="textarea" v-model="form.managerTask" v-if="manager" id="content" :rows="3" @change="enrollPersonalTask" placeholder="해당 관리자의 역할을 적어주세요.(최대 100자)" maxlength= "100" show-word-limit></el-input>
                                                        <el-input type="textarea" v-model="form.managerTask" v-else :rows="3" id="content_disabled" placeholder="우선 관리자를 선택해주세요." disabled></el-input>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="실무담당자" for="workers">
                                        <table style="border-spacing: 0px">
                                            <tr>
                                                <td valign="top">
                                                    <el-select v-if="form.manager" v-model="form.selected_workerNum" multiple placeholder="선택해주세요." style="width: 220px;">
                                                        <el-option
                                                        v-for="user in form.users_notManager"
                                                        :key="user.user_num" 
                                                        :label="`${user.name} (${user.id})`" 
                                                        :value="user.user_num"
                                                        >
                                                        </el-option>
                                                    </el-select>
                                                    <el-select v-else placeholder="관리자를 선택해주세요." style="width: 220px;" disabled></el-select>
                                                </td>
                                                <td>
                                                    <div style="margin-left: 30px;">
                                                        <personal-task v-for="worker in selected_workers" :key="worker.user_num" v-on:enrollPersonalTask="enrollPersonalTask" :worker_num="worker.user_num" :worker_name="worker.name" :worker_id="worker.id"></personal-task>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-form-item>
                                </div>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="enrollDetailTask" @click="dialogFormVisible = false">Confirm</el-button>
                            </span>
                        </el-dialog> -->
                    </td>
                    <!-- <button style="border: none; background-color: transparent;"><img src="../img/plus.png" alt="" style="width:45px;"></button> -->
                </tr>
                <tr>
                    <td align="left">
                        <div style="height: 20px;"></div>
                        <div class="label">중요 업무</div>
                    </td>
                    <td align="right" valign="bottom">
                        <el-select v-model="sort" @change.native="sortTask($event)" placeholder="정렬방법" style="width: 200px;">
                            <el-option :value="1">시작일 오름차순</el-option>
                            <el-option :value="2">시작일 내림차순</el-option>
                            <el-option :value="3">마감일 오름차순</el-option>
                            <el-option :value="4">마감일 내림차순</el-option>
                            <el-option :value="5">관리자명</el-option>
                            <el-option :value="6">라벨색상</el-option>
                        </el-select>
                    </td>
                </tr>
                <tr v-if="taskManagerImportant_list.length || taskImportant_list.length">
                    <task-manager v-for="task in taskManagerImportant_list" :key="task.task_num" v-on:complete="complete" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceFalse" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
                    <task-in-progress v-for="task in taskImportant_list" :key="task.task_num" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceFalse" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-in-progress>
                </tr>
                <tr v-else>
                    <div class="noTask">(중요 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td colspan="2" align="left">
                        <div class="label">진행 중인 업무</div>
                    </td>
                   
                </tr>
                <tr v-if="taskManagerInProgress_list.length || taskInProgress_list.length">
                    <task-manager v-for="task in taskManagerInProgress_list" :key="task.task_num" v-on:complete="complete" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceTrue" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
                    <task-in-progress v-for="task in taskInProgress_list" :key="task.task_num" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceTrue" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-in-progress>
                </tr>
                <tr v-else>
                    <div class="noTask">(진행 중인 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td colspan="2" align="left">
                        <div class="label">마감된 업무</div>
                    </td>
                </tr>
                <tr v-if="taskClosed_list.length">
                    <task-closed v-for="task in taskClosed_list" :key="task.task_num" v-on:clickTask="clickTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></task-closed>
                </tr>
                <tr v-else>
                    <div class="noTask">(마감된 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td colspan="2" align="left">
                        <div class="label">완료된 업무</div>
                    </td>
                    <!-- <td align="right">
                        <el-select v-model="complete" filterable placeholder="Select">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </td> -->
                </tr>
                <tr v-if="taskComplete_list.length">
                    <task-complete v-for="task in taskComplete_list" :key="task.task_num" v-on:clickTask="clickTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :complete_date="task.complete_date" :label_color="task.label_color"></task-complete>
                    <!-- <task-closed v-for="task in taskClosed_list" :key="task.task_num" :task_name="task.task_name" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></task-closed> -->
                </tr>
                <tr v-else>
                    <div class="noTask">(완료된 업무가 없습니다.)</div>
                </tr>
            </table>
        </template>
        <template v-slot:aside>
            
            <div class="label_title">이번주 업무</div>
            <div v-if="tasks_thisWeek.length">
                <this-week-task v-for="task in tasks_thisWeek" :key="task.task_num" :task_name="task.task_name" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></this-week-task>
            </div>
            <div v-else class="noTask">
                (이번주에 완료해야할 업무가 없습니다.) 
            </div>
        </template>

    </base-layout>
</template>

<script>
import TaskClosed from './Task_closed.vue'
import TaskComplete from './Task_complete.vue'
import TaskInProgress from './Task_inProgress.vue'
import TaskManager from './Task_manager.vue'
import ThisWeekTask from './ThisWeekTask.vue'

import BaseLayout from '../components/BaseLayout.vue'

// 컴포넌트는 루트 인스턴스가 생성되기 전에 정의해야 한다. 
export default {
    data(){
        return{
            userNum: null,
            // 현재는 important한 것을 나눠놓았지만 아직 안됨.
            taskImportant_list: [],         // task_inProgress
            taskManagerImportant_list: [],  // task_manager
            taskComplete_list: [],          // task_complete
            taskClosed_list: [],            // task_complete(색은 조금더 어둡게 했으면 좋겠음)
            taskInProgress_list: [],        // task_inProgress
            taskManagerInProgress_list: [], // task_manager
            tasks_thisWeek: [],  // 마감이나 완료되지 않은 것 중에 마감일이 일주일 이내로 남은 업무들
            // now: '',
            managers: {},
            sort: '',
            dialogFormVisible: false,
            // form: {
            //     task_name: '',
            //     explanation: '',
            //     // duration_check: false,
            //     start_date: '',
            //     end_date: '',
            //     // register_date: '',
            //     label_color: '#909399',
            //     // predefineColors: [
            //     //     '#F56C6C',   // 진분홍
            //     //     '#E6A23C', // 연노랑
            //     //     '#67C23A', // 연두
            //     //     '#409EFF', // 파랑
            //     //     'rgb(159, 111, 204)'  // 보라
            //     // ],
            //     manager: '',
            //     managerTask: '',
            //     // users: [],
            //     // users_notManager: [], // manager를 제외한 worker들
            //     selected_workerNum: [],
            //     // selected_workers: []   
            // },
            // users: [],
            // users_notManager: [],
            // selected_workers: [],
            formLabelWidth: '200px',
            dialogVisible: false,
            deleteTaskName: '',
            deleteTaskNum: null
            // now: ''
            // task: {
            //     task_num: 0,
            //     task_name: '',
            //     start_time: '',
            //     end_time: '',
            //     manager: '',
            //     importance: '',
            //     complete_time: '',
            //     label_color: 0,
            //     state: 0,
            // }
        }
    },
    // filters: {
    //     tasksInProgress(task){
    //         if(task.importance == 0 && task.complete_date == null && task.manager != this.userNum && task.end_date > this.now)
    //             return task;
    //         else 
    //             return null;
    //     }
    // },
    components: {
        TaskClosed,
        TaskComplete,
        TaskInProgress,
        TaskManager,
        BaseLayout,
        ThisWeekTask
        
    },
    // data, event, watcher에도 접근하기 전이라 data, methods에도 접근할 수 없다.
    // beforeCreate(){
    //     var date = new Date();
    //     this.now = `${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;
    //     console.log("now: " + this.now)
    // },
    created(){
        // var date = new Date();
        // this.now = `${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;
        // console.log("created now: " + this.now)
        // this.now = this.$moment().format();
        // console.log("created now: " + this.now)
        this.$axios({
            url: 'http://localhost:3000/managers',
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            console.log("main manager res: " + JSON.stringify(res.data));
            this.managers = res.data;

            this.$axios({
                url: 'http://localhost:3000/tasks',
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                console.log("main res.data: " + JSON.stringify(res.data));
                // console.log("res.data.userNum: " + JSON.stringify(res.data.userNum));
                // console.log("then");
                console.log(1)
                const now = this.$moment().format();

                for(var i=0; i<res.data.tasks_worker.length; i++){
                    console.log(2)
                    res.data.tasks_worker[i].manager = this.getManagerName(res.data.tasks_worker[i].manager);

                    // complete을 넣을지 complete_date가 null이 아닌 경우를 할지는 고민 
                    if(res.data.tasks_worker[i].complete == true){
                        console.log(3)
                        this.taskComplete_list.push(res.data.tasks_worker[i])
                    }
                    else if(res.data.tasks_worker[i].end_date < now){
                        console.log(4)
                        this.taskClosed_list.push(res.data.tasks_worker[i])
                    }
                    else if(res.data.tasks_worker[i].importance == true){
                        this.taskImportant_list.push(res.data.tasks_worker[i])
                    }
                    else{
                        this.taskInProgress_list.push(res.data.tasks_worker[i])
                    }
                };
                for(var i=0; i<res.data.tasks_manager.length; i++){
                    res.data.tasks_manager[i].manager = this.getManagerName(res.data.tasks_manager[i].manager);
                    if(res.data.tasks_manager[i].complete == true){
                        this.taskComplete_list.push(res.data.tasks_manager[i])
                    }
                    else if(res.data.tasks_manager[i].end_date < now){
                        this.taskClosed_list.push(res.data.tasks_manager[i])
                    }
                    else if(res.data.tasks_manager[i].importance == true){
                        this.taskManagerImportant_list.push(res.data.tasks_manager[i])
                    }
                    else{
                        this.taskManagerInProgress_list.push(res.data.tasks_manager[i])
                    }
                };
                
                console.log("taskImportant_list")
                console.log(this.taskImportant_list)
                console.log("taskManagerImportant_list")
                console.log(this.taskManagerImportant_list)
                console.log("taskComplete_list")
                console.log(this.taskComplete_list)
                console.log("taskClosed_list")
                console.log(this.taskClosed_list)
                console.log("taskInProgress_list")
                console.log(this.taskInProgress_list)
                console.log("taskManagerInProgress_list")
                console.log(this.taskManagerInProgress_list)

                const weekAfter = this.$moment().add(7, 'days').format()

                for(var i=0; i<this.taskManagerImportant_list.length; i++){
                    if(this.taskManagerImportant_list[i].end_date < weekAfter){
                        this.tasks_thisWeek.push(this.taskManagerImportant_list[i]);
                    }
                }
                for(var i=0; i<this.taskImportant_list.length; i++){
                    if(this.taskImportant_list[i].end_date < weekAfter){
                        this.tasks_thisWeek.push(this.taskImportant_list[i]);
                    }
                }
                for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                    if(this.taskManagerInProgress_list[i].end_date < weekAfter){
                        this.tasks_thisWeek.push(this.taskManagerInProgress_list[i]);
                    }
                }
                for(var i=0; i<this.taskInProgress_list.length; i++){
                    if(this.taskInProgress_list[i].end_date < weekAfter){
                        this.tasks_thisWeek.push(this.taskInProgress_list[i]);
                    }
                }
                
                console.log("tasks_thisWeek")

                this.tasks_thisWeek.sort(this.date_ascending);
                console.log("this.tasks_thisWeek: " + JSON.stringify(this.tasks_thisWeek))
                
                // console.log("taskImportant_list.length: " + this.taskImportant_list.length);
                // console.log("taskManagerImportant_list.length: " + this.taskManagerImportant_list.length);

                // taskComplete_list: [],
                // taskInProgress_list: [],
                // taskManagerComplete_list: [],
                // taskManagerInProgress_list: [],
                this.userNum = res.data.userNum;
                // console.log("userNum: " + this.userNum);
                
                // console.log(2);
                // console.log("res.data: " + JSON.stringify(res.data))
            }).catch(err => {
                console.log("catch");
                console.log(err)
            });
        })
    },
    // beforeMount(){
    //     this.now = this.$moment().format();
    //     // var date = new Date();
    //     // this.now = `${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;
    // },
    // mounted(){
    //     this.now = this.$moment().format();
    //     console.log("mounted now: " + this.now)
    // }, 
    methods: {
        getManagerName(managerNum){
            for(var i=0; i<this.managers.length; i++){
                // console.log("getManagerName for")
                if(this.managers[i].manager == managerNum){
                    // console.log("getManagerName if")
                    return this.managers[i].name;
                }
            }
            console.log("null")
            return null;
        },
        cancelEnroll(){
            this.form.detailTask_name = '';
            this.form.detailTask_content = '';
        },
        enrollTask(){
            // console.log("now: " + this.now)
            this.$router.push({name: 'enrollTask'});
        },
        // handleClose(done) {
        //     this.$confirm('Are you sure to close this dialog?')
        //     .then(_ => {
        //         done();
        //     })
        //     .catch(_ => {});
        // },
        complete(taskNum){            
            console.log("parent complete function")
            console.log("taskNum: " + taskNum)

            // complete 1로, complete_date 현재 시간으로
            this.$axios({
                url: 'http://localhost:3000/completeTask',
                method: 'post',
                data: {
                    task_num: taskNum, 
                    complete_date: this.$moment().format()
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                // console.log("main complete then");
                // this.$router.go();
                if(res.data.result){
                    console.log("main complete then");
                    this.$router.go();
                }
                // const taskToFind = this.taskManagerImportant_list.find(function(item){return item.task_num === taskNum});
                // console.log("taskToFind: " + taskToFind);
                // const indexToDelete = this.taskManagerImportant_list.indexOf(taskToFind);
                // this.taskManagerImportant_list.splice(indexToDelete,1);
                // taskComplete_list.push(taskToFind);
            // taskManagerImportant_list: [],  // task_manager
            // taskManagerInProgress_list: [], // task_manager
            // taskComplete_list: [],          // task_complete
            }).catch(err => {
                console.log("main complete catch");
            });  
        },
        // completeImportant(taskNum){            
        //     console.log("parent complete_important function")
        //     console.log("taskNum: " + taskNum)

        //     // complete 1로, complete_date 현재 시간으로
        //     this.$axios({
        //         url: 'http://localhost:3000/completeTask',
        //         method: 'post',
        //         data: {
        //             task_num: taskNum, 
        //             complete_date: this.$moment().format()
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: "same-origin"
        //     }).then(res => {
        //         console.log("main complete_important then");

        //         const taskToFind = this.taskManagerImportant_list.find(function(item){return item.task_num === taskNum});
        //         console.log("taskToFind: " + taskToFind);
        //         const indexToDelete = this.taskManagerImportant_list.indexOf(taskToFind);
        //         this.taskManagerImportant_list.splice(indexToDelete,1);
        //         taskComplete_list.push(taskToFind);
        //     // taskManagerImportant_list: [],  // task_manager
        //     // taskManagerInProgress_list: [], // task_manager
        //     // taskComplete_list: [],          // task_complete
        //     }).catch(err => {
        //         console.log("main complete_important catch");
        //     });  
        // },
        // completeInProgress(taskNum){            
        //     console.log("parent complete_inProgress function")
        //     console.log("taskNum: " + taskNum)

        //     const complete_date = this.$moment().format()
        //     // complete 1로, complete_date 현재 시간으로
        //     this.$axios({
        //         url: 'http://localhost:3000/completeTask',
        //         method: 'post',
        //         data: {
        //             task_num: taskNum, 
        //             complete_date: complete_date
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: "same-origin"
        //     }).then(res => {
        //         console.log("main complete_inProgress then");
        //         const taskToFind = this.taskManagerInProgress_list.find(function(item){return item.task_num === taskNum});
        //         console.log("taskToFind: " + taskToFind);
        //         const indexToDelete = this.taskManagerInProgress_list.indexOf(taskToFind);
        //         this.taskManagerInProgress_list.splice(indexToDelete,1);
        //         taskToFind.complete_date = complete_date;
        //         this.taskComplete_list.push(taskToFind);
        //     // taskManagerImportant_list: [],  // task_manager
        //     // taskManagerInProgress_list: [], // task_manager
        //     // taskComplete_list: [],          // task_complete
        //     }).catch(err => {
        //         console.log("main complete_inProgress catch");
        //     });  
        // },
        clickTask(taskNum){
            console.log("Main taskNum: " + taskNum);
            // console.log("Main.vue this.managers: " + JSON.stringify(this.managers));
            this.$router.push({
                name: 'showDetail', 
                params: {taskNum: taskNum, managers: this.managers}
            })
        },
        sortTask(event){
            if(event.target.value == 1){

            }
            else if(event.target.value == 2){

            }
            else if(event.target.value == 3){

            }
            else if(event.target.value == 4){

            }
            else if(event.target.value == 5){

            }
            else if(event.target.value == 6){

            }
        },
        //   taskImportant_list: [],        
        //   taskManagerImportant_list: [], 
        //   taskInProgress_list: [],       
        //   taskManagerInProgress_list: [],

        // 진행 중인 것을 중요표시 
        changeImportanceTrue(taskNum){
            this.$axios({
                url: 'http://localhost:3000/taskImportance',
                method: 'post',
                data: {
                    task_num: taskNum, 
                    importance: true
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                console.log("main changeImportanceInProgress then");
                this.$router.go();
                // const taskToFind = this.taskInProgress_list.find(function(item){return item.task_num === taskNum});
                // console.log("changeImportanceInProgress taskToFind: " + taskToFind);
                // const indexToDelete = this.taskInProgress_list.indexOf(taskToFind);
                // this.taskInProgress_list.splice(indexToDelete,1);
                // taskToFind.importance = true;
                // this.taskImportant_list.push(taskToFind);
            }).catch(err => {
                console.log("main changeImportanceInProgress catch");
            });  
        },
        date_ascending(a, b) {
            var dateA = new Date(a['end_date']).getTime();
            var dateB = new Date(b['end_date']).getTime();
            return dateA > dateB ? 1 : -1;
        },
        // changeImportanceManagerInProgress(taskNum){
        //     this.importance = true;

        //     this.$axios({
        //         url: 'http://localhost:3000/taskImportance',
        //         method: 'post',
        //         data: {
        //             task_num: taskNum, 
        //             importance: this.importance
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: "same-origin"
        //     }).then(res => {
        //         console.log("main changeImportanceInProgress then");
        //         const taskToFind = this.taskManagerInProgress_list.find(function(item){return item.task_num === taskNum});
        //         console.log("taskToFind: " + taskToFind);
        //         const indexToDelete = this.taskManagerInProgress_list.indexOf(taskToFind);
        //         this.taskManagerInProgress_list.splice(indexToDelete,1);
        //         taskToFind.complete_date = complete_date;
        //         this.taskComplete_list.push(taskToFind);
        //     // taskManagerImportant_list: [],  // task_manager
        //     // taskManagerInProgress_list: [], // task_manager
        //     // taskComplete_list: [],          // task_complete
        //     }).catch(err => {
        //         console.log("main changeImportanceInProgress catch");
        //     });  
        // },
        changeImportanceFalse(taskNum){
            this.$axios({
                url: 'http://localhost:3000/taskImportance',
                method: 'post',
                data: {
                    task_num: taskNum, 
                    importance: false
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                console.log("main changeImportanceImportant then");
                this.$router.go();
                // const taskToFind = this.taskManagerInProgress_list.find(function(item){return item.task_num === taskNum});
                // console.log("taskToFind: " + taskToFind);
                // const indexToDelete = this.taskManagerInProgress_list.indexOf(taskToFind);
                // this.taskManagerInProgress_list.splice(indexToDelete,1);
                // taskToFind.complete_date = complete_date;
                // this.taskComplete_list.push(taskToFind);
            // taskManagerImportant_list: [],  // task_manager
            // taskManagerInProgress_list: [], // task_manager
            // taskComplete_list: [],          // task_complete
            }).catch(err => {
                console.log("main changeImportanceImportant catch");
            });  
        },
        deleteTask(taskNum, taskName){
            console.log("main deleteTask")
            this.deleteTaskName = taskName;
            this.deleteTaskNum = taskNum;
            this.dialogVisible = true;
        },
        deleteConfirm(){
            this.$axios({
                url: 'http://localhost:3000/deleteTask',
                method: 'post',
                data: {
                    task_num: this.deleteTaskNum, 
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result){
                    console.log("main deleteConfirm then");
                    this.dialogVisible = false;
                    this.$router.go();
                }
              
                // const taskToFind = this.taskManagerInProgress_list.find(function(item){return item.task_num === taskNum});
                // console.log("taskToFind: " + taskToFind);
                // const indexToDelete = this.taskManagerInProgress_list.indexOf(taskToFind);
                // this.taskManagerInProgress_list.splice(indexToDelete,1);
                // taskToFind.complete_date = complete_date;
                // this.taskComplete_list.push(taskToFind);
            // taskManagerImportant_list: [],  // task_manager
            // taskManagerInProgress_list: [], // task_manager
            // taskComplete_list: [],          // task_complete
            }).catch(err => {
                console.log("main deleteConfirm catch");
            });  
        },
        modifyTask(taskNum){
            console.log("main modifyTask")

            this.$router.push({
                name: 'modifyTask', 
                params: {taskNum: taskNum}
            })
        },
        // handleClose(done) {
        //     this.$confirm('Are you sure to close this dialog?')
        //     .then(_ => {
        //         done();
        //     })
        //     .catch(_ => {});
        // }   
        // changeImportanceManagerImportant(taskNum){
        //     this.importance = false;

        //     this.$axios({
        //         url: 'http://localhost:3000/taskImportance',
        //         method: 'post',
        //         data: {
        //             task_num: taskNum, 
        //             importance: this.importance
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: "same-origin"
        //     }).then(res => {
        //         console.log("main changeImportanceImportant then");
        //         const taskToFind = this.taskManagerInProgress_list.find(function(item){return item.task_num === taskNum});
        //         console.log("taskToFind: " + taskToFind);
        //         const indexToDelete = this.taskManagerInProgress_list.indexOf(taskToFind);
        //         this.taskManagerInProgress_list.splice(indexToDelete,1);
        //         taskToFind.complete_date = complete_date;
        //         this.taskComplete_list.push(taskToFind);
        //     // taskManagerImportant_list: [],  // task_manager
        //     // taskManagerInProgress_list: [], // task_manager
        //     // taskComplete_list: [],          // task_complete
        //     }).catch(err => {
        //         console.log("main changeImportanceImportant catch");
        //     });  
        // }
    },
}
</script>

<style scoped>
.custom-icon {
   font-size: 1.5rem;
   padding: 10px;
}

/* .el-button{
    padding: 0px;
} */

.label{
    /* font-weight: bolder; */
    font-size: 1.1rem;
    color: #585858;
    margin-top: 70px;
    margin-bottom: 20px;
}
/* 
.el-input__inner{
    border-radius: 0px;
} */

#enroll-task{
    padding: 0px;
    float: right; 
    width: 50px; 
    height: 50px;
}

#enroll-task:focus{
    opacity: 1 !important;
    background-color: #909399;
}

#enroll-task:hover{
    opacity: 1 !important;
    background-color: #a6a9ad;
}

.noTask{
    text-align: left;
    color: #909399;
}

.label_title{
    font-weight: bold; 
    font-size: 1.1em; 
    margin-bottom: 30px;
}
/* 여기부터
.text-overflow{
    text-overflow: ellipsis; 
    overflow: hidden; 
    white-space: nowrap;
    margin: 2px;
}  */
</style>