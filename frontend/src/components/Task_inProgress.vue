<template>
    <task v-on:clickTask="clickTask" class="white" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color" :inProgress="true">  
        <template slot="card_header">
            <tr>
                <td align="right">
                    <div style="margin-top: 5px;">
                    </div>
                    <button type="button" :style="star_style" id="star" class="el-icon-star-off" style="border: none; padding: 0px; background: none; font-size:1.7em; margin-right: 5px;" @click.stop="changeStar"></button>
                </td>
            </tr>
            <tr>
                <td id="taskName" class="text-overflow">
                    {{task_name}}
                </td>
            </tr> 
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
            }
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
        importance: Number
    },
    methods: {
        clickTask(taskNum){
            console.log("Task_inProgress taskNum: " + taskNum)
            this.$emit('clickTask', taskNum);
        },
        changeStar(){
            this.$emit('changeImportance', this.task_num);
            
            setTimeout(function() {
                 if(this.star_style.color == offColor){
                    this.star_style.color = onColor;
                }
                else if(this.star_style.color == onColor){
                    this.star_style.color = offColor;
                }
            }, 5);
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
</style>