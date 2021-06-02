const sql = require("./db.js");

const DetailTask = function(detailTask){
    this.task_num = detailTask.task_num;
    this.detailtask_name = detailTask.detailtask_name;
    this.worker = detailTask.worker;
    this.content = detailTask.content;
    this.report_date = detailTask.report_date;
};

// insert
DetailTask.insertDetailTask = (detailTask) => {
    return new Promise(resolve => {
        sql.query("INSERT INTO detailtask SET ?", detailTask, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        })
    });
}

DetailTask.insertDetailTaskChecklist = (taskNum, detailTaskNum, checklistNum) => {
    return new Promise(resolve => { 
        sql.query(`INSERT INTO detailtask_checklist(task_num, detailtask_num, checklist_num) VALUES(${taskNum}, ${detailTaskNum}, ${checklistNum})`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        })
    });
}

// get
DetailTask.getDetailTaskbyNum = (detailTaskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM detailtask 
        WHERE detailtask_num = ${detailTaskNum}`, (err, res) => {
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

DetailTask.getRecentDetailTaskNum = (userNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT MAX(detailtask_num) FROM detailtask
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

// DetailTask.getChecklistsbyNum = (detailTaskNum) => {
//     return new Promise(resolve => {
//         sql.query(`SELECT c.checklist_num, c.content, c.completed FROM detail_task AS dt 
//         LEFT JOIN detailtask_checklist AS dc
//         ON dt.detail_task_num = dc.detail_task_num
//         LEFT JOIN checklist AS c
//         ON dc.checklist_num = c.checklist_num
//         WHERE dc.detail_task_num = ${detailTaskNum}`, (err, res) => {
//             if(err){
//                 resolve({err: err, data: null});
//                 return;
//             }
//             if(res.length){
//                 resolve({err: null, data: res});
//                 return;
//             }
//             resolve({err: "not_found", data: res})
//         })
//     })
// }

DetailTask.getChecklistNumsbyNum = (detailTaskNum) => {
    console.log(detailTaskNum)
    return new Promise(resolve => {
        sql.query(`SELECT checklist_num FROM detailtask_checklist
        WHERE detailtask_num = ${detailTaskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                // console.log("getChecklistsbyNum " + JSON.stringify(res));
                resolve({err: null, data: res});
                return;
            }
            resolve({err: "not_found", data: res})
        })
    }) 
}

// update
DetailTask.updateDetailTask = (detailTaskNum, detailTaskName, content, updateDate) => {
    return new Promise(resolve => {
        sql.query(`UPDATE detailtask 
        SET detailtask_name = '${detailTaskName}', 
            content = '${content}', 
            update_date = '${updateDate}'
        WHERE detailtask_num = ${detailTaskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    });
}

// delete
DetailTask.deleteDetailTask = (detailTaskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detailtask 
        WHERE detailtask_num = ${detailTaskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    });
}

DetailTask.deleteDetailTaskChecklists = (detailTaskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detailtask_checklist 
        WHERE detailtask_num = ${detailTaskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    });
}



module.exports = DetailTask;