<template>
    <task v-on:clickTask="clickTask" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">  
        <template slot="card_header">
            <tr>
                <td align="right">
                    <div style="margin-top: 5px;">
                    </div>
                    <button type="button" id="star_btn" v-bind:style="star_style" class="el-icon-star-off" style="border: none; padding: 0px; background: none; font-size:1.7em; margin-right: 5px;" @click.stop="changeStar"></button>
                    <!-- <button type="button" style="border: none; padding: 0px; margin-top: 5px; margin-right: 5px; background: none;" @click.stop="changeStar">
                        <img :src="star" style="width: 25px; height: 25px;" />
                    </button> -->
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
const offColor = '#636363';

export default{
    data(){
        return{
            // star: ''
            star_style: {
                color: ''
            }
        }
    },
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'label_color', 'importance'],
    methods: {
        clickTask(taskNum){
            console.log("Task_inProgress taskNum: " + taskNum)
            this.$emit('clickTask', taskNum);
        },
        changeStar(){
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
        }
    },
    created(){
        if(this.importance == true){
            console.log("Task_inProgress importance true")
            // this.star = require('../img/star_color.png');
            this.star_style.color = onColor
        }
        else if(this.importance == false){
            console.log("Task_inProgress importance false")
            // this.star = require('../img/star.png');
            this.star_style.color = offColor
        }
        
    }
}
</script>

<style scoped>
</style>