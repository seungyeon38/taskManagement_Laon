<template>
    <task v-on:clickTask="clickTask" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">
        <template slot="card_header"> 
            <tr>
                <td align="right">
                    <div style="margin-top: 5px;">
                    </div>
                    <button type="button" v-bind:style="star_style" class="el-icon-star-off" style="border: none; padding: 0px; background: none; font-size:1.7em;" @click.stop="changeStar"></button>
                    <!-- <button type="button" style="border: none; padding: 0px; background: none;" @click.stop="changeStar">
                        <img :src="star" style="width: 25px; height: 25px;"/>
                    </button> -->
                    <!-- <el-button type="button" @click.stop="centerDialogVisible = true" style="border: none; padding: 0px; background: none;">                        
                        <i id="edit_btn" class="el-icon-setting" style="margin-right: 3px; font-size: 1.9em;"></i>
                    </el-button> -->
                    <el-dropdown size="medium">
                        <i id="edit_btn" class="el-icon-setting" style="margin-right: 3px; font-size: 1.9em;"></i>
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
            <el-button id="complete_btn" size="small" @click.stop.native="complete" style="margin-top: 10px; border-radius: 0px; width: 100px; height: 30px;">완료</el-button>
            <!-- <el-button id="delete_btn" size="small" @click.stop.native="complete" style="margin-top: 10px; border-radius: 0px; width: 80px; height: 30px;">완료</el-button> -->
        </template>
    </task>
</template>

<script>
import Task from './Task.vue'

const onColor = '#f8da2d';
const offColor = '#636363';

export default{
    data(){
        return{
            // star: ''
            star_style: {
                color: ''
            },
        }
    },
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'label_color', 'importance'],
    methods: {
        complete(){
            this.$emit('complete', this.task_num);
        },
        clickTask(taskNum){
            console.log("Task_manager taskNum: " + taskNum)
            this.$emit('clickTask', taskNum);
        },
        changeStar(){            
            // if(this.star_style.color == '#636363'){
            //     this.star_style.color = 'orange';
            // }
            // else if(this.star_style.color == 'orange'){
            //     this.star_style.color = '#636363';
            // }
            // if(this.star == require('../img/star.png')){
            //     this.star = require('../img/star_color.png');
            // }
            // else if(this.star == require('../img/star_color.png')){
            //     this.star = require('../img/star.png');
            // }
            // alert("눌렀습니다.")
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
            alert("taskModify")
        },
        taskDelete(){
            this.$emit('deleteTask', this.task_num, this.task_name);
            // this.dialogVisible = true;
        }
    },
    created(){
        if(this.importance == true){
            console.log("Task_manager importance true")
            // this.star = require('../img/star_color.png');
            this.star_style.color = onColor
        }
        else if(this.importance == false){
            console.log("Task_manager importance false")
            // this.star = require('../img/star.png');
            this.star_style.color = offColor
        }
    }
}
</script>

<style scoped>
    #edit_btn{
        color: #636363
    }
</style>