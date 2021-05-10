<template>
    <task v-on:clickTask="clickTask" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">
        <template slot="card_header"> 
            <tr>
                <td align="right">
                    <button type="button" style="border: none; padding: 0px; margin-top: 5px; margin-right: 5px; background: none;" @click.stop="changeStar">
                        <img :src="star" style=" width: 30px; height: 30px;" />
                    </button>
                </td>
            </tr>
            <tr>
                <td class="text-overflow-twoLine"  style="padding-left: 15px; padding-right: 15px; font-weight: bolder;">
                        {{task_name}}
                </td>
                <div style="margin-bottom: 10px;"></div>
            </tr>
        </template>
        <el-button id="complete_btn" slot="complete_btn" size="small" @click.stop.native="complete" style="margin-top: 10px; border-radius: 0px; width: 100px; height: 30px;">완료</el-button>
    </task>
</template>

<script>
import Task from './Task.vue'

export default{
    data(){
        return{
            star: ''
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
            if(this.star == require('../img/star.png')){
                this.star = require('../img/star_color.png');
            }
            else if(this.star == require('../img/star_color.png')){
                this.star = require('../img/star.png');
            }
            // alert("눌렀습니다.")
            this.$emit('changeImportance', this.task_num);
        }      
    },
    created(){
        if(this.importance == true){
            console.log("Task_manager importance true")
            this.star = require('../img/star_color.png');
        }
        else if(this.importance == false){
            console.log("Task_manager importance false")
            this.star = require('../img/star.png');
        }
        
    }
}
</script>

<style scoped>
    .text-overflow-twoLine{
        display: -webkit-box;
        overflow: hidden;
        height: 40px;
        text-overflow: ellipsis; 
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break:break-all;
    }
</style>