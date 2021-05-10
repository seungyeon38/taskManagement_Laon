<template>
    <task v-on:clickTask="clickTask" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color">
        <!-- 완료(마감)일 -->
        <!-- <tr slot="complete_date" style="border-top: 1px solid #909399;">
            <td style="border-right: 1px solid #909399;">완료일</td>
            <td>2021/04/06</td>
        </tr> -->

        <!-- <tr slot="complete_date" style="border-top: 1px solid #909399;">
            <td class="border_right bold">완료일</td>
            <td>
                <div>{{this.$moment(complete_date).format('YYYY/MM/DD')}}</div> 
            </td>
        </tr> -->
    </task>
</template>

<script>
import Task from './Task.vue'

export default{
    data(){
        return{
            // closed_backgroundColor: {backgroundColor: "#929292"},
        }
    },
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'label_color'],
    methods: {
        clickTask(taskNum){
            console.log("Task_closed taskNum: " + taskNum)
            this.$emit('clickTask', taskNum);
        }   
    }
}
</script>
