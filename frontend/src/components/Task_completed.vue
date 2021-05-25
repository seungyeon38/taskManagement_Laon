<template>
    <task v-on:clickTask="clickTask" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :completed_date="completed_date" :label_color="label_color">
        <tr slot="completed_date" style="border-top: 1px solid #909399;">
            <td class="border_right bold">완료일</td>
            <td class="date_font_size" style="color: #585858;">
                <div>{{this.$moment(completed_date).format('YYYY/MM/DD')}}</div> 
                <div>{{this.$moment(completed_date).format(`h${": "}mm A`)}}</div>
            </td>
        </tr>
    </task>
</template>

<script>
import Task from './Task.vue'

export default{
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'completed_date', 'label_color'],
    methods: {
        clickTask(taskNum){
            this.$emit('clickTask', taskNum);
        }   
    }
}
</script>

<style scoped>
</style>

