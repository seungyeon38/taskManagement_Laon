const sql = require("./db.js");
const mysql = require('mysql2/promise');
// const e = require("cors");

const Task = function(task){
    this.task_name = task.task_name;
    this.explanation = task.explanation;
    this.start_date = task.start_date;
    this.end_date = task.end_date;
    this.manager = task.manager;
    this.manager_role = task.manager_role;
    this.completed = task.completed;
    this.registered_date = task.registered_date;
    this.completed_date = task.completed_date;
    this.label_color = task.label_color;
    this.update_date = task.update_date;
};

// insert
Task.insertTask = (newTask) =>{
    return new Promise(resolve => {
        sql.query("INSERT INTO task SET ?", newTask, (err) => {
            if(err){
                resolve({err: err});
                return;
            }
            resolve({err: null});
        })
    })
}

Task.insertTaskWorker = (taskNum, workerNum, personalRole, importance) => {
    return new Promise(resolve => {
        sql.query(`INSERT INTO task_worker VALUES(${taskNum}, ${workerNum}, "${personalRole}", ${importance})`, (err) => {
            if(err){
                resolve({err: err});
            }
            resolve({err: null});
        });
    })
}

Task.insertChecklists = (taskNum, content, completed) => {
    return new Promise(resolve => {
        sql.query(`INSERT INTO checklist (task_num, content, completed) VALUES(${taskNum}, '${content}', ${completed})`, (err) => {
            if(err){
                resolve({err: err});
            }
            resolve({err: null});
        });
    })
}

// get
Task.getTaskNumbyTaskName = (taskName) => {
    return new Promise(resolve => {
        sql.query(`SELECT task_num FROM task WHERE task_name = '${taskName}'`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0].task_num});
                return;
            }
            
            resolve({err: "not_found", data: res});
        })
    })
}

Task.getTasksbyUserNum = (userNum) => {
    console.log("model selectTasksofWorkers")
    return new Promise(resolve => {
        sql.query(`SELECT t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.completed, t.registered_date, t.completed_date, t.label_color, u.name 
        FROM task_worker as tw
        RIGHT JOIN task as t
        ON tw.task_num = t.task_num
        LEFT JOIN user as u 
        ON t.manager = u.user_num
        WHERE tw.user_num = '${userNum}'`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                return;
            }

            resolve({err: "not_found", data: res})
        });
    })
}

Task.getWorkersbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT tw.user_num, tw.personal_role, u.name, u.id, u.email, u.profile_img
        FROM task_worker AS tw
        RIGHT JOIN task as t
        ON tw.task_num = t.task_num AND tw.user_num != t.manager
        LEFT JOIN user AS u
        ON u.user_num = tw.user_num 
        WHERE tw.task_num = ${taskNum}`, (err, res) => {
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

Task.getManagerbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT t.manager, t.manager_role, u.name, u.id, u.email, u.profile_img
        FROM task AS t
        LEFT JOIN user AS u
        ON t.manager = u.user_num
        WHERE t.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0]});
                return;
            }

            resolve({err: "not_found", data: res})
        })
    })
}

Task.getTaskInfobyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT task_num, task_name, explanation, start_date, end_date, registered_date, completed_date, update_date, label_color, completed FROM task WHERE task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0]});
                return;
            }

            resolve({err: "not_found", data: res})
        })
    })
}

Task.getImportancebyTaskNumUserNum = (taskNum, userNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT importance 
        FROM task_worker 
        WHERE task_num = ${taskNum} AND user_num = ${userNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0].importance});
                return;
            }

            resolve({err: "not_found", data: res})
        })
    })
}

Task.getTaskWorkerbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM task_worker WHERE task_num = ${taskNum}`, (err, res) => {
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

Task.getDetailTasksbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT dt.detailtask_num, dt.task_num, dt.worker, dt.detailtask_name, dt.content, dt.report_date, u.id, u.name, u.email, u.profile_img
        FROM detailtask AS dt
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

Task.getChecklists = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT dc.detailtask_num, c.checklist_num, c.content, c.completed
        FROM detailtask AS dt
        LEFT JOIN detailtask_checklist AS dc 
        ON dt.detailtask_num = dc.detailtask_num
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

Task.getChecklistsbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM checklist WHERE task_num = ${taskNum}`, (err, res) => {
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

Task.getChecklistCompleted = (taskNum, checklistNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT completed FROM checklist WHERE task_num = ${taskNum} AND checklist_num = ${checklistNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res[0].completed});
                return;
            }

            resolve({err: "not_found", data: res})
        })
    })
}

// delete
Task.deleteTaskbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM task 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteTaskWorkerbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM task_worker 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteTaskWorkerbyTaskNumUserNum = (taskNum, userNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM task_worker 
        WHERE task_num = '${taskNum}' AND user_num = '${userNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteDetailTasksbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detailtask 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteChecklistsbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM checklist
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteDetailTaskChecklistsbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detailtask_checklist
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteChecklists = (checklistNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM checklist
        WHERE checklist_num = '${checklistNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.deleteDetailTaskChecklists = (checklistNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detailtask_checklist
        WHERE checklist_num = '${checklistNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

// update
Task.updateComplete = (taskNum, completed, completedDate) => { 
    return new Promise(resolve => {
        sql.query(`UPDATE task 
        SET completed = ${completed}, 
        completed_date = '${completedDate}' 
        WHERE task_num = ${taskNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateImportance = (taskNum, userNum, importance) => {
    return new Promise(resolve => {
        sql.query(`UPDATE task_worker 
        SET importance = ${importance} 
        WHERE task_num = ${taskNum} AND user_num = ${userNum}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateTask = (taskInfo) => {
    console.log("taskInfo: " + JSON.stringify(taskInfo));

    return new Promise(resolve => {
        sql.query(`UPDATE task 
        SET task_name = '${taskInfo.task_name}', 
            explanation = '${taskInfo.explanation}', 
            start_date = '${taskInfo.start_date}',
            end_date = '${taskInfo.end_date}', 
            update_date = '${taskInfo.update_date}', 
            label_color = '${taskInfo.label_color}', 
            manager = ${taskInfo.manager}, 
            manager_role = '${taskInfo.manager_role}'
        WHERE task_num = ${taskInfo.task_num}`, (err) => {
            if(err){
                console.log(err)
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateTaskWorker = (taskNum, userNum, personalRole) => {
    return new Promise(resolve => {
        sql.query(`UPDATE task_worker 
        SET personal_role = '${personalRole}'
        WHERE task_num = ${taskNum} AND user_num = ${userNum}`, (err) => {
            if(err){
                console.log(err)
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateChecklistCompleted = (checklistNum, completed) => {
    return new Promise(resolve => {
        sql.query(`UPDATE checklist
        SET completed = ${completed}
        WHERE checklist_num = ${checklistNum}`, (err) => {
            if(err){
                console.log(err)
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateChecklists = (checklistNum, content) => {
    return new Promise(resolve => {
        sql.query(`UPDATE checklist
        SET content = '${content}'
        WHERE checklist_num = ${checklistNum}`, (err) => {
            if(err){
                console.log(err)
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}


module.exports = Task;