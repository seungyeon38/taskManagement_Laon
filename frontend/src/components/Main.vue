<template>
    <base-layout>
        <template v-slot:main>
            <table style="width: 100%">
                <tr>
                    <td colspan="2" align="right">
                        <el-button class="enroll-task custom-icon" @click.native="enrollTask" icon="el-icon-plus" type="info"></el-button>
                        <el-dialog title="업무 완료 확인" :visible.sync="completeDialogVisible" width="40%" style="text-align: left; font-weight: bolder;">
                            <span v-if="allDone">해당 업무('{{completedTaskName}}')를 완료상태로 전환하시겠습니까?</span>
                            <span v-else>아직 체크리스트를 완료하지 않았습니다. 해당 업무('{{completedTaskName}}')를 완료상태로 전환하시겠습니까?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button class="btn" @click="completeDialogVisible = false">취소</el-button>
                                <el-button class="btn2" type="primary" @click.native="completeConfirm">확인</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog title="업무 삭제" :visible.sync="deleteDialogVisible" width="30%" style="text-align: left; font-weight: bolder;">
                            <div>업무 삭제시, 모든 실무담당자에게서 해당 업무가 삭제됩니다.</div> 
                            <div>해당 업무('{{deleteTaskName}}')를 삭제하시겠습니까?</div>
                            <span slot="footer" class="dialog-footer">
                                <el-button class="btn" @click="deleteDialogVisible = false">취소</el-button>
                                <el-button class="btn2" type="primary" @click.native="deleteConfirm">확인</el-button>
                            </span>
                        </el-dialog>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="left">
                        <div style="height: 20px;"></div>
                        <div class="label">중요 업무</div>
                    </td>
                </tr>
                <tr>
                    <td>
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
                </tr>
                <tr>
                    <td>
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
                </tr>
                <tr>
                    <td>
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
                </tr>
                <tr>
                    <td>
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
            <div style="margin-bottom: 10px;">
                <el-select v-model="taskSelectOption" placeholder="옵션 선택" style="width: 200px;">
                    <el-option :value="1" :label="'일주일 내 '"></el-option>
                    <el-option :value="2" :label="'한 달 내'"></el-option>
                    <el-option :value="3" :label="'직접 설정'"></el-option>
                </el-select>
            </div>
            <div v-if="taskSelectOption == 3">
                <input v-model="first_date" type="date" @change="setFirstDate" />
                <input v-model="second_date" type="date" :min="first_date" @change="setSecondDate" />
            </div>
            <div style="margin-bottom: 20px;"></div>
            <div v-if="filteredTasks.length">
                <filtered-task v-for="task in filteredTasks" :key="task.task_num" v-on:clickTask="clickTask" :task_num="task.task_num" :task_name="task.task_name" :manager="task.name" :start_date="task.start_date" :end_date="task.end_date" :label_color="task.label_color"></filtered-task>
            </div>
            <div v-else class="noTask">
                (해당하는 업무가 없습니다.) 
            </div>
        </template>

    </base-layout>
</template>

<script>
import Task from './Task.vue'
import TaskCompleted from './Task_completed.vue'
import TaskInProgress from './Task_inProgress.vue'
import TaskManager from './Task_manager.vue'
import FilteredTask from './FilteredTask.vue'
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
            filteredTasks: [],     // 마감이나 완료되지 않은 것 중
            sort: '',
            dialogFormVisible: false,
            formLabelWidth: '200px',
            deleteDialogVisible: false,
            deleteTaskName: '',
            deleteTaskNum: null,
            completeDialogVisible: false,
            completedTaskName: '',
            completedTaskNum: null,
            allDone: false,
            taskSelectOption: 1,
            first_date: '',
            second_date: ''
        }
    },
    components: {
        Task,
        TaskCompleted,
        TaskInProgress,
        TaskManager,
        BaseLayout,
        FilteredTask
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

            for(var i=0; i<res.data.tasks_worker.length; i++){
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

            this.thisWeekTasks();

        }).catch(err => {
            console.log("err: " + err);
        });
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
            this.completedTaskName = taskName;
            this.completedTaskNum = taskNum;

            this.$axios({
                url: `http://localhost:3000/tasks/${this.completedTaskNum}/checklists/allComplete`,
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
                if(res.data.result == true){
                    this.$router.go();
                }
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
        thisWeekTasks(){
            const weekAfter = this.$moment().add(7, 'd').format()

            for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                if(this.taskManagerInProgress_list[i].end_date < weekAfter){
                    this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                }
            }
            for(var i=0; i<this.taskInProgress_list.length; i++){
                if(this.taskInProgress_list[i].end_date < weekAfter){
                    this.filteredTasks.push(this.taskInProgress_list[i]);
                }
            }

            this.filteredTasks.sort(this.date_ascending);
        },
        thisMonthTasks(){
            const weekAfter = this.$moment().add(1, 'M').format();

            for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                if(this.taskManagerInProgress_list[i].end_date <= weekAfter){
                    this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                }
            }
            for(var i=0; i<this.taskInProgress_list.length; i++){
                if(this.taskInProgress_list[i].end_date <= weekAfter){
                    this.filteredTasks.push(this.taskInProgress_list[i]);
                }
            }

            this.filteredTasks.sort(this.date_ascending);
        },
        setFirstDate(){
            this.filteredTasks = [];
            if(this.second_date){
                for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                    if(this.first_date <= this.taskManagerInProgress_list[i].start_date && this.taskManagerInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                    }
                }
                for(var i=0; i<this.taskInProgress_list.length; i++){
                    if(this.first_date <= this.taskInProgress_list[i].start_date && this.taskInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskInProgress_list[i]);
                    }
                }
            }

            else{
                 for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                    if(this.first_date <= this.taskManagerInProgress_list[i].start_date){
                        this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                    }
                }
                for(var i=0; i<this.taskInProgress_list.length; i++){
                    if(this.first_date <= this.taskInProgress_list[i].start_date){
                        this.filteredTasks.push(this.taskInProgress_list[i]);
                    }
                }
            }

            this.filteredTasks.sort(this.date_ascending);
        },
        setSecondDate(){
            this.filteredTasks = [];

            if(this.first_date){
                for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                    if(this.first_date <= this.taskManagerInProgress_list[i].start_date && this.taskManagerInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                    }
                }
                for(var i=0; i<this.taskInProgress_list.length; i++){
                    if(this.first_date <= this.taskInProgress_list[i].start_date && this.taskInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskInProgress_list[i]);
                    }
                }
            }
            else{
                for(var i=0; i<this.taskManagerInProgress_list.length; i++){
                    if(this.taskManagerInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskManagerInProgress_list[i]);
                    }
                }
                for(var i=0; i<this.taskInProgress_list.length; i++){
                    if(this.taskInProgress_list[i].end_date <= this.second_date){
                        this.filteredTasks.push(this.taskInProgress_list[i]);
                    }
                }
            }
            
            this.filteredTasks.sort(this.date_ascending);
        }
    },
    watch: {
        taskSelectOption: function(val){
            this.filteredTasks = [];
            this.first_date = '';
            this.second_date = '';

            if(val == 1){
                this.thisWeekTasks();
            }
            else if(val == 2){
                this.thisMonthTasks();
            }
        }
    }
}
</script>

<style scoped>
.custom-icon {
   font-size: 1.5rem;
   padding: 10px;
}

.label{
    font-size: 1.1rem;
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

#enroll-task:hover{
    opacity: 1 !important;
    background-color: #acb2bd;
}

.noTask{
    text-align: left;
    color: #C0C4CC;
}

.label_title{
    font-size: 1.1em; 
    margin-bottom: 30px;
}


hr {
    width: 80%;
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc); 
}

input[type="date"]{
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    width: 45%;
    outline: 0;
    padding: 0 5px;
    text-rendering: auto;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    text-align: start;
    -webkit-rtl-ordering: logical;
    cursor: text;
    margin: 0em;
    font: 400 13.3333px Arial;
}

input[type="date"]:disabled {
    background: #c2c2c2;
}

input[type="date" i]{
    font-family: inherit !important;
}

</style>