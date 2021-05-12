<template>
    <!-- <table id="task" @click="clickTask" align="left" :style="closed_backgroundColor">
        <tr style="height: 14px;" :style="{backgroundColor: this.label_color}">
            <td></td>
        </tr>
        <slot name="card_header">
            <tr>
                <td class="text-overflow-twoLine"  style="padding-top: 35px; padding-left: 15px; padding-right: 15px; font-weight: bolder;">
                        {{task_name}}
                </td>
                <div style="margin-bottom: 10px;"></div>
            </tr> 
        </slot>
        <tr>
            <td align="center">
                <table id="info_table" style="text-align: center;">
                    <tr class="border-bottom" style="height: 28px">
                        <td class="border_right bold">관리자</td>
                        <td class="text-overflow" style="width: 95%; line-height:20px;">{{manager}}</td>
                    </tr>
                    <tr class="border-bottom">
                        <td class="border_right bold">시작일</td>
                        <td class="date_font_size">
                            <div>{{this.$moment(start_date).format('YYYY/MM/DD')}}</div> 
                            <div>{{this.$moment(start_date).format(`h${": "}mm A`)}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="border_right bold">마감일</td>
                        <td class="date_font_size">
                            <div>{{this.$moment(end_date).format('YYYY/MM/DD')}}</div> 
                            <div>{{this.$moment(end_date).format(`h${": "}mm A`)}}</div>
                        </td>
                    </tr>
                    <slot name="complete_date">
                    </slot>
                </table> 
                <slot name="complete_btn">
                </slot>
                <div style="margin-bottom: 5px;">
                </div>
            </td>
        </tr>
    </table> -->
    <table id="simple_card">
        <tr>
            <td style="background-color: red; width: 12px;" :style="{backgroundColor: label_color}">            
            <!-- <td style="width: 12px;" :style="{backgroundColor: this.label_color}"> -->
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
    props:['task_name', 'manager', 'start_date', 'end_date', 'label_color'],
    data(){
        return{
        }
    },
    methods:{
       
    }
}
</script>

<style scoped>
    #simple_card{
        width: 300px;
        height: 90px;
        border: 1px solid black;
        border-spacing: 0px; 
        background-color: white;
        /* margin-bottom: 5px; */
    }
</style>