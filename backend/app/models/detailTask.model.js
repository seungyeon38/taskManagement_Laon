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

DetailTask.getDetailTaskbyNum = (detailTaskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM detail_task 
        WHERE detail_task_num = ${detailTaskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0]});
                return;
            }

            resolve({err: "not_found", data: res});
        })
    });
}

DetailTask.updateDetailTask = (detailTaskNum, detailTaskName, content, updateDate) => {
    return new Promise(resolve => {
        sql.query(`UPDATE detail_task 
        SET detail_task_name = '${detailTaskName}', 
            content = '${content}', 
            update_date = '${updateDate}'
        WHERE detail_task_num = ${detailTaskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    });
}

DetailTask.deleteDetailTask = (detailTaskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detail_task 
        WHERE detail_task_num = ${detailTaskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    });
}


module.exports = DetailTask;