<template>
    <base-layout>
        <template v-slot:main>
            <div style="text-align: right;">
                <button type="button" id="refresh" title="새로고침" class="el-icon-refresh-right" style="color: rgb(94, 94, 94); border: none; padding: 0px; background: none; font-size:2em; margin-right: 5px;" @click="refresh"><div style="font-size: 16px; margin-top: 5px;">새로고침</div></button>
            </div>
            <el-form @submit.prevent.native="modifyTask" label-width=auto style="text-align: center; margin-top: 30px">
                <div style="display: inline-block; text-align: center;">
                    <div>
                        <el-form-item label="업무명" for="task_name">
                            <el-input v-model="task_form.task_name" type="text" name="task_name" placeholder="필수 사항입니다." class="text-overflow" style="width: 250px;" required /> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="업무 설명" for="explanation">
                            <el-input v-model="task_form.explanation" type="textarea" :rows="4" name="explanation" placeholder="선택 사항입니다." style="width: 100%; min-width: 520px; font-family: inherit;" maxlength= "100" show-word-limit/> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="업무 체크리스트" for="checklists">
                            <div>
                                <el-button type="info" size="small" round @click.native="addChecklist">항목 추가</el-button>
                            </div>
                            <div style="font-size: 12px; color: #ddad94;">※ 체크리스트 항목을 삭제 시, 이전에 등록한 세부업무의 체크리스트에서도 삭제됩니다.</div>
                            <div v-for="i in checklists.length" :key="i" style="margin-bottom: 5px;">
                                <el-input v-model="checklists[i-1].content" type="text" name="checklists" placeholder="항목을 입력해주세요." maxlength= "20" style="width: 250px; margin-right: 15px;" show-word-limit required/> 
                                <el-button class="btn" icon="el-icon-close" size="medium" circle @click.native="deleteChecklist(i-1)"></el-button>
                            </div>
                            <div v-for="checklist in completedChecklists" :key="checklist.checklist_num" style="margin-bottom: 5px;">
                                <el-input v-model="checklist.content" type="text" name="completedChecklists" style="width: 250px; margin-right: 15px;" disabled/> 
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
                                        <input v-model="task_form.start_date" @change="dateChenge" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;" format="yyyy-MM-ddThh:mm" required/>
                                    </td>
                                    <td>
                                        <input v-model="task_form.end_date" type="datetime-local" placeholder="업무 마감일" :min= "task_form.start_date" required/>
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
                                <input type="radio" class="labelColor" name="label_color" v-model="task_form.label_color" value="#F56C6C" style="background-color: #F56C6C">
                                <input type="radio" class="labelColor" name="label_color" v-model="task_form.label_color" value="#E6A23C" style="background-color: #E6A23C">
                                <input type="radio" class="labelColor" name="label_color" v-model="task_form.label_color" value="#67C23A" style="background-color: #67C23A">
                                <input type="radio" class="labelColor" name="label_color" v-model="task_form.label_color" value="#409EFF" style="background-color: #409EFF">
                                <input type="radio" class="labelColor" name="label_color" v-model="task_form.label_color" value="#909399" style="background-color: #909399">
                            </div>
                        </el-form-item>
                    </div>
                    <br/>
                    <div>
                        <el-form-item label="관리자" for="manager">
                            <table style="border-spacing: 0px">
                                    <tr>
                                        <td valign="top">
                                            <el-select v-model="task_form.manager" @change="workerReset" placeholder="선택해주세요." style="width: 220px;">
                                                <el-option 
                                                    v-for="item in users" 
                                                    :key="item.user_num" 
                                                    :label="`${item.name} (${item.id})`" 
                                                    :value="item.user_num">
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <div style="margin-left: 30px; width: 370px">
                                                <el-input type="textarea" v-model="task_form.manager_role" id="content" :rows="3" placeholder="해당 관리자의 역할을 적어주세요.(최대 100자)" maxlength= "100" show-word-limit></el-input>
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
                                            <el-select v-if="task_form.manager" v-model="selected_workerNum" multiple placeholder="선택해주세요." style="width: 220px;">
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
                                                <personal-role v-for="worker in selected_workers" :key="worker.user_num" v-on:enrollPersonalRole="enrollPersonalRole" :user_num="worker.user_num" :worker_name="worker.name" :worker_id="worker.id" :personal_role="worker.personal_role"></personal-role>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                        </el-form-item>
                    </div>
                    <el-button native-type="submit" class="btn" name="button" style="width: 200px; margin-top: 100px;">
                        수정하기
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
            task_form: {
                task_num: null,
                task_name: '',
                explanation: '',
                start_date: '',
                end_date: '',
                update_date: '',
                label_color: '#909399',
                manager: null,
                manager_role: '',
            },
            users: [],
            selected_workerNum: [],
            selected_workers: [],
            before_selected_workerNum: [],
            before_manager: null,
            checklists: [],
            completedChecklists: [],
            before_checklists: []
        }
    },
    components: {
        BaseLayout,
        PersonalRole
    },
    created(){
        this.task_form.task_num = this.$route.params.taskNum;
        
        this.$axios({
            url: `http://localhost:3000/allUsers`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            this.users = res.data;
        }).catch(err => {
            console.log("Modify all users ERROR!!: ", err)
        });

        this.$axios({
            url: `http://localhost:3000/tasks/${this.task_form.task_num}/info`,
            method: 'get',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"    
        }).then(res => {
            this.task_form.task_name = res.data.info.task_name;
            this.task_form.explanation = res.data.info.explanation;
            this.task_form.start_date = this.$moment(res.data.info.start_date).format('YYYY-MM-DDTHH:mm');
            this.task_form.end_date = this.$moment(res.data.info.end_date).format('YYYY-MM-DDTHH:mm');
            this.task_form.label_color = res.data.info.label_color;
            this.task_form.manager = res.data.manager.manager;
            this.before_manager = res.data.manager.manager;
            this.task_form.manager_role = res.data.manager.manager_role;

            for(var i=0; i<res.data.workers.length; i++){
                this.selected_workers.push(res.data.workers[i]);
                this.selected_workerNum.push(res.data.workers[i].user_num);
                this.before_selected_workerNum.push(res.data.workers[i].user_num);
            };
            

            for(var i=0; i<res.data.checklists.length; i++){
                if(res.data.checklists[i].completed != false){
                    this.completedChecklists.push(res.data.checklists[i]);
                }
                else{
                    this.checklists.push(res.data.checklists[i]);
                    this.before_checklists.push(res.data.checklists[i]);
                }
            }
        }).catch(err => {
            console.log("err: " + err);
        });

    },
    watch: {
        selected_workerNum: function(newVal, oldVal){
            this.selectWorkers(newVal, oldVal);
        }
    },
    computed: {
        users_notManager: function(){
            return this.users.filter(this.notManager);
        },
    },
    methods: {
        // 업무 시작일 수정시에 설정되어있던 end_date보다 더 뒤의 날짜로 수정하면 end_date는 리셋
        dateChenge(){
            if(this.task_form.start_date > this.task_form.end_date)
                this.task_form.end_date = '';
        },
        // users_notManager에 쓰이는 함수. manager가 아닌 사용자를 filter 
        notManager(element){
            if(element.user_num == this.task_form.manager){
                return false;
            }
            else {
                return true;
            }       
        },
        // 선택된 관리자가 실무담당자에 있을 때만 비우기. (선택된 관리자만 비워야 하지 않을까 -> 알림창 띄우기)
        workerReset(){
            const selectedManager = this.selected_workerNum.indexOf(this.task_form.manager);
            const manager_num = this.task_form.manager;

            // 관리자로 선택된 사용자가 실무담당자 목록에 있는 경우에만 그 인덱스의 것을 삭제. workers, workerNum에서 모두 삭제. 
            if(selectedManager >= 0){
                const findIndex = this.selected_workers.findIndex(function(item){
                    return item.user_num == manager_num;
                })
                alert("선택하신 관리자가 실무담당자에서 제외됩니다.");
                this.selected_workers.splice(findIndex, 1);
                this.selected_workerNum.splice(selectedManager, 1);
            }
            // 관리자로 선택된 사용자가 실무담당자 목록에 없는 경우 
            // else if(selectedManager == -1){
                
            // }
        },
        selectWorkers(newVal, oldVal){
            var changedElement; 
            
            if(newVal.length > oldVal.length){
                changedElement = newVal.filter(function(element){return oldVal.indexOf(element) == -1}); // 존재하지 않는 원소 
                for(var i=0; i<this.users.length; i++){
                    if(changedElement == this.users[i].user_num){
                        this.selected_workers.push({user_num: this.users[i].user_num, name: this.users[i].name, id: this.users[i].id});
                        break;
                    }
                }
            }
            else if(newVal.length < oldVal.length){
                changedElement = oldVal.filter(function(element){return newVal.indexOf(element) == -1});
                for(var i=0; i<this.selected_workers.length; i++){
                    if(this.selected_workers[i].user_num == changedElement){
                        this.selected_workers.splice(i,1);
                        break;
                    }
                }
            }
        },
        enrollPersonalRole(personalRole){
            const findIndex = this.selected_workers.findIndex(function(item){
                return item.user_num == personalRole.user_num;
            })

            this.selected_workers[findIndex].personal_role = personalRole.personal_role;
        },
        modifyTask(){
            if(this.task_form.duration_check == true){
                this.task_form.start_date = null;
                this.task_form.end_date = null;
            }

            this.task_form.update_date = this.$moment().format('YYYY-MM-DDTHH:mm');

            var sameManager = false;

            if(this.before_manager === this.task_form.manager){
                sameManager = true;    
            }

            const addedWorkers_list = this.selected_workers.filter(worker => this.before_selected_workerNum.indexOf(worker.user_num) == -1)
            
            const deletedWorkerNum_list = this.before_selected_workerNum.filter(num => this.selected_workerNum.indexOf(num) == -1)

            const existedWorkers_list = [];

            for(var i=0; i<this.selected_workers.length; i++){
                // 원래 있던 실무담당자                 
                if(addedWorkers_list.filter(worker => worker.user_num == this.selected_workers[i].user_num).length == 0){
                    existedWorkers_list.push(this.selected_workers[i]); 
                }
            }

            const addedChecklists = this.checklists.filter(checklist => typeof checklist.checklist_num === 'undefined');

            const deletedChecklists = this.before_checklists.filter(checklist => this.checklists.indexOf(checklist) == -1);

            const existedChecklists = this.before_checklists.filter(checklist => deletedChecklists.indexOf(checklist) == -1);


            // manager가 바뀌었는지 유무 
            // 실무담당자에서   없어진 사용자 
            //                새로 생긴 사용자 
            //                없어지지 않은 사용자    
            this.$axios({
                url: `http://localhost:3000/tasks`,
                method: 'put',
                data: {
                    info: this.task_form,
                    addedWorkers_list: addedWorkers_list,
                    existedWorkers_list: existedWorkers_list,
                    deletedWorkerNum_list: deletedWorkerNum_list,
                    sameManager: sameManager,
                    beforeManager: this.before_manager,
                    addedChecklists: addedChecklists,
                    deletedChecklists: deletedChecklists,
                    existedChecklists: existedChecklists,
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
                else if(res.data.result == "checklist duplicate"){
                    alert("체크리스트가 중복됩니다. 확인해주세요.")
                }
                else if(res.data.result == true){
                    alert("업무가 수정되었습니다.")
                    this.$router.go(-1)
                }
            }).catch(err => {
                console.log("err: ", err)
            })           
        },
        addChecklist(){
            this.checklists.push({'content': ''});
        },
        deleteChecklist(i){
            this.checklists.splice(i, 1);
        },
        // isDuplicate(arr) {
        //     const isDup = arr.some(function(x) {
        //         return arr.indexOf(x) !== arr.lastIndexOf(x);
        //     });
                                    
        //     return isDup;
        // },
        refresh(){
            this.$router.go()
        }
    }
}
</script>

<style scoped>
    .text-overflow{
        text-overflow: ellipsis; 
        overflow: hidden; 
        white-space: nowrap;
        margin: 2px;
    } 

    .el-form-item{
        text-align: left;
        white-space: nowrap;
        margin-bottom: 35px;
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

    input[type="datetime-local"]:disabled {
        background: #c2c2c2;
    }

    .el-input__inner{
        padding-right: 5px;
    }

    input[type="datetime-local" i]{
         font-family: inherit !important;
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

    #content:hover {
        border-color: #C0C4CC;
    }

    #refresh:hover{
        color: rgb(122, 122, 122) !important;
    }
</style>