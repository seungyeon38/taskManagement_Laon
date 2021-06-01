<template>
    <task v-on:clickTask="clickTask" class="white" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color" :inProgress="true">
        <template slot="card_header"> 
            <tr>
                <td align="right">
                    <div style="margin-top: 5px;">
                    </div>
                    <button type="button" :style="star_style" id="star" class="el-icon-star-off" style="border: none; padding: 0px; background: none; font-size:1.7em;" @click.stop="changeImportance"></button>
                    <el-dropdown size="medium">
                        <i id="edit_btn" class="el-icon-setting" style="margin-right: 3px; font-size: 1.9em;" @click.stop></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-edit" @click.stop.native="taskModify"> 수정</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-delete" @click.stop.native="taskDelete"> 삭제</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </td>
            </tr>
            <tr>
                <td id="taskName" class="text-overflow">
                    {{task_name}}
                </td>
            </tr>
        </template>
        <template slot="btn"> 
            <el-button class="btn" size="small" @click.stop.native="completeTask" style="margin-top: 10px; border-radius: 0px; width: 100px; height: 30px;">완료</el-button>
        </template>
    </task>
</template>

<script>
import Task from './Task.vue'

const onColor = '#f8da2d';
const offColor = '#888888';

export default{
    data(){
        return{
            star_style: {
                color: ''
            },
        }
    },
    components: {
        Task
    },
    props: {
        task_num: Number,
        task_name: String, 
        manager: String, 
        start_date: String, 
        end_date: String, 
        label_color: String,
        importance: Boolean
    },
    methods: {
        completeTask(){
            this.$emit('completeTask', this.task_num, this.task_name);
        },
        clickTask(taskNum){
            this.$emit('clickTask', taskNum);
        },
        changeImportance(){        
            this.$emit('changeImportance', this.task_num);

            setTimeout(function() {
                if(this.star_style.color == offColor){
                    this.star_style.color = onColor;
                }
                else if(this.star_style.color == onColor){
                    this.star_style.color = offColor;
                }
            }, 5);
        },
        taskModify(){
            this.$emit('modifyTask', this.task_num);
        },
        taskDelete(){
            this.$emit('deleteTask', this.task_num, this.task_name);
        }
    },
    created(){
        if(this.importance == true){
            this.star_style.color = onColor;
        }
        else if(this.importance == false){
            this.star_style.color = offColor;
        }
    }
}
</script>

<style scoped>
    .white{
        background-color: white !important;
    }

    #edit_btn{
        color: #888888; 
    }

    #edit_btn:hover{
        color: #646464; 
    }
</style>