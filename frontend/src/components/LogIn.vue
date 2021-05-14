<template>
    <el-container class="form_container">
        <el-form class="form" @submit.prevent.native="logIn" label-width="150px">
            <div style="margin-bottom: 20px; font-size:25px">LogIn</div>
            <br>
            <el-input v-model="id" type="text" name="id" placeholder="아이디" style="width: 250px; border-radius:0px;" required /> 
            <el-input v-model="password" type="password" name="pw" placeholder="비밀번호" style="width: 250px; margin-top: 15px" show-password required /> 
            <!-- <el-form-item label="아아디" for="id">
            <el-input v-model="id" type="text" name="id" required /> 
            </el-form-item>
            <el-form-item label="비밀번호" for="password">
            <el-input v-model="password" type="password" name="password" required /> 
            </el-form-item> -->

            <el-button native-type="submit" name="button" style="width: 250px; margin-top:60px;">
            로그인
            </el-button>
            <br>
            <br>
            <router-link class="signUpRouter" to="signUp">회원가입하러가기</router-link>
        </el-form>
    </el-container>
</template>

<script>
export default{
    data(){
        return{
            id:'',
            password:'',
        }
    },
    methods: {
        logIn(){
            this.$axios({
                url: 'http://localhost:3000/login',
                method: 'post',
                data: {
                    id:this.id, 
                    pw:this.password
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            }).then(res => {
                console.log("res.data: " + JSON.stringify(res.data))

                if(res.data.user){
                    this.$store.commit("setUser", res.data.user);
                    this.$router.push({name: 'main'});
                }
                else if(res.data.error_msg){
                    alert(res.data.error_msg)
                }
                
            }).catch(err => {
                console.log("로그인 실패")
                console.log("Login ERROR!!: ", err)

                alert("로그인 실패")
            })
        },
    },
    computed: {
        user(){return this.$store.getters.user;}
    }
}
</script>

<style scoped>
    .form_container{
        position: absolute;
        width: 450px; 
        height: 500px; 
        top: 50%;
        left: 50%;
        margin: -250px 0 0 -225px; 
        border: 1px solid #eee; 
        border-radius: 2px; 
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .form{
        margin: auto;
    }

    .signUpRouter{
        font-weight: normal; 
        font-size: smaller;
        color: #606266;
    }

    button:hover {
        border-color: #cfcfcf; 
        background-color: #fafafa;
        color: #646464; 
    }

    button:focus {
        border-color: #cfcfcf; 
        background-color: #f5f5f5;
        color: #646464; 
    }

</style>