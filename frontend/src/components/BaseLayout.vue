<template>
    <el-container>
        <el-header style="height: 60px; line-height: 60px; display:flex; align-items: center; justify-content: flex-end;">
            <button type="button" id="home" class="el-icon-s-home" style="color: rgb(94, 94, 94); border: none; padding: 0px; background: none; font-size:1.7em; margin-right: 5px;" @click="goHome"></button>
            <span style="margin-right: 15px;"></span>
            <!-- <button type="button" id="home" class="el-icon-message-solid" style="color: rgb(94, 94, 94); border: none; padding: 0px; background: none; font-size:1.7em; margin-right: 5px;" @click="goHome"></button>
            <span style="margin-right: 20px;">{{alert_num}}</span> -->
            <span id="logOutRouter" @click="logOut" style="color: rgb(94, 94, 94); text-decoration: none; cursor: default">Logout</span>
            <span class="text-overflow" style="margin-left: 30px; max-width: 100px">{{user.name}}</span><span style="margin-right: 20px;"> 님</span>
            <el-avatar v-if="user.profile_img" :size="50" style="border: 1px solid #a4a7ad">
                <img :src="require('../../../backend/uploads/' + user.profile_img)" />
            </el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="50" style="font-size: 2rem; border: 1px solid #a4a7ad;"></el-avatar>
        </el-header>
        <el-container style="min-height: 1000px;">
            <el-main>
                <slot name="main">
                </slot>
            </el-main>
            <el-aside width="380px">
                <slot name="aside">
                </slot>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'base_layout',
        data() {
            return{
                user: {},
                // alert_num: 0
            }
        },
        created(){
            this.$axios({
                url: 'http://localhost:3000/users/info',
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                this.user = res.data;
            }).catch(err => {
                console.log("err: " + err);
            });

            // this.$socket.on('client', (data) => {
            //     console.log("base: " + data);
            //     this.alert_num += 1;
            // })
        },
        // 실행 잘 안됨...?
        mounted() {
            window.scrollTo(0, 0); 
        },
        methods: {
            logOut(){
                console.log("logout")
                this.$axios({
                    url: `http://localhost:3000/logout`,
                    method: 'get',
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "same-origin"    
                }).then(res => {
                    if(res.data.logout == true){
                        this.$router.push({name: 'logIn'})
                    }
                }).catch(err => {
                    alert("로그아웃 실패")
                });
            },
            goHome(){
                this.$router.push({name: 'main'})
            }
        }
    };
</script>

<style scoped>
    #logOutRouter:hover{
        color: rgb(122, 122, 122) !important;
        text-decoration: underline !important;
    }

    .el-header {
        background-color: #f0f4fa;
        color: #333;
        line-height: 60px;
        border-bottom: 1px solid #e4e8eb;
    }

    .el-main {
        background-color: #fff; 
        padding: 50px 120px; 
        margin: 0px auto; 
        min-width: 500px;
        border-right: 1px solid #e4e8eb;
    }

    .el-main .el-aside {
        white-space: nowrap;
    }
    
    .el-aside {
        background-color: #f4f7fa; 
        text-align: left; 
        padding: 30px; 
        padding-top: 60px;
    }
    
    #home:hover{
        color: rgb(122, 122, 122) !important;
    }
</style>