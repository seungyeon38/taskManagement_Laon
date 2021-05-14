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
    this.complete = task.complete;
    this.register_date = task.register_date;
    this.complete_date = task.complete_date;
    this.label_color = task.label_color;
    this.update_date = task.update_date;
};

Task.insertTaskWorker = (taskNum, workerNum, personalRole, importance) => {
    return new Promise(resolve => {
        sql.query(`INSERT INTO task_worker VALUES(${taskNum}, ${workerNum}, "${personalRole}", ${importance})`, (err, res) => {
            if(err){
                resolve({err: err});
                // resolve(result(err, null));
            }
            resolve({err: null});
        });
    })
}

// Task.insertTaskManager = (taskNum, managerNum, managerRole, importance) => {
//     return new Promise(resolve => {
//         sql.query(`INSERT INTO task_worker VALUES(${taskNum}, ${managerNum}, "${managerRole}", ${importance})`, (err, res) => {
//             if(err){
//                 resolve({err: err});
//                 // resolve(result(err, null));
//             }
//             resolve({err: null});
//         });
//     })
// }

Task.selectTaskNumbyTaskName = (taskName) => {
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

Task.deleteTask = (taskNum) => {
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

Task.deleteTaskWorker = (taskNum) => {
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

Task.deleteDetailTasks = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detail_task 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
        });
    })
}

Task.selectTasksofWorkers = (userId) => {
    console.log("model selectTasksofWorkers")
    return new Promise(resolve => {
        sql.query(`SELECT 
        t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.complete, t.register_date, t.complete_date, t.label_color 
        FROM task_worker as tw
        RIGHT JOIN task as t
        ON tw.task_num = t.task_num AND tw.user_num != t.manager
        LEFT JOIN user AS u
        ON tw.user_num = u.user_num   
        WHERE u.id = '${userId}'`, (err, res) => {
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

Task.selectTasksofManager = (userId) => {
    return new Promise(resolve => {
        sql.query(`SELECT t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.complete, t.register_date, t.complete_date, t.label_color
        FROM task as t
        LEFT JOIN user AS u
        ON t.manager = u.user_num
        LEFT JOIN task_worker AS tw
        ON tw.task_num = t.task_num AND tw.user_num = t.manager
        WHERE u.id = '${userId}'`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
            }

            resolve({err: "not_found", data: res})
        }); 
    })
}

// task: task_num, complete_date
// task_num에 해당하는 task의 complete에 true대입, complete_date에 complete_date대입 
Task.updateComplete = (taskInfo) => { 
    return new Promise(resolve => {
        sql.query(`UPDATE task 
        SET complete = true, 
        complete_date = '${taskInfo.complete_date}' 
        WHERE task_num = ${taskInfo.task_num}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.updateImportance = (taskInfo) => {
    return new Promise(resolve => {
        sql.query(`UPDATE task_worker 
        SET importance = ${taskInfo.importance} 
        WHERE task_num = ${taskInfo.task_num} AND user_num = ${taskInfo.user_num}`, (err) => {
            if(err){
                resolve({err: err});
                return;
            }

            resolve({err: null});
            return;
        })
    })
}

Task.getDetailTasksbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * 
        FROM detail_task 
        WHERE task_num = ${taskNum}`, (err, res) => {
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

// Task.getManagerbyTaskNum = (taskNum) => {
//     return new Promise(resolve => {
//         sql.query(`SELECT t.manager, tw.personal_role, u.name, u.id, u.email, u.profile_img
//         FROM task AS t
//         LEFT JOIN user AS u
//         ON t.manager = u.user_num
//         LEFT JOIN task_worker AS tw
//         ON tw.task_num = t.task_num AND tw.user_num = t.manager
//         WHERE t.task_num = ${taskNum}`, (err, res) => {
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
        sql.query(`SELECT task_num, task_name, explanation, start_date, end_date, register_date, complete_date, label_color, complete FROM task WHERE task_num = ${taskNum}`, (err, res) => {
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

// 해당하는 taskNum의 정보. 
// 관리자, 관리자 역할 
// 사용자, 각 사용자의 역할 따로따로 

// Task.getTaskWorkersbyTaskNum = (taskNum) => {
//     return new Promise(resolve => {
//         sql.query(`SELECT user_num, personal_role
//         FROM task_worker AS tw
//         LEFT JOIN task AS t 
//         ON tw.task_num = t.task_num
//         WHERE t.task_num = ${taskNum} AND tw.user_num != t.manager`, (err, res) => {
//             if(err){
//                 resolve({err: err, data: null});
//             }
//             if(res.length){
//                 resolve({err: null, data: res});
//                 return;
//             }

//             resolve({err: "not_found", data: res});
//         });
//     })
// }

// Task.getTaskManagerbyTaskNum = (taskNum) => {
//     return new Promise(resolve => {
//         sql.query(`SELECT * FROM task WHERE task_num = ${taskNum}`, (err, res) => {
//             if(err){
//                 resolve({err: err});
//                 // resolve(result(err, null));
//             }
//             if(res.length){
//                 resolve({err: null, data: res});
//                 return;
//             }

//             resolve({err: "not_found", data: res});
//         });
//     })
// }

Task.updateTaskInfo = (taskInfo) => {
    console.log("taskInfo: " + JSON.stringify(taskInfo));
    console.log("taskInfo.task_name " + taskInfo.task_name);

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

Task.getImportance = (taskInfo) => {
    console.log("taskInfo " + JSON.stringify(taskInfo))
    return new Promise(resolve => {
        sql.query(`SELECT importance 
        FROM task_worker 
        WHERE task_num = ${taskInfo.task_num} AND user_num = ${taskInfo.user_num}`, (err, res) => {
            // console.log(10)
            if(err){
                resolve({err: err, data: null});
                return;
            }
            // console.log("res " + JSON.stringify(res))
            // console.log(11)
            if(res.length){
                // console.log(12)

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
// Task.updateTaskInfo = (taskInfo) => {
//     console.log("taskInfo: " + JSON.stringify(taskInfo));
//     console.log("taskInfo.task_name " + taskInfo.task_name)
//     console.log(11)
//     return new Promise(resolve => {
//         sql.query(`UPDATE task 
//         SET (task_name, explanation, start_date, end_date, update_date, label_color, manager, manager_role) 
//         = ('${taskInfo.task_name}', '${taskInfo.explanation}', '${taskInfo.start_date}', '${taskInfo.end_date}', '${taskInfo.update_date}', '${taskInfo.label_color}', ${taskInfo.manager}, '${taskInfo.manager_role}')
//         WHERE task_num = ${taskInfo.task_num}`, (err) => {
//             console.log(12)
//             if(err){
//                 console.log(err)
//                 resolve({err: err});
//                 return;
//             }
//             console.log(13)
//             resolve({err: null});
//             return;
//         })
//     })
// }


module.exports = Task;