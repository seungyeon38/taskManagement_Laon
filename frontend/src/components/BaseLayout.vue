<template>
    <el-container>
        <el-header style="height: 60px; line-height: 60px; display:flex; align-items: center; justify-content: flex-end;">
            <span id="logOutRouter" @click="logOut" style="color: #333; text-decoration: none; cursor: default">Logout</span>
            <span class="text-overflow" style="margin-left: 30px; max-width: 100px">{{user.name}}</span><span style=" margin-right: 20px;"> 님</span>
            <el-avatar v-if="user.profile_img" :size="50" style="border: 1px solid #a4a7ad">
                <img :src="require('../../../backend/uploads/' + user.profile_img)" />
            </el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="50" style="font-size: 2rem; border: 1px solid #a4a7ad;"></el-avatar>
            
        </el-header>
        <el-container style="min-height: 1000px;">
            <el-main style="background-color: #f9feff; padding: 50px 120px; margin: 0px auto; min-width: 500px;">
                <slot name="main">
                </slot>
            </el-main>
            <el-aside width="380px" style="background-color: #f0f5f5; text-align: left; padding: 30px; padding-top: 60px; ">
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
                user: {}
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
                console.log("catch");
            });
        },
        // 실행 잘 안됨...?
        mounted() {
            console.log("mounted");
            window.scrollTo(0, 0); 
            console.log("scrollTo");
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
            }
        }
    };
</script>

<style scoped>
    #logOutRouter:hover{
        color: rgb(85, 85, 85) !important;
    }

    #logOutRouter:active{
        color: #333 !important;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-main .el-aside{
        white-space: nowrap;
    }
    
</style>