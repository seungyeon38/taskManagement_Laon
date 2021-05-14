<template>
    <div id="personalTask">
        <div id="name">
            <span>{{worker_name}}</span><span style="font-size: 0.9em; color: gray;"> ({{worker_id}})</span>
        </div>
        <div>
            <el-input type="textarea" v-model="content" :rows="3" id="content" @change="enrollPersonalRole" placeholder="해당 실무담당자의 역할을 적어주세요.(최대 100자)" maxlength= "100" show-word-limit></el-input>
            <!-- <el-input v-model="explanation" type="textarea" :rows="3" name="explanation" placeholder="선택 사항입니다." style="width: 100%;"/>  -->
        </div>
    </div>

</template>

<script>
export default{
    name: 'personalRole',
    props: ['user_num', 'worker_name', 'worker_id', 'personal_role'],
    data(){
        return{
            content: this.personal_role
        }
    },
    methods: {
        enrollPersonalRole(){
            this.$emit('enrollPersonalRole', {user_num: this.user_num, personal_role: this.content});
        }
    },
    created(){
        if(this.personal_role === "undefined"){
            this.content = ""
        }
    }
}
</script>

<style scoped>
#personalTask{
    width: 350px; 
    height: 130px;
    background-color: #f3f7fd;
    border: 1px solid #c1c3ca;
    margin-bottom: 20px;
    border-radius: 4px;
    padding: 10px;
}

#name{
    height: 30px; 
    line-height: 30px; 
    background-color: #eeeeee; 
    padding: 0px 10px;
    font-size: 1.1em;
    /* font-weight: bolder; */
    border: 1px solid #c1c3ca;
    margin-bottom: 10px;
    border-radius: 3px;
}

#content{
    border: 1px solid #DCDFE6;
    height: 85px;
    background-color: white; 
    margin: 0px;
    width: 100%;
    padding: 10px;
    /* padding: 0px;  */
    box-sizing : border-box;
    vertical-align: top;
    border-radius: 3px;
}

#content:hover{
    border-color: #C0C4CC;
}

/* input:focus { outline: none; } */


</style>