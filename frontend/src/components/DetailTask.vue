<template>
    <el-card id="detail_task">
        <div style="text-align: left; margin-bottom: 3%; display:flex; align-items: center;">
            <el-avatar v-if="profile_img" :size="45" style="border: 1px solid #a4a7ad;">
                <img :src="require('../../../backend/uploads/' + profile_img)" />
            </el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
            <!-- <el-avatar v-else icon="el-icon-user-solid"></el-avatar> -->
            <div style="margin-right: 20px"></div>
            <span style="font-weight: bolder;">{{workerName}}</span>
            <span>님</span>
        </div>
        <div style="text-align: left; margin-bottom: 2%; font-weight: bolder; font-size: 1.1em;">
            {{detail_task_name}}
        </div>
        <div v-if="content" class="text-overflow-twoLine" style="text-align: left; margin-bottom: 20px">
            {{content}}
        </div>
        <div v-else class="text-overflow-twoLine" style="text-align: left; margin-bottom: 20px">
            (내용 없음)
        </div>
        <div style="text-align: right; font-size: 0.9em; color: gray;">
            {{report_date}}
        </div>
    </el-card>
    <!-- <table id="detail_task" align="left">
        <tr>
        </tr> -->
        <!-- <tr style="height: 13px;" :style="{backgroundColor: this.label_color}">
            <td></td>
        </tr>
        <tr>
        </tr> 
        <tr>
            <td class="text-overflow-twoLine"  style="width: 80%; margin:auto; margin-top: 15px; font-weight: bolder;">
                    {{task_name}}
            </td>
            <div style="margin-bottom: 20px;">
            </div>
        </tr> 
        <tr>
            <td align="center">
                <table id="info_table" style="text-align: center;">
                    <tr class="border-bottom" style="height: 28px">
                        <td class="border_right bold">관리자</td>
                        <td class="text-overflow" style="width: 95%; line-height:20px;">{{manager}}</td>
                    </tr>
                    <tr class="border-bottom">
                        <td class="border_right bold">시작일</td>
                        <td>
                            <div style="font-size: 0.9em;">{{this.$moment(start_date).format('YYYY/MM/DD')}}</div> 
                            <div style="font-size: 0.8em;">{{this.$moment(start_date).format(`A h${"시 "}mm${"분"}`)}}</div>
                        </td>
                    </tr>
                    <slot name="end_date">
                        <tr>
                            <td class="border_right bold">마감일</td>
                            <td>
                                <div style="font-size: 0.9em;">{{this.$moment(end_date).format('YYYY/MM/DD')}}</div> 
                                <div style="font-size: 0.8em;">{{this.$moment(end_date).format(`A h${"시 "}mm${"분"}`)}}</div>
                            </td>
                        </tr>
                    </slot>
                    <slot name="complete_date">
                    </slot>
                </table> 
                <slot name="complete_btn">
                </slot>
                <div style="margin-bottom: 5px;">
                </div>
            </td>
        </tr> -->
    <!-- </table> -->

</template>

<script>
export default{
    name: 'detail_task',
    data(){
        return{
        }
    },
    props:['detail_task_num', 'workerName', 'detail_task_name', 'content', 'report_date', 'profile_img'],
    created(){

    }
}
</script>

<style scoped>
    #detail_task{
        display:inline-block;
        border: 1px solid #8b8b8b; 
        background-color: white;
        width: 700px; 
        /* height: 170px; */
        border-spacing: 0px;
        margin: 15px 30px;
        /* padding: 15px 25px; */
        background-color: white;
        overflow: hidden;
        /* border-radius: 5px; */
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.185);

    }
/* 
    #detail_task:hover{
        background-color: #fcfcfc;
        box-shadow: 3px 3px #dadada;
    }

    #detail_task:active{
        box-shadow: 3px 3px #bbbbbb;
    } */

    .text-overflow-twoLine{
        display: -webkit-box;
        overflow: hidden;
        line-height: 1.2em;
        height: 2.4em;
        text-overflow: ellipsis; 
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break:break-all;
    }


</style>