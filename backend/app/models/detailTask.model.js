const sql = require("./db.js");

const DetailTask = function(detailTask){
    this.task_num = detailTask.task_num;
    this.detail_task_name = detailTask.detail_task_name;
    this.worker = detailTask.worker;
    this.content = detailTask.content;
    this.report_date = detailTask.report_date;
};

DetailTask.addDetailTask = (detailTask, result) => {
    sql.query("INSERT INTO detail_task SET ?", detailTask, (err, res) => {
        if(err){
            console.log("addDetailTask_error: ", err);
            result(err, null);
            return;
        }
        // task_num = res.insertId;
        // console.log("task_num");
        // console.log(task_num);

        console.log("addDetailTask task: ", {...detailTask});
        result(null, {...detailTask});
    })
}

module.exports = DetailTask;