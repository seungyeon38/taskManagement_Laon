<template>
    <table class="task" :task_name="task_name" :task_num="task_num" :manager="manager" :start_date="start_date" :end_date="end_date" :label_color="label_color" @click="clickTask" align="left">
        <tr style="height: 14px;" :style="{backgroundColor: label_color}">
            <td></td>
        </tr>
        <!-- 중요(별), 설정 -->
        <slot name="card_header">
            <tr>
                <!-- 마감이나 완료된 업무 -->
                <td id="taskName" class="text-overflow" style="padding-top: 35px;">
                    {{task_name}}
                </td>
            </tr> 
        </slot>
        <tr>
            <td align="center">
                <table id="info_table" style="text-align: center;">
                    <tr class="border-bottom" style="height: 28px">
                        <td class="border_right bold">관리자</td>
                        <td class="text-overflow" style="width: 95%; line-height:20px; margin: 2px; color: #585858;">{{manager}}</td>
                    </tr>
                    <tr class="border-bottom">
                        <td class="border_right bold">시작일</td>
                        <td class="date_font_size" style="color: #585858;">
                            <div>{{this.$moment(start_date).format('YYYY/MM/DD')}}</div> 
                            <div>{{this.$moment(start_date).format(`h${": "}mm A`)}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="border_right bold">마감일</td>
                        <td class="date_font_size" style="color: #585858;">
                            <div>{{this.$moment(end_date).format('YYYY/MM/DD')}}</div> 
                            <div>{{this.$moment(end_date).format(`h${": "}mm A`)}}</div>
                        </td>
                    </tr>
                    <slot name="complete_date"> 
                    </slot>
                </table> 
                <slot name="btn">
                </slot>
                <div style="margin-bottom: 5px;">
                </div>
            </td>
        </tr>
    </table>

</template>

<script>
export default{
    name: 'task',
    props:['task_name', 'task_num', 'manager', 'start_date', 'end_date', 'label_color', 'inProgress'],
    data(){
        return{
            manager_name: '',
        }
    },
    methods:{
        clickTask(){
            console.log("Task this.task_num: " + this.task_num)
            this.$emit('clickTask', this.task_num);
        },
    }
}
</script>

<style scoped>
    .task{
        border: 1px solid #a8a8a8; 
        width: 210px; 
        height: 270px;
        border-spacing: 0px; 
        display: inline-block; 
        margin-right: 50px; 
        margin-top: 30px; 
        background-color: #fafafa;
        box-shadow: 1px 1px #dadada;
        border-radius: 3px;
    }

    .task:hover{
        box-shadow: 3px 3px #dadada;
    }

    .task:active{
        box-shadow: 3px 3px #e4e4e4;
    }

    .custom-icon {
        font-size: 2rem;
    }

    .el-card{
        border-radius: 2px;
        border: 1px solid #909399;
    }
    
    .el-card__header{
        height: 10px; 
        border-bottom: 1px solid #909399;
        padding: 0px;
        background-color:#95d4b5;
    }

    .el-card__body{
        padding: 0px;
    }

    .box-card {
        width: 180px;
    }

    #info_table{
        width: 90%;
        border: 1px solid #909399;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 0.9em;
    }

    .border_right{
        border-right: 1px solid #909399;
    }

    .border-bottom{
        border-bottom: 1px solid #909399;
    }

    .bold{
        font-weight: bolder;
    }
</style>