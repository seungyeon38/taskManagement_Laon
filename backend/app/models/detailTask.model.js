const sql = require("./db.js");

const DetailTask = function(detailTask){
    this.task_num = detailTask.task_num;
    this.detail_task_name = detailTask.detail_task_name;
    this.worker = detailTask.worker;
    this.content = detailTask.content;
    this.report_date = detailTask.report_date;
};

DetailTask.insertDetailTask = (detailTask) => {
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

DetailTask.insertDetailTaskChecklist = (detailTaskNum, checklistNum) => {
    return new Promise(resolve => { 
        sql.query(`INSERT INTO detailtask_checklist(detail_task_num, checklist_num) VALUES(${detailTaskNum}, ${checklistNum})`, (err) => {
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

DetailTask.getDetailTasksbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT dt.detail_task_num, dt.task_num, dt.worker, dt.detail_task_name, dt.content, dt.report_date, u.id, u.name, u.email, u.profile_img
        FROM detail_task AS dt
        LEFT JOIN user AS u 
        ON dt.worker = u.user_num
        WHERE dt.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                return;
            }
            resolve({err: "not_found", data: res})
        })
    })
}

DetailTask.getRecentDetailTaskNum = (userNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT MAX(detail_task_num) FROM detail_task
        WHERE worker = ${userNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: Object.values(res[0])[0]});
                return;
            }
            resolve({err: "not_found", data: res})
        })
    })
}

DetailTask.getChecklistsbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT dc.detail_task_num, c.content
        FROM detail_task AS dt
        LEFT JOIN detailtask_checklist AS dc 
        ON dt.detail_task_num = dc.detail_task_num
        RIGHT JOIN checklist AS c
        ON dc.checklist_num = c.checklist_num
        WHERE dt.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                return;
            }
            resolve({err: "not_found", data: res})
        })
    })
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