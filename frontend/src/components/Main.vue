<template>
    <base-layout>
        <template v-slot:main>
            <table style="width: 100%">
                <tr>
                    <td colspan="2" align="right">
                        <el-button class="enroll-task custom-icon" @click.native="enrollTask" icon="el-icon-plus" type="info"></el-button>
                        <el-dialog title="업무 완료 확인" :visible.sync="completeDialogVisible" width="30%" style="text-align: left; font-weight: bolder;">
                            <span v-if="allDone">해당 업무('{{completedTaskName}}')를 완료상태로 전환하시겠습니까?</span>
                            <span v-else>아직 체크리스트를 완료하지 않았습니다. 해당 업무('{{completedTaskName}}')를 완료상태로 전환하시겠습니까?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="completeDialogVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="completeConfirm">Confirm</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog title="업무 삭제" :visible.sync="deleteDialogVisible" width="30%" style="text-align: left; font-weight: bolder;">
                            <span>해당 업무('{{deleteTaskName}}')를 삭제하시겠습니까?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteDialogVisible = false">Cancel</el-button>
                                <el-button type="primary" @click.native="deleteConfirm">Confirm</el-button>
                            </span>
                        </el-dialog>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="left">
                        <div style="height: 20px;"></div>
                        <div class="label">중요 업무</div>
                        <hr align= "left"/>
                    </td>
                </tr>
                <tr v-if="taskManagerImportant_list.length || taskImportant_list.length">
                    <task-manager v-for="task in taskManagerImportant_list" :key="task.task_num" v-on:completeTask="completeTask" v-on:clickTask="clickTask" v-on:changeImportance="changeImportance" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
                    <task-in-progress v-for="task in taskImportant_list" :key="task.task_num" v-on:clickTask="clickTask" v-on:changeImportance="changeImportance" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-in-progress>
                </tr>
                <tr v-else>
                    <div class="noTask">(중요 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td align="left">
                        <div class="label">진행 중인 업무</div>
                    </td>
                    <td align="right" valign="bottom">
                        <el-select v-model="sort" @change.native="sortProgressTask($event)" placeholder="정렬방법" style="width: 200px;">
                            <el-option :value="1">등록일 오름차순</el-option>
                            <el-option :value="2">등록일 내림차순</el-option>
                            <el-option :value="3">시작일 오름차순</el-option>
                            <el-option :value="4">시작일 내림차순</el-option>
                            <el-option :value="5">마감일 오름차순</el-option>
                            <el-option :value="6">마감일 오름차순</el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <hr align= "left"/>
                    </td>
                </tr>
                <tr v-if="taskManagerInProgress_list.length || taskInProgress_list.length">
                    <task-manager v-for="task in taskManagerInProgress_list" :key="task.task_num" v-on:completeTask="completeTask" v-on:clickTask="clickTask" v-on:changeImportance="changeImportance" v-on:deleteTask="deleteTask" v-on:modifyTask="modifyTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-manager>
                    <task-in-progress v-for="task in taskInProgress_list" :key="task.task_num" v-on:clickTask="clickTask" v-on:changeImportance="changeImportance" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color" :importance="task.importance"></task-in-progress>
                </tr>
                <tr v-else>
                    <div class="noTask">(진행 중인 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td align="left">
                        <div class="label">마감된 업무</div>
                    </td>
                    <td align="right" valign="bottom">
                        <el-select v-model="sort" @change.native="sortClosedTask($event)" placeholder="정렬방법" style="width: 200px;">
                            <el-option :value="1">최근 일주일내</el-option>
                            <el-option :value="2">최근 한달내</el-option>
                            <el-option :value="3">완료일 오름차순</el-option>
                            <el-option :value="4">완료일 내림차순</el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <hr align= "left"/>
                    </td>
                </tr>
                <tr v-if="taskClosed_list.length">
                    <task v-for="task in taskClosed_list" :key="task.task_num" v-on:clickTask="clickTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></task>
                </tr>
                <tr v-else>
                    <div class="noTask">(마감된 업무가 없습니다.)</div>
                </tr>
                <tr>
                    <td align="left">
                        <div class="label">완료된 업무</div>
                    </td>
                    <td align="right" valign="bottom">
                        <el-select v-model="sort" @change.native="sortCompletedTask($event)" placeholder="정렬방법" style="width: 200px;">
                            <el-option :value="1">최근 일주일내</el-option>
                            <el-option :value="2">최근 한달내</el-option>
                            <el-option :value="3">완료일 오름차순</el-option>
                            <el-option :value="4">완료일 내림차순</el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <hr align= "left"/>
                    </td>
                </tr>
                <tr v-if="taskCompleted_list.length">
                    <task-completed v-for="task in taskCompleted_list" :key="task.task_num" v-on:clickTask="clickTask" :task_name="task.task_name" :task_num="task.task_num" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :completed_date="task.completed_date" :label_color="task.label_color"></task-completed>
                </tr>
                <tr v-else>
                    <div class="noTask">(완료된 업무가 없습니다.)</div>
                </tr>
            </table>
        </template>
        <template v-slot:aside>
            
            <div class="label_title">이번주 업무</div>
            <div v-if="tasks_thisWeek.length">
                <this-week-task v-for="task in tasks_thisWeek" :key="task.task_num" :task_name="task.task_name" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></this-week-task>
            </div>
            <div v-else class="noTask">
                (이번주에 완료해야할 업무가 없습니다.) 
            </div>
        </template>

    </base-layout>
</template>

<script>
import Task from './Task.vue'
// import TaskClosed from './Task_closed.vue'
import TaskCompleted from './Task_completed.vue'
import TaskInProgress from './Task_inProgress.vue'
import TaskManager from './Task_manager.vue'
import ThisWeekTask from './ThisWeekTask.vue'
import BaseLayout from '../components/BaseLayout.vue'


export default {
    data(){
        return{
            taskImportant_list: [],         // task_inProgress
            taskManagerImportant_list: [],  // task_manager
            taskCompleted_list: [],          // task_completed
            taskClosed_list: [],            // task_completed(색은 조금더 어둡게 했으면 좋겠음)
            taskInProgress_list: [],        // task_inProgress
            taskManagerInProgress_list: [], // task_manager
            tasks_thisWeek: [],  // 마감이나 완료되지 않은 것 중에 마감일이 일주일 이내로 남은 업무들
            sort: '',
            dialogFormVisible: false,
            formLabelWidth: '200px',
            deleteDialogVisible: false,
            deleteTaskName: '',
            deleteTaskNum: null,
            completeDialogVisible: false,
            completedTaskName: '',
            completedTaskNum: null,
            allDone: false
        }
    },
    components: {
        Task,
        // TaskClosed,
        TaskCompleted,
        TaskInProgress,
        TaskManager,
        BaseLayout,
        ThisWeekTask
        
    },
    created(){
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
            // console.log("http://localhost:3000/tasks res.data: " + JSON.stringify(res.data));
            for(var i=0; i<res.data.tasks_worker.length; i++){
                // complete을 넣을지 complete_date가 null이 아닌 경우를 할지는 고민 
                if(res.data.tasks_worker[i].completed == true){
                    this.taskCompleted_list.push(res.data.tasks_worker[i])
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
                console.log("main res.data.tasks_manager[i]: " + JSON.stringify(res.data.tasks_manager[i]));

                if(res.data.tasks_manager[i].completed == true){
                    this.taskCompleted_list.push(res.data.tasks_manager[i])
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

        }).catch(err => {
            console.log("err: " + err);
        });
    //     })
    },
    methods: {
        cancelEnroll(){
            this.form.detailTask_name = '';
            this.form.detailTask_content = '';
        },

        enrollTask(){
            this.$router.push({name: 'enrollTask'});
        },

        completeTask(taskNum, taskName){            
            console.log("parent complete function")
            console.log("taskNum: " + taskNum)
            console.log("taskName: " + taskName)
            
            this.completedTaskName = taskName;
            this.completedTaskNum = taskNum;

            this.$axios({
                url: `http://localhost:3000/tasks/${this.completedTaskNum}/checklists/complete`,
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result == true){
                    this.allDone = true;
                }
            }).catch(err => {
                console.log("err: " + err);
            });
            
            console.log("이것");
            this.completeDialogVisible = true;
        },
        completeConfirm(){
            this.$axios({
                url: `http://localhost:3000/tasks/${this.completedTaskNum}/complete`,
                method: 'post',
                data: {
                    completed_date: this.$moment().format('YYYY-MM-DDTHH:mm')
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                if(res.data.result){
                    this.completeDialogVisible = false;
                    this.$router.go();
                    // setTimeout(this.$router.go(), 1000);
                }
            }).catch(err => {
                console.log("err: " + err);
            });  
        },
        clickTask(taskNum){
            this.$router.push({
                name: 'showDetail', 
                params: {taskNum: taskNum}
            })
        },

        sortProgressTask(event){
            // <el-option :value="1">등록일 오름차순</el-option>
            // <el-option :value="2">등록일 내림차순</el-option>
            // <el-option :value="3">시작일 오름차순</el-option>
            // <el-option :value="4">시작일 내림차순</el-option>
            // <el-option :value="5">마감일 오름차순</el-option>
            // <el-option :value="6">마감일 오름차순</el-option>
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
        
        sortClosedTask(event){
            if(event.target.value == 1){

            }
            else if(event.target.value == 2){

            }
            else if(event.target.value == 3){

            }
            else if(event.target.value == 4){

            }
        },

        sortCompletedTask(event){
            if(event.target.value == 1){

            }
            else if(event.target.value == 2){

            }
            else if(event.target.value == 3){

            }
            else if(event.target.value == 4){

            }
        },

        // 진행 중인 것을 중요표시 
        changeImportance(taskNum){
            this.$axios({
                url: `http://localhost:3000/tasks/${taskNum}/importance`,
                method: 'post',
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

        deleteTask(taskNum, taskName){
            this.deleteTaskName = taskName;
            this.deleteTaskNum = taskNum;
            this.deleteDialogVisible = true;
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
                    this.deleteDialogVisible = false;
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
    /* color: #606266; */
    margin-top: 70px;
    margin-bottom: 20px;
}

#enroll-task{
    padding: 0px;
    float: right; 
    width: 50px; 
    height: 50px;
    background-color: #b0b8c4;
    border: none;
}

/* #enroll-task:focus{
    opacity: 1 !important;
    background-color: #acb2bd;
} */

#enroll-task:hover{
    opacity: 1 !important;
    /* background-color: #a6a9ad; */
    background-color: #acb2bd;
}

.noTask{
    text-align: left;
    color: #C0C4CC;
}

.label_title{
    /* font-weight: bold;  */
    font-size: 1.1em; 
    margin-bottom: 30px;
    /* color: #585858; */
}


hr {
    width: 80%;

    /* border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0)); */

    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc); 
    /* border: 1px solid #a8a8a8; */
}
</style>