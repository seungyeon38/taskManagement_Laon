<template>
    <task v-on:clickTask="clickTask" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">
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
</style>