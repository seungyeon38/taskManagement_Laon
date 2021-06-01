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
        <div v-if="content" style="text-align: left; margin-bottom: 20px; color: #585858">
            {{content}}
        </div>
        <div v-else style="text-align: left; margin-bottom: 20px; color: rgb(192, 196, 204);">
            (내용 없음)
        </div>
        <div style="height:10px;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: gray;">
            <div>
                <span v-for="checklist in checklists" :key="checklist.checklist_num">
                    <span style="background-color: #f4f7fa; border: 1px solid rgb(192, 196, 204); border-radius: 4px; padding:0px 10px; margin-right: 10px;">{{checklist.content}}</span>
                </span>
            </div>
            <div>{{report_date}}</div>
        </div>
    </el-card>
</template>

<script>
export default{
    name: 'detail_task',
    props: {
        workerName: String, 
        detail_task_name: String, 
        content: String, 
        report_date: String, 
        profile_img: String, 
        checklists: Array,
    },
}
</script>

<style scoped>
    #detail_task{
        display:inline-block;
        border: 1px solid #a8a8a8; 
        background-color: white;
        width: 700px; 
        border-spacing: 0px;
        margin: 15px 30px;
        background-color: white;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.185);
    }
</style>