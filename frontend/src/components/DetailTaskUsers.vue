<template>
    <el-card id="detail_task">
        <div style="text-align: left; margin-bottom: 3%; display:flex; justify-content: space-between; align-items: center;">
            <div style="display:flex; align-items: center;">
                <el-avatar v-if="profile_img" :size="45" style="border: 1px solid #a4a7ad;">
                    <img :src="require('../../../backend/uploads/' + profile_img)" />
                </el-avatar>
                <el-avatar v-else icon="el-icon-user-solid" :size="45" style="font-size: 1.5rem;"></el-avatar>
                <div style="margin-right: 20px"></div>
                
                <span style="font-weight: bolder;">{{workerName}}</span>
                <span>님</span>
            </div>
            <div>
                <el-dropdown size="medium">
                    <i id="edit_btn" class="el-icon-setting" style="margin-right: 3px; font-size: 1.9em;"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-edit" @click.native="showModifyDialog"> 수정</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="deleteDetailTask"> 삭제</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- <button @click="showModifyDialog" id="edit_btn" class="el-icon-setting" style="background: none; border: none; padding: 0px; margin-right: 3px; font-size: 1.9em;"/> -->
            </div>
        </div>
        <div style="text-align: left; margin-bottom: 2%; font-weight: bolder; font-size: 1.1em;">
            {{detail_task_name}}
        </div>
        <div v-if="content" style="text-align: left; margin-bottom: 20px; color: #6f7279">
            {{content}}
        </div>
        <div v-else style="text-align: left; margin-bottom: 20px; color: rgb(192, 196, 204);">
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
    props:['detail_task_num', 'workerName', 'detail_task_name', 'content', 'report_date', 'profile_img'],
    methods: {
        showModifyDialog(){
            console.log("showModifyDialog");
            this.$emit('showModifyDialog', this.detail_task_num);
        },
        deleteDetailTask(){
            console.log("deleteDetailTask");
            this.$emit('deleteDetailTask', this.detail_task_num);
        }
    }
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

    /* .text-overflow-twoLine{
        display: -webkit-box;
        overflow: hidden;
        line-height: 1.2em;
        height: 2.4em;
        text-overflow: ellipsis; 
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break:break-all;
    } */

    #edit_btn{
        color: #888888; 
        /* color: #303133 */
    }

    #edit_btn:hover{
        color: #646464; 
    }

</style>