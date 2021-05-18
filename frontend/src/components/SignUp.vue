<template>
    <el-container class="container">
        <el-form @submit.prevent.native="signUp" label-width="150px" style="margin: auto;"> 
            <table>
                <tr style="text-align: left;">
                    <td colspan="2">
                        <router-link class="signUpRouter" to="logIn">
                            <el-button icon="el-icon-back" circle></el-button>
                        </router-link>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-avatar v-if="src" :src="src" shape="square" :size="180" style="font-size: 8rem; border: 1px solid #DCDFE6"></el-avatar>
                        <el-avatar v-else icon="el-icon-user-solid" :size="180" shape="square" style="font-size: 8rem; border: 1px solid #DCDFE6"></el-avatar>
                        <div class="filebox" style="margin-top: 30px">
                            <label for="profile_img">이미지 업로드</label>
                            <div style="font-size: 0.8em; margin-top: 10px; color: #8b8b8b">(1:1비율의 이미지 권장)</div>
                            <input type="file" id="profile_img" name="profile_img" v-on:change="setImage" accept="image/png, image/jpeg, image/jpg" />
                        </div>
                    </td>
                    <td style="font-weight: normal;">
                        <el-form-item label="이름" for="name">
                            <el-input v-model="name" type="text" name="name" required /> 
                        </el-form-item>
                        <el-form-item label="아이디" for="id">
                            <el-input v-model="id" type="text" name="id" minlength="8" maxlength="12" placeholder="최소 8자, 최대 12자" required />
                        </el-form-item>
                        <el-form-item label="비밀번호" for="password" style="margin-bottom:0px;">
                            <el-input v-model="password" type="password" name="password" minlength="8" maxlength="12" placeholder="최소 8자, 최대 12자" show-password required />
                        </el-form-item>
                        <el-form-item label="비밀번호 확인" for="password_re">
                            <el-input v-model="password_re" type="password" name="password_re" show-password required />
                        </el-form-item>
                        <el-form-item label="이메일" for="email">
                            <el-input v-model="email" type="email" name="email" required />
                        </el-form-item>
                        <br>
                        <br>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <el-button native-type="submit" name="button" style="width: 150px;">
                            확인
                        </el-button>
                    </td>
                </tr>
            </table>
        </el-form>
    </el-container>
</template>

<script>
    export default{
        data(){
            return{
                name:'',
                id:'',
                password:'',
                password_re: '',
                email:'',
                src: '',
                files: {},
                formData: '',
            }   
        },
        methods:{
            signUp(){
                // 유효성 검사
                var type_numOrEng = /^[a-zA-Z0-9]+$/;
                var type_includeNumEng = /(?=.*\d)(?=.*[a-zA-Z])/;

                // id가 대소문자와 숫자로만 이루어져있는지 
                if(type_numOrEng.test(this.id)){
                    // pw는 대소문자와 숫자로만 이루어져있고, 대소문자와 숫자가 꼭 들어가도록 설정 
                    if(type_numOrEng.test(this.password) && type_includeNumEng.test(this.password)){
                        // 비밀번호, 비밀번호 확인이 일치하지 않는 경우
                        if(this.password === this.password_re){
                            // id가 이미 존재하는 아이디인지 확인.(중복 확인)
                            this.$axios.get('http://localhost:3000/checkIdExist/'+ this.id
                            ).then(res => {
                                console.log("res")
                                if(res.data.result == true){
                                    let formData = new FormData();
                                    if(this.files.length){
                                        formData.append('profile_img', this.files[0]);
                                        formData.append('name', this.name);
                                        formData.append('id', this.id);
                                        formData.append('password', this.password);
                                        formData.append('email', this.email);
                                    }
                                    else{
                                        formData.append('name', this.name);
                                        formData.append('id', this.id);
                                        formData.append('password', this.password);
                                        formData.append('email', this.email);
                                    }
                                    // 비밀번호는 db에 암호화해서 들어가야 한다. 
                                    this.$axios({
                                        url: 'http://localhost:3000/signUp',
                                        method: 'post',
                                        data: formData,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },   
                                    }).then(res => {
                                        alert("회원가입을 축하드립니다. 로그인 후 사용해주세요.");
                                        this.$router.push({name: 'logIn'});
                                    }).catch((err) => {
                                        console.log("err: ", err);
                                    })
                                }
                                else if(res.data.result == false){
                                    alert("존재하는 아이디입니다. 다른 아이디를 입력해주세요.");
                                }
                            }).catch(err => {
                                console.log("err: ", err);
                            });
                        }
                        else{
                            alert("비밀번호가 일치하지 않습니다.");
                        }                       
                    }
                    else{
                        alert("비밀번호는 대소문자와 숫자(최소 8자, 최대 12자)를 포함하여 구성하여야 합니다.");
                    }   
                }
                else{
                    alert("아이디는 대소문자나 숫자(최소 8자, 최대 12자)로 구성하여야 합니다.");
                }
            },
            setImage(event){
                this.files = event.target.files;
                console.log("this.files[0]: " + this.files[0])
                this.src = window.URL.createObjectURL(this.files[0]) // Blob 객체를 가리키는 URL을 생성하여 DOM에서 참조할 수 있게 함.
                console.log("this.src: " + JSON.stringify(this.src))
            }
        },
    }
</script>

<style scoped>
    .container{
        position: absolute;
        width: 800px; 
        height: 550px; 
        top: 50%;
        left: 50%;
        margin: -275px 0 0 -400px; 
        border: 1px solid #eee; 
        border-radius: 2px; 
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .filebox label { 
        display: inline-block; 
        padding: .4em 1em; 
        color: #606266; 
        font-size: 14px; 
        line-height: normal; 
        vertical-align: middle; 
        background-color: #fdfdfd; 
        cursor: pointer; 
        border: 1px solid #ebebeb; 
        border-bottom-color: #e2e2e2; 
        border-radius: .25em; 
    } 

    .filebox label:hover {
        border-color: #cfcfcf; 
        background-color: #fafafa;
        color: #606266;
    }

    .filebox label:active {
        border-color: #cfcfcf; 
        background-color: #f5f5f5;
        color: #646464; 
    }
    
    .filebox input { 
        position: absolute; 
        width: 1px;
        height: 1px; 
        padding: 0; 
        margin: -1px; 
        overflow: hidden; 
        clip: rect(0,0,0,0); 
        border: 0;
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