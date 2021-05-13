const sql = require("./db.js");

const DetailTask = function(detailTask){
    this.task_num = detailTask.task_num;
    this.detail_task_name = detailTask.detail_task_name;
    this.worker = detailTask.worker;
    this.content = detailTask.content;
    this.report_date = detailTask.report_date;
};

DetailTask.addDetailTask = (detailTask) => {
    return new Promise(resolve => {
        sql.query("INSERT INTO detail_task SET ?", detailTask, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        })
    });
}

module.exports = DetailTask;