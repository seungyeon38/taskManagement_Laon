<template>
    <table @click="clickTask" id="simple_card">
        <tr>
            <td style="background-color: red; width: 12px;" :style="{backgroundColor: label_color}">           
            </td>
            <td valign="top" style="padding-top: 5px; padding-left: 10px;">
                <div style="font-weight:bolder; padding-bottom: 10px; width: 250px" class="text-overflow">
                    {{task_name}}
                </div>
                <div style="font-size: 0.9em; margin-bottom: 5px; ">
                    <span style="font-weight: bolder;">관리자: </span><span style="width: 200px; vertical-align: text-bottom;" class="text-overflow">{{manager}}</span>
                </div>
                <div style="font-size: 0.8em; margin-bottom: 5px;">
                    {{this.$moment(start_date).format(`YYYY. MM. DD`)}} ~ {{this.$moment(end_date).format(`YYYY. MM. DD`)}}
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
export default{
    name: 'thisWeekTask',
    props:['task_num', 'task_name', 'manager', 'start_date', 'end_date', 'label_color'],
    data(){
        return{
        }
    },
    methods:{
        clickTask(){
            console.log(this.task_num);
            this.$emit('clickTask', this.task_num);
        },
    }
}
</script>

<style scoped>
    #simple_card{
        width: 300px;
        height: 90px;
        border: 1px solid #e7e7e7;
        /* border-bottom: 1px solid #a8a8a8; */
        border-spacing: 0px; 
        background-color: white;
        margin-bottom: 2px;
    }

    #simple_card:hover{
        border: 1px solid #c5c5c5;
    }
</style>