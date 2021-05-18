<template>
    <task id="closedTask" v-on:clickTask="clickTask" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">
    </task>
</template>

<script>
import Task from './Task.vue'

export default{
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'label_color'],
    methods: {
        clickTask(taskNum){
            this.$emit('clickTask', taskNum);
        }   
    }
}
</script>


<style scoped>
#closedTask{
    background-color: #f8f8f8;
    border: 1px solid #8b8b8b; 
    width: 210px; 
    height: 270px;
    border-spacing: 0px; 
    display: inline-block; 
    margin-right: 50px; 
    margin-top: 30px; 
    box-shadow: 1px 1px #dadada;
    border-radius: 3px;
}
</style>