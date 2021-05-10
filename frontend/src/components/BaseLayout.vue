<template>
    <el-container>
        <!-- <div style="height: 150px"></div> -->
        <el-header style="height: 60px; line-height: 60px; display:flex; align-items: center; justify-content: flex-end;">
            <!-- 원래는 logout하면 세션 없애는 함수를 실행시켜야 한다. -->
            <span id="logOutRouter" @click="logOut" style="color: #333; text-decoration: none; cursor: default">Logout</span>
            <!-- <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
            <span style="margin-left: 30px; margin-right: 20px">{{user.name}} 님</span>
            <el-avatar v-if="user.profile_img" :size="50" style="border: 1px solid #a4a7ad">
                <!-- <img :src="require(user.profile_img)"> -->
                <img :src="require('../../../backend/uploads/' + user.profile_img)" />
                <!-- <img src="../../../backend/uploads/6.jpg" /> -->
            </el-avatar>
            <el-avatar v-else icon="el-icon-user-solid" :size="50" style="font-size: 2rem; border: 1px solid #a4a7ad;"></el-avatar>
            
        </el-header>
        <!-- <el-container style="height: 800px"> -->
        <el-container style="min-height: 1000px;">
            <el-main style="background-color: #f9feff; padding: 50px 120px; margin: 0px auto; min-width: 500px;">
                <slot name="main">
                    <!-- <el-table :data="tableData">
                        <el-table-column prop="date" label="Date" width="140">
                        </el-table-column>
                        <el-table-column prop="name" label="Name" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="Address">
                        </el-table-column>
                    </el-table> -->
                </slot>
            </el-main>
            <!-- <el-aside width="200px" style="background-color: rgb(238, 241, 246)"> -->
            <el-aside width="380px" style="background-color: #f0f5f5; text-align: left; padding: 30px; padding-top: 60px; ">
                <slot name="aside">
                <!-- <el-menu :default-openeds="['1', '3']"> -->
                    <!-- <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>Navigator One</template>
                        <el-menu-item-group>
                        <template slot="title">Group 1</template>
                        <el-menu-item index="1-1">Option 1</el-menu-item>
                        <el-menu-item index="1-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                        <el-menu-item index="1-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                        <template slot="title">Option4</template>
                        <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>Navigator Two</template>
                        <el-menu-item-group>
                        <template slot="title">Group 1</template>
                        <el-menu-item index="2-1">Option 1</el-menu-item>
                        <el-menu-item index="2-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                        <el-menu-item index="2-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="2-4">
                        <template slot="title">Option 4</template>
                        <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>Navigator Three</template>
                        <el-menu-item-group>
                        <template slot="title">Group 1</template>
                        <el-menu-item index="3-1">Option 1</el-menu-item>
                        <el-menu-item index="3-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                        <el-menu-item index="3-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="3-4">
                        <template slot="title">Option 4</template>
                        <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu> -->
                <!-- </el-menu> -->
                </slot>
            </el-aside>
        </el-container>
    </el-container>
    <!-- <div class="container">
        <header>
            <slot name="header"></slot>
        </header>
        <aside>
            <slot name="aside"></slot>
        </aside>
        <main>
            <slot name="main"></slot>
        </main>
    </div> -->
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
            // 사용자 이름, 아이디, 사진 가져오기 
            // "user_num":41,
            // "name":"승연이",
            // "id":"seungyeon38",
            // "password":"$2b$10$h3Eak0qRG6s8.rmjJIFYxeK1tG8MF3B10Mo0i0NtlTjK2.hfrZodq",
            // "email":"seongyeon38@naver.com",
            // "profile_img":"a267d4aa260ac095cbed817b9fd7aa52"
            this.$axios({
                url: 'http://localhost:3000/base',
                method: 'get',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                console.log("BaseLayout")
                console.log("res.data: " + JSON.stringify(res.data));
                console.log("then");
                this.user = res.data;
                // this.user.profile_img = res.data.profile_img;
                // this.profile_img = createElement('img', {attrs: {src: require(`../../../backend/uploads/${res.data.profile_img}`)}})
                // this.profile_img = '../../../backend/uploads/' + res.data.profile_img;
                console.log("this.user.profile_img: " + this.user.profile_img);
                // console.log("typeof(this.user.profile_img): " + typeof(this.user.profile_img));

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
                        console.log("baselayout logOut then");
                        console.log("res.data: " + JSON.stringify(res.data));
                        this.$router.push({name: 'login'})
                        console.log("아?")
                    }
                }).catch(err => {
                    console.log("baselayout logOut catch");
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
        /* overflow: scroll; */
        white-space: nowrap;
    }
    
/* 
    .el-aside {
    color: #333;
    } */
/* 
    .el-dialog{
        margin: 0 auto !important;
    } */
</style>