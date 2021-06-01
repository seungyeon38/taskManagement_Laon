<template>
  <div id="app" style="padding: 0px; margin: 0px;">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet">
    <router-view/>
  </div>
  
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "Noto Sans KR", 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.el-textarea__inner{
  padding: 10px 15px;
}

textarea {
  /* border: 1px solid #ccc !important; */
  outline: none;
  font-size: inherit;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

/* input:hover {
  border-color: #d4d4d4 !important; 
} */

input:focus, textarea:focus {
  border-color: #a8a8a8 !important; 
}
/* 
input:hover, textarea:hover {
  border-color: #F5F7FA !important; 
} */

/* input hover 색 */
.color2 {
  color: #C0C4CC !important;
}

/* input focus 색 */
.color3 {
  color: #a8a8a8 !important; 
}

.color4{
  color: #686868 !important;
}

/* input 라벨 색상 */
.color5{
  color: #606266 !important;
}  

/* main 라벨 색상 */
.color6{
  color: #585858 !important;
}

/* 존재하지 않음 */
.color7{
  color: #909399 !important;
}

/* aside content color : #6f7279 */


.date_font_size{
  font-size: 0.9em;
}

html { overflow-y:scroll; }

#taskName {
  padding-left: 15px;
  padding-right: 15px; 
  font-weight: bolder; 
  height: 50px;
  width: 170px; 
}

.text-overflow{
  display:inline-block; 
  text-overflow: ellipsis; 
  overflow: hidden; 
  white-space: nowrap;
}

.btn:hover {
  border-color: #cfcfcf !important; 
  background-color: #fafafa !important;
  color: #646464 !important; 
}

.btn:focus {
  border-color: #cfcfcf !important; 
  background-color: #f5f5f5 !important;
  color: #646464 !important; 
}

.btn2{
  /* background-color: #cfcfcf !important;  */
  background-color: #f0f0f0 !important; 
  color: #646464 !important;
  border-color: #DCDFE6 !important;
}
 
.btn2:hover {
  border-color: #cfcfcf !important; 
  background-color: #e7e7e7 !important;
  color: #646464 !important; 
}

.btn2:focus {
  border-color: #cfcfcf !important; 
  background-color: #f5f5f5 !important;
  color: #646464 !important; 
}

.enroll-task{
  padding: 0px;
  float: right; 
  width: 45px; 
  height: 45px;
  background-color: #b0b8c4;
  border: none;
}

/* .enroll-task:focus{
    opacity: 1 !important;
    background-color: #acb2bd;
} */

.enroll-task:hover{
    opacity: 1 !important;
    /* background-color: #a6a9ad; */
    background-color: #acb2bd;
}

/* .el-container{
  justify-content: center;
} */

.el-dropdown-menu__item:hover{
  background-color: #f5f5f5 !important;
  color: #646464 !important;
}

.el-select-dropdown__item.selected{
  color:#5f6164 !important;
}

.el-select .el-input.is-focus .el-input__inner{
  border-color: #8e9197 !important;

}

.el-select .el-input.is-focus .el-input__inner .el-input__inner:focus .el-select-dropdown.is-multiple{
  color: #444547 !important;
}
</style>

