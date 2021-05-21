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
                    </td>
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
                    <task-manager v-for="task in taskManagerImportant_list" :key="task.task_num" v-on:completeTask="completeTask" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceFalse" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
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
                    <task-manager v-for="task in taskManagerInProgress_list" :key="task.task_num" v-on:completeTask="completeTask" v-on:clickTask="clickTask" v-on:changeImportance="changeImportanceTrue" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
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
                </tr>
                <tr v-if="taskComplete_list.length">
                    <task-complete v-for="task in taskComplete_list" :key="task.task_num" v-on:clickTask="clickTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.manager" :start_date="task.start_date" :end_date="task.end_date" :complete_date="task.complete_date" :label_color="task.label_color"></task-complete>
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


export default {
    data(){
        return{
            userNum: null,
            taskImportant_list: [],         // task_inProgress
            taskManagerImportant_list: [],  // task_manager
            taskComplete_list: [],          // task_complete
            taskClosed_list: [],            // task_complete(색은 조금더 어둡게 했으면 좋겠음)
            taskInProgress_list: [],        // task_inProgress
            taskManagerInProgress_list: [], // task_manager
            tasks_thisWeek: [],  // 마감이나 완료되지 않은 것 중에 마감일이 일주일 이내로 남은 업무들
            managers: {},
            sort: '',
            dialogFormVisible: false,
            formLabelWidth: '200px',
            dialogVisible: false,
            deleteTaskName: '',
            deleteTaskNum: null
        }
    },
    components: {
        TaskClosed,
        TaskComplete,
        TaskInProgress,
        TaskManager,
        BaseLayout,
        ThisWeekTask
        
    },
    created(){
        this.$axios({
            url: 'http://localhost:3000/allManagers',
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
                const now = this.$moment().format();

                for(var i=0; i<res.data.tasks_worker.length; i++){
                    res.data.tasks_worker[i].manager = this.getManagerName(res.data.tasks_worker[i].manager);

                    // complete을 넣을지 complete_date가 null이 아닌 경우를 할지는 고민 
                    if(res.data.tasks_worker[i].complete == true){
                        this.taskComplete_list.push(res.data.tasks_worker[i])
                    }
                    else if(res.data.tasks_worker[i].end_date < now){
                        this.taskClosed_list.push(res.data.tasks_worker[i])
                    }
                    else if(res.data.tasks_worker[i].importance == true){
                        this.taskImportant_list.push(res.data.tasks_worker[i])
                        this.taskInProgress_list.push(res.data.tasks_worker[i])
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
                        this.taskManagerInProgress_list.push(res.data.tasks_manager[i])
                    }
                    else{
                        this.taskManagerInProgress_list.push(res.data.tasks_manager[i])
                    }
                };
                
                // console.log("taskImportant_list")
                // console.log(this.taskImportant_list)
                // console.log("taskManagerImportant_list")
                // console.log(this.taskManagerImportant_list)
                // console.log("taskComplete_list")
                // console.log(this.taskComplete_list)
                // console.log("taskClosed_list")
                // console.log(this.taskClosed_list)
                // console.log("taskInProgress_list")
                // console.log(this.taskInProgress_list)
                // console.log("taskManagerInProgress_list")
                // console.log(this.taskManagerInProgress_list)

                const weekAfter = this.$moment().add(7, 'days').format()

                // for(var i=0; i<this.taskManagerImportant_list.length; i++){
                //     if(this.taskManagerImportant_list[i].end_date < weekAfter){
                //         this.tasks_thisWeek.push(this.taskManagerImportant_list[i]);
                //     }
                // }
                // for(var i=0; i<this.taskImportant_list.length; i++){
                //     if(this.taskImportant_list[i].end_date < weekAfter){
                //         this.tasks_thisWeek.push(this.taskImportant_list[i]);
                //     }
                // }
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

                this.tasks_thisWeek.sort(this.date_ascending);
                this.userNum = res.data.userNum;

            }).catch(err => {
                console.log("err: " + err);
            });
        })
    },
    methods: {
        getManagerName(managerNum){
            for(var i=0; i<this.managers.length; i++){
                if(this.managers[i].manager == managerNum){
                    return this.managers[i].name;
                }
            }

            return null;
        },
        cancelEnroll(){
            this.form.detailTask_name = '';
            this.form.detailTask_content = '';
        },
        enrollTask(){
            this.$router.push({name: 'enrollTask'});
        },
        completeTask(taskNum){            
            console.log("parent complete function")
            console.log("taskNum: " + taskNum)

            this.$axios({
                url: `http://localhost:3000/tasks/${taskNum}/complete`,
                method: 'post',
                data: {
                    complete_date: this.$moment().format('YYYY-MM-DDTHH:mm')
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result){
                    this.$router.go();
                }
            }).catch(err => {
                console.log("err: " + err);
            });  
        },
        clickTask(taskNum){
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

        // 진행 중인 것을 중요표시 
        changeImportanceTrue(taskNum){
            this.$axios({
                url: 'http://localhost:3000/tasks/importance',
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
                this.$router.go();
            }).catch(err => {
                console.log("err: " + err);
            });  
        },
        date_ascending(a, b) {
            var dateA = new Date(a['end_date']).getTime();
            var dateB = new Date(b['end_date']).getTime();
            return dateA > dateB ? 1 : -1;
        },
        changeImportanceFalse(taskNum){
            this.$axios({
                url: 'http://localhost:3000/tasks/importance',
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
                this.$router.go();
            }).catch(err => {
                console.log("err: " + err);
            });  
        },
        deleteTask(taskNum, taskName){
            this.deleteTaskName = taskName;
            this.deleteTaskNum = taskNum;
            this.dialogVisible = true;
        },
        deleteConfirm(){
            this.$axios({
                url: `http://localhost:3000/tasks/${this.deleteTaskNum}`,
                method: 'delete',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result){
                    this.dialogVisible = false;
                    this.$router.go();
                }
            }).catch(err => {
                console.log("err: " + err);
            });  
        },
        modifyTask(taskNum){
            this.$router.push({
                name: 'modifyTask', 
                params: {taskNum: taskNum}
            })
        },
    },
}
</script>

<style scoped>
.custom-icon {
   font-size: 1.5rem;
   padding: 10px;
}

.label{
    font-size: 1.1rem;
    color: #585858;
    margin-top: 70px;
    margin-bottom: 20px;
}

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
</style>