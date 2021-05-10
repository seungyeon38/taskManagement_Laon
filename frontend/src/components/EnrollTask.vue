<template>
    <base-layout>
        <template v-slot:main>
            <el-form @submit.prevent.native="enrollTask" label-width=auto style="text-align: center; margin-top: 30px">
                <div style="display: inline-block; text-align: center;">
                    <div>
                        <el-form-item label="업무명" for="task_name">
                            <el-input v-model="task_name" type="text" name="task_name" placeholder="필수 사항입니다." class="text-overflow" style="width: 250px;" required /> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="업무 설명" for="explanation">
                            <el-input v-model="explanation" type="textarea" :rows="4" name="explanation" placeholder="선택 사항입니다." style="width: 100%; min-width: 520px; font-family: inherit;" maxlength= "100" show-word-limit/> 
                        </el-form-item>
                    </div>
                    <br/>
                    <div>
                        <el-form-item label="시작/마감일 설정" for="duration" style="margin: 0px;">
                            <table>
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
                                        <input v-model="start_date" @change="dateChenge" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;" required/>
                                    </td>
                                    <td>
                                        <input v-model="end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date" required/>
                                    </td>
                                </tr>
                            </table>
                            <!-- <label style="margin-right: 10px;">설정 안함</label>
                            <el-checkbox v-model="duration_check" @change="checkbox" name="duration" style="margin-right: 20px;"/>  -->
                            <!-- <el-date-picker v-model="start_date" type="datetime" placeholder="업무 시작일" style="margin-right: 5px; width: 200px;"/>
                            <el-date-picker v-model="end_date" type="datetime" placeholder="업무 마감일" style="width: 200px;"/> -->
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <!-- <table>
                            <tr>
                                <td>
                                    업무 시작일
                                </td>
                                <td>
                                    업무 마감일
                                </td>
                            </tr> -->
                            <!-- <tr v-if="duration_check == true">
                                <td>
                                    <input v-model="start_date" @change="dateChenge" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;" disabled/>
                                </td>
                                <td>
                                    <input v-model="end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date" disabled/>
                                </td>
                            </tr>
                            <tr v-else>
                                <td>
                                    <input v-model="start_date" @change="dateChenge" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;"/>
                                </td>
                                <td>
                                    <input v-model="end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date"/>
                                </td>
                            </tr> -->
                            <!-- <tr>
                                <td>
                                    <input v-model="start_date" @change="dateChenge" type="datetime-local" placeholder="업무 시작일" style="margin-right: 10px;"/>
                                </td>
                                <td>
                                    <input v-model="end_date" type="datetime-local" placeholder="업무 마감일" :min= "start_date"/>
                                </td>
                            </tr> -->
                        <!-- </table> -->
                    </el-form-item>
                    <br/>
                    <div>
                        <el-form-item label="라벨 색상" for="label_color">
                            <div style="line-height: 40px;">
                                <!-- <el-button type="danger" class="labelColor" style="" circle></el-button>
                                <el-button type="warning" class="labelColor" circle></el-button>
                                <el-button type="success" class="labelColor" circle></el-button>
                                <el-button type="primary" class="labelColor" circle></el-button>
                                <el-button type="info" class="labelColor" circle></el-button> -->
                                <!-- <button type="button" @click="label_color='#F56C6C'" class="labelColor" style="background-color: #F56C6C"></button>
                                <button type="button" @click="label_color='#E6A23C'" class="labelColor" style="background-color: #E6A23C"></button>
                                <button type="button" @click="label_color='#67C23A'" class="labelColor" style="background-color: #67C23A"></button>
                                <button type="button" @click="label_color='#409EFF'" class="labelColor" style="background-color: #409EFF"></button>
                                <button type="button" @click="label_color='#909399'" class="labelColor" style="background-color: #909399"></button> -->
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#F56C6C" style="background-color: #F56C6C">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#E6A23C" style="background-color: #E6A23C">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#67C23A" style="background-color: #67C23A">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#409EFF" style="background-color: #409EFF">
                                <input type="radio" class="labelColor" name="label_color" v-model="label_color" value="#909399" style="background-color: #909399" checked>
                                <!-- <el-color-picker v-model="label_color" :predefine="predefineColors" /> -->
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
                                            </el-select>
                                        </td>
                                        <td>
                                            <div style="margin-left: 30px; width: 370px">
                                                <!-- <textarea v-model="managerTask" v-if="manager" id="content" placeholder="해당 관리자의 역할을 적어주세요.(최대 100자)"></textarea>
                                                <textarea v-model="managerTask" v-else id="content_disabled" placeholder="우선 관리자를 선택해주세요." disabled></textarea> -->
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
                                                <personal-role v-for="worker in selected_workers" :key="worker.user_num" v-on:enrollPersonalRole="enrollPersonalRole" :worker_num="worker.user_num" :worker_name="worker.name" :worker_id="worker.id"></personal-role>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                        </el-form-item>
                    </div>
                <!-- <el-form-item>
                    <div style="max-height: 300px; background-color: white" class="width">
                        <table>
                            <tr>
                                <td>이승연</td>
                                <td>
                                    <el-button icon="el-icon-minus" style="padding: 0; font-size: 30px; weight: 30px; height: 30px;" />
                                </td>
                            </tr>
                        </table>
                    </div>
                </el-form-item> -->
                    <el-button native-type="submit" id="enrollBtn" name="button" style="width: 200px; margin-top: 100px;">
                        등록하기
                    </el-button>
                </div>
            </el-form>
        </template>

        <!-- <template v-slot:aside>
            aside
        </template> -->
    </base-layout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import PersonalRole from './PersonalRole.vue';

// 컴포넌트는 루트 인스턴스가 생성되기 전에 정의해야 한다. 
export default {
    data(){
        return{
            // now: '', // 현재 datatime
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
            users_notManager: [], // manager를 제외한 worker들
            selected_workerNum: [],
            selected_workers: []   
        }
    },
    components: {
        BaseLayout,
        PersonalRole
    },
    created(){
        this.$axios.get('http://localhost:3000/users'
        ).then(res => {
            for(var i=0; i<res.data.length; i++){
                // console.log("res.data[i]: " + JSON.stringify(res.data[i]))
                this.users.push(res.data[i])
                console.log("this.users: " + JSON.stringify(this.users))
            };
        }).catch(err => {
            console.log("EnrollTask_Get all users ERROR!!: ", err)
        });
    },
    watch: {
        manager: function(){
            this.users_notManager = this.users.filter(this.notManager);
            console.log("this.users_notManager: " + JSON.stringify(this.users_notManager));
        },
        selected_workerNum: function(newVal, oldVal){
            console.log("watch selected_workerNum: " + this.selected_workerNum);
            console.log("watch selected_workerNum newVal: " + newVal);
            console.log("watch selected_workerNum oldVal: " + oldVal);
            
            this.selectWorkers(newVal, oldVal);
        }
    },
    computed: {

    },
    methods: {
        dateChenge(){
            console.log("start_date: " + this.start_date);
        },
        checkbox(){
            console.log("duration_check: " + this.duration_check);
        },
        notManager(element){
            // console.log(element);
            // console.log(this.manager);
            if(element.user_num == this.manager){
                // console.log("manager임")
                return false;
            }
            else {
                // console.log("manager아님")
                return true;
            }       
        },
        workerReset(){
            // console.log("before worker: " + this.workers);
            this.selected_workerNum = [];
            this.selected_workers = [];
            // console.log("after worker: " + this.workers);
        },
        selectWorkers(newVal, oldVal){
            console.log("selectWorkers newVal: " + newVal);
            console.log("selectWorkers oldVal: " + oldVal);

            var changedElement; 
            
            if(newVal.length > oldVal.length){
                changedElement = newVal.filter(function(element){return oldVal.indexOf(element) == -1});
                console.log("더함: " + changedElement);
                for(var i=0; i<this.users.length; i++){
                    if(changedElement == this.users[i].user_num){
                        this.selected_workers.push({user_num: this.users[i].user_num, name: this.users[i].name, id: this.users[i].id});
                        break;
                    }
                }
            }
            else if(newVal.length < oldVal.length){
                changedElement = oldVal.filter(function(element){return newVal.indexOf(element) == -1});
                console.log("뺌: " + changedElement);
                for(var i=0; i<this.selected_workers.length; i++){
                    if(this.selected_workers[i].user_num == changedElement){
                        this.selected_workers.splice(i,1);
                        break;
                    }
                }
            }

            console.log("selectWorkers this.selected_workers: " + JSON.stringify(this.selected_workers));
        },
        enrollPersonalRole(personalRole){
            console.log("enrollPersonalRole personalRole: " + JSON.stringify(personalRole));

            const findIndex = this.selected_workers.findIndex(function(item){
                return item.user_num == personalRole.worker_num;
            })
            console.log(findIndex);
            // console.log("findItem: " + JSON.stringify(findIndex));
            this.selected_workers[findIndex].personalRole = personalRole.content;
            console.log("enrollPersonalRole this.selected_workers: " + JSON.stringify(this.selected_workers));
        },
        // enrollManagerRole(){
        //     console.log("enrollManagerRole");
        //     // this.selected_workers.push({user_num: this.manager, personalRole: this.managerRole});
        //     console.log("this.selected_workers: " + JSON.stringify(this.selected_workers));
        // },
        async enrollTask(){
            // await this.enrollPersonalTask;

            console.log("start_date: " + this.start_date);
            if(this.duration_check == true){
                this.start_date = null;
                this.end_date = null;
            }
            console.log("start_date: " + this.start_date);
            // console.log(this.workers);
            // console.log(typeof(this.workers));
            // console.log(typeof(Object.values(this.workers)));
            // console.log(Object.values(this.workers));
            // var arr = Object.values(this.workers);
            // console.log(typeof(arr));
            // console.log("this.start_date: " + this.start_date); // 2021-04-15T03:48


            // this.selected_workerNum = Object.values(this.selected_workerNum);

            this.register_date = this.$moment().format();

            // const selected_workers_manager = {};

            // selected_workers_manager.push(this.selected_workers);
            // selected_workers_manager.push({user_num: this.manager, personalRole: this.managerRole});
            // console.log("this.selected_workers: " + JSON.stringify(selected_workers_manager));
            
            
            this.$axios.post('http://localhost:3000/addTask', {
                task_name: this.task_name,
                explanation: this.explanation,
                start_date: this.start_date,
                end_date: this.end_date,
                manager: this.manager,
                importance: false,
                register_date: this.register_date,
                complete_time: null,
                label_color: this.label_color,
                manager_role: this.managerRole,
                selected_workers_list: this.selected_workers,
                complete: false,
            }).then(res => {
                console.log("업무 등록 성공!")
                alert("업무가 등록되었습니다.")
                this.$router.go(-1)
            }).catch(err => {
                console.log("업무 등록 ERROR!!: ", err)
            })           
        },
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
        /* -webkit-writing-mode: horizontal-tb !important; */
        text-rendering: auto;
        /* color: -internal-light-dark(black, white); */
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        /* display: inline-block; */
        text-align: start;
        /* appearance: auto;
        background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59)); */
        -webkit-rtl-ordering: logical;
        cursor: text;
        margin: 0em;
        font: 400 13.3333px Arial;
        /* padding: 1px 2px;
        border-width: 2px;
        border-style: inset;
        border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
        border-image: initial; */
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
        border-color: #686868 !important;
    }

    .labelColor:checked{
        border-color: #686868;
    }

    .labelColor:hover{
        opacity: 0.7;
    }

    input[type="datetime-local"]:disabled {
        background: #c2c2c2;
    }
    /* input[type="datetime-local"]::-webkit-outer-spin-button,
    input[type="datetime-local"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    } */
    /* input[type="datetime-local"]::-webkit-datetime-edit-text { 
        -webkit-appearance: none; 
        display: none; 
    } 
        
    input[type="datetime-local"]::-webkit-datetime-edit-month-field{ 
        -webkit-appearance: none; 
        display: none; 
    } 
    
    input[type="datetime-local"]::-webkit-datetime-edit-day-field { 
        -webkit-appearance: none; 
        display: none; 
    } 
        
    input[type="datetime-local"]::-webkit-datetime-edit-year-field { 
        -webkit-appearance: none; 
        display: none; 
    } */

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
        /* width: 370px; */
        padding: 10px;
        /* padding: 0px;  */
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
        /* width: 370px; */
        padding: 10px;
        /* padding: 0px;  */
        box-sizing : border-box;
        vertical-align: top;
        border-radius: 3px;
    }

    #content:hover {
        border-color: #C0C4CC;
    }

    #enrollBtn:hover {
        border-color: #cfcfcf; 
        background-color: #fafafa;
        color: #646464; 
    }

    #enrollBtn:focus {
        border-color: #cfcfcf; 
        background-color: #f5f5f5;
        color: #646464; 
    }
    /* .el-input--suffix{
        padding-right: 5px;
    } */
</style>