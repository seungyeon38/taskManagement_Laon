<template>
    <base-layout>
        <template v-slot:main>
            <el-form @submit.prevent.native="enrollTask" label-width=auto style="text-align: center; margin-top: 30px">
                <div style="display: inline-block; text-align: center;">
                    <div>
                        <el-form-item label="업무명" for="task_name">
                            <el-input v-model="task_name" type="text" name="task_name" placeholder="필수 사항입니다." class="text-overflow" maxlength= "45" style="width: 250px;" show-word-limit required /> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="업무 설명" for="explanation">
                            <el-input v-model="explanation" type="textarea" :rows="4" name="explanation" placeholder="선택 사항입니다." style="width: 100%; min-width: 520px; font-family: inherit;" maxlength= "100" show-word-limit/> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="업무 체크리스트" for="checklists">
                            <div>
                                <el-button type="info" size="small" round @click.native="addChecklist" style="margin-bottom: 10px;">항목 추가</el-button>
                            </div>
                            <div v-for="i in checklists.length" :key="i" style="margin-bottom: 5px;">
                                <el-input v-model="checklists[i-1]" type="text" name="checklists" placeholder="항목을 입력해주세요." maxlength= "20" style="width: 250px; margin-right: 15px;" show-word-limit required/> 
                                <el-button class="btn" icon="el-icon-close" size="medium" circle @click.native="deleteChecklist(i-1)"></el-button>
                            </div>
                        </el-form-item>
                    </div>
                    <br/>
                    <div>
                        <el-form-item label="시작/마감일 설정" for="duration" style="margin: 0px;">
                            <table class="color5">
                                <tr>
                                    <td>
                                        업무 시작일
                                    </td>
                                    <td>
                                        업무 마감일
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input v-model="start_date" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;" required/>
                                    </td>
                                    <td>
                                        <input v-model="end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date" required/>
                                    </td>
                                </tr>
                            </table>
                        </el-form-item>
                    </div>
                    <el-form-item>
                    </el-form-item>
                    <br/>
                    <div>
                        <el-form-item label="라벨 색상" for="label_color">
                            <div style="line-height: 40px;">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#F56C6C" style="background-color: #F56C6C">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#E6A23C" style="background-color: #E6A23C">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#67C23A" style="background-color: #67C23A">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#409EFF" style="background-color: #409EFF">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#909399" style="background-color: #909399" checked>
                            </div>
                        </el-form-item>
                    </div>
                    <br/>
                    <div>
                        <el-form-item label="관리자" for="manager">
                            <table style="border-spacing: 0px">
                                    <tr>
                                        <td valign="top">
                                            <el-select v-model="manager" @change="workerReset" placeholder="선택해주세요." style="width: 220px;">
                                                <el-option 
                                                    v-for="item in users" 
                                                    :key="item.user_num" 
                                                    :label="`${item.name} (${item.id})`" 
                                                    :value="item.user_num">
                                                </el-option>
                                                <!-- <div v-for="user in users" :key="user.user_num" >
                                                    <div v-if="user.profile_img" style="display: flex; align-items: center;">
                                                        <template slot="prefix"><img class="prefix" :src="require('../../../backend/uploads/' + user.profile_img)" /></template>
                                                        <el-option :label="`${user.name} (${user.id})`" :value="user.user_num">
                                                            <el-avatar :size="25" style="display: inline-block; border: 1px solid #a4a7ad; "><img :src="require('../../../backend/uploads/' + user.profile_img)" /></el-avatar>{{`${user.name} (${user.id})`}}
                                                        </el-option>
                                                    </div>
                                                    <div v-else style="display: flex; align-items: center;">
                                                        <template slot="prefix"><img class="prefix" icon="el-icon-user-solid" /></template>
                                                        <el-option :label="`${user.name} (${user.id})`" :value="user.user_num">
                                                            <el-avatar icon="el-icon-user-solid" :size="25" style="border: 1px solid #a4a7ad;" />{{`${user.name} (${user.id})`}}
                                                        </el-option>
                                                    </div>
                                                </div> -->
                                            </el-select>
                                        </td>
                                        <td>
                                            <div style="margin-left: 30px; width: 370px">
                                                <el-input type="textarea" v-model="managerRole" v-if="manager" id="content" :rows="3" placeholder="해당 관리자의 역할을 적어주세요.(최대 100자)" maxlength= "100" show-word-limit></el-input>
                                                <el-input type="textarea" v-model="managerRole" v-else :rows="3" id="content_disabled" placeholder="우선 관리자를 선택해주세요." disabled></el-input>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="실무담당자" for="workers">
                                <table style="border-spacing: 0px">
                                    <tr>
                                        <td valign="top">
                                            <el-select v-if="manager" v-model="selected_workerNum" multiple placeholder="선택해주세요." style="width: 220px;">
                                                <el-option
                                                    v-for="user in users_notManager"
                                                    :key="user.user_num" 
                                                    :label="`${user.name} (${user.id})`" 
                                                    :value="user.user_num"
                                                >
                                                </el-option>
                                            </el-select>
                                            <el-select v-else placeholder="관리자를 선택해주세요." style="width: 220px;" disabled></el-select>
                                        </td>
                                        <td>
                                            <div style="margin-left: 30px;">
                                                <personal-role v-for="worker in selected_workers" :key="worker.user_num" v-on:enrollPersonalRole="enrollPersonalRole" :user_num="worker.user_num" :worker_name="worker.name" :worker_id="worker.id"></personal-role>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                        </el-form-item>
                    </div>
                    <el-button native-type="submit" class="btn" name="button" style="width: 200px; margin-top: 70px;">
                        등록하기
                    </el-button>
                </div>
            </el-form>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import PersonalRole from './PersonalRole.vue';


export default {
    data(){
        return{
            task_name: '',
            explanation: '',
            duration_check: false,
            start_date: '',
            end_date: '',
            register_date: '',
            label_color: '#909399',
            manager: '',
            managerRole: '',
            users: [],
            selected_workerNum: [],
            selected_workers: [],
            checklists: [],
            numChecklist: 0
        }
    },
    components: {
        BaseLayout,
        PersonalRole
    },
    created(){
        this.$axios({
            url: `http://localhost:3000/allUsers`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            console.log("res.data: " + JSON.stringify(res.data));
            this.users = res.data;
        }).catch(err => {
            console.log("err: ", err)
        });
    },
    watch: {
        selected_workerNum: function(newVal, oldVal){
            this.selectWorkers(newVal, oldVal);
        },
    },
    computed: {
        users_notManager: function(){
            return this.users.filter(this.notManager);
        },
    },
    methods: {
        notManager(element){
            if(element.user_num == this.manager){
                return false;
            }
            else {
                return true;
            }       
        },
        workerReset(){
            const selectedManager = this.selected_workerNum.indexOf(this.manager);
            const manager_num = this.manager;
            
            // 관리자로 선택된 사용자가 실무담당자 목록에 있는 경우에만 그 인덱스의 것을 삭제. workers, workerNum에서 모두 삭제. 
            if(selectedManager >= 0){
                const findIndex = this.selected_workers.findIndex(function(item){
                    return item.user_num == manager_num;
                })
                this.selected_workers.splice(findIndex, 1);
                this.selected_workerNum.splice(selectedManager, 1);
            }
            // 관리자로 선택된 사용자가 실무담당자 목록에 없는 경우 
            // else if(selectedManager == -1){
                
            // }
        },
        selectWorkers(newVal, oldVal){
            var changedElement; 
            // 실무담당자가 추가됐을 때 
            if(newVal.length > oldVal.length){
                changedElement = newVal.filter(function(element){return oldVal.indexOf(element) == -1});
                for(var i=0; i<this.users.length; i++){
                    if(changedElement == this.users[i].user_num){
                        this.selected_workers.push({user_num: this.users[i].user_num, name: this.users[i].name, id: this.users[i].id});
                        break;
                    }
                }
            }
            // 실무담당자가 삭제됐을 때 
            else if(newVal.length < oldVal.length){
                changedElement = oldVal.filter(function(element){return newVal.indexOf(element) == -1});

                const deletedIndex = this.selected_workers.findIndex(function(item){
                    return item.user_num == changedElement;
                })
                this.selected_workers.splice(deletedIndex, 1);
            }
        },
        enrollPersonalRole(personalRole){
            const findIndex = this.selected_workers.findIndex(function(item){
                return item.user_num == personalRole.user_num;
            })
            this.selected_workers[findIndex].personal_role = personalRole.personal_role;
        },
        enrollTask(){
            if(this.duration_check == true){
                this.start_date = null;
                this.end_date = null;
            }

            this.register_date = this.$moment().format('YYYY-MM-DDTHH:mm');

            if(!this.manager){
                alert("관리자를 선택해주세요.")
                return;
            }

            this.$axios({
                url: `http://localhost:3000/tasks`,
                method: 'post',
                data: {
                    task_name: this.task_name,
                    explanation: this.explanation,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    manager: this.manager,
                    register_date: this.register_date,
                    completed_date: null,
                    label_color: this.label_color,
                    manager_role: this.managerRole,
                    selected_workers_list: this.selected_workers,
                    completed: false,
                    update_date: null,
                    checklists: this.checklists
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"    
            }).then(res => {
                if(res.data.result == "duplicate"){
                    alert("해당 업무명을 가진 업무가 존재합니다. 업무명을 변경해주세요.")
                }
                else if(res.data.result == true){
                    alert("업무가 등록되었습니다.")
                    this.$router.go(-1)
                }
            }).catch(err => {
                console.log("업무 등록 ERROR!!: ", err)
            });
            
            // this.$socket.emit('client', {
            //     manager: this.manager,
            //     selected_workers_list: this.selected_workers
            // })
        },
        addChecklist(){
            console.log("this.checklists: " + JSON.stringify(this.checklists));
            this.checklists.push('');
        },
        deleteChecklist(i){
            this.checklists.splice(i, 1);
        },
        // isDuplicate(arr)  {
        //     const isDup = arr.some(function(x) {
        //         return arr.indexOf(x) !== arr.lastIndexOf(x);
        //     });
                                    
        //     return isDup;
        // }
    }
}
</script>

<style scoped>
    img {
        width: 20px;
        height: 20px;
    }

    .prefix {
        margin-top: 10px;
    }

    .text-overflow{
        text-overflow: ellipsis; 
        overflow: hidden; 
        white-space: nowrap;
        margin: 2px;
    } 

    .el-form-item{
        text-align: left;
        white-space: nowrap;
        margin-bottom: 25px;
    }

    input[type="radio"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    .labelColor{
        border: 1px solid #a8a8a8;
        width: 33px;
        height: 33px;
        border-radius: 50%;
        margin: 0px 7px;
        vertical-align: middle;
    }

    .labelColor:focus{
        border-color: #606266 !important;
    }

    .labelColor:checked{
        border-color: #606266;
    }

    .labelColor:hover{
        opacity: 0.7;
    }

    input[type="datetime-local"]{
        -webkit-appearance: none;
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        text-rendering: auto;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        text-align: start;
        -webkit-rtl-ordering: logical;
        cursor: text;
        margin: 0em;
        font: 400 13.3333px Arial;
    }

    input[type="datetime-local"]:disabled {
        background: #c2c2c2;
    }

    input[type="datetime-local" i]{
        font-family: inherit !important;
    }

    .el-input__inner{
        padding-right: 5px;
    }

    #content{
        border: 1px solid #DCDFE6;
        height: 85px;
        background-color: white; 
        margin: 0px;
        width: 100%;
        padding: 10px;
        box-sizing : border-box;
        vertical-align: top;
        border-radius: 3px;
    }

    #content_disabled{
        border: 1px solid #DCDFE6;
        height: 85px;
        background-color: white; 
        margin: 0px;
        width: 100%;
        padding: 10px;
        box-sizing : border-box;
        vertical-align: top;
        border-radius: 3px;
    }

    #content:hover {
        border-color: #C0C4CC;
    }
</style>