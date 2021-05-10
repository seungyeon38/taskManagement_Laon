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

.date_font_size{
  font-size: 0.9em;
}

html { overflow-y:scroll; }



/* .el-container{
  justify-content: center;
} */
</style>
