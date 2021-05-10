<template>
    <task v-on:clickTask="clickTask" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :complete_date="complete_date" :label_color="label_color">
        <!-- 완료(마감)일 -->
        <!-- <tr slot="complete_date" style="border-top: 1px solid #909399;">
            <td style="border-right: 1px solid #909399;">완료일</td>
            <td>2021/04/06</td>
        </tr> -->
        <tr slot="complete_date" style="border-top: 1px solid #909399;">
            <td class="border_right bold">완료일</td>
            <td class="date_font_size">
                <div>{{this.$moment(complete_date).format('YYYY/MM/DD')}}</div> 
                <div>{{this.$moment(complete_date).format(`h${": "}mm A`)}}</div>
            </td>
        </tr>
        <!-- <tr slot="complete_date" style="border-top: 1px solid #909399;">
            <td class="border_right bold">완료일</td>
            <td>
                <div style="font-size: 0.9em;">{{this.$moment(complete_date).format('YYYY/MM/DD')}}</div> 
                <div style="font-size: 0.8em;">{{this.$moment(complete_date).format(`A h${"시 "}mm${"분"}`)}}</div>
            </td>
        </tr> -->
    </task>
</template>

<script>
import Task from './Task.vue'

export default{
    components: {
        Task
    },
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'complete_date', 'label_color'],
    methods: {
        clickTask(taskNum){
            console.log("Task_complete taskNum: " + taskNum)
            this.$emit('clickTask', taskNum);
        }   
    }
}
</script>

