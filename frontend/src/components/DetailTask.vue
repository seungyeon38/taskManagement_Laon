<template>
    <el-card id="detail_task">
        <div style="text-align: left; margin-bottom: 3%; display:flex; align-items: center;">
            <el-avatar v-if="profile_img" :size="45" style="border: 1px solid #a4a7ad;">
                <img :src="require('../../../backend/uploads/' + profile_img)" />
            </el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
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
</template>

<script>
export default{
    name: 'detail_task',
    data(){
        return{
        }
    },
    props:['workerName', 'detail_task_name', 'content', 'report_date', 'profile_img'],
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
        border-spacing: 0px;
        margin: 15px 30px;
        background-color: white;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.185);

    }

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