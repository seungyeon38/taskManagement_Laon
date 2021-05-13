const sql = require("./db.js");
const mysql = require('mysql2/promise');
// const e = require("cors");

const Task = function(task){
    this.task_name = task.task_name;
    this.explanation = task.explanation;
    this.start_date = task.start_date;
    this.end_date = task.end_date;
    this.manager = task.manager;
    this.complete = task.complete;
    this.register_date = task.register_date;
    this.complete_date = task.complete_date
    this.label_color = task.label_color;
};

// async
Task.insertTaskWorker = (taskNum, workerNum, personalRole, importance) => {
    return new Promise(resolve => {
        console.log("insertTaskWorker: " + taskNum)
        sql.query(`INSERT INTO task_worker VALUES(${taskNum}, ${workerNum}, "${personalRole}", ${importance})`, (err, res) => {
            if(err){
                console.log("create_error3: ", err);
                resolve({err: err});
                // resolve(result(err, null));
            }
            console.log("created task_worker: ", {taskNum:taskNum, "worker_num":workerNum});
            resolve({err: null});
        });
    })
}

Task.selectTaskNumbyTaskName = (taskName) => {
    return new Promise(resolve => {
        sql.query(`SELECT task_num FROM task WHERE task_name = '${newTask.task.task_name}'`, (err, res) => {
            if(err){
                console.log("create_error2: ", err)
                resolve({err: err, data: null});
                return;
            }
            resolve({err: err, data: res[0].task_num});
        })
    })
}

Task.insertTask = (newTask) =>{
    return new Promise(resolve => {
        sql.query("INSERT INTO task SET ?", newTask, (err) => {
            if(err){
                console.log("create_error1: ", err);
                resolve({err: err});
                return;
            }
            resolve({err: null});
        })
    })
}

// Task.create = async (newTask, result) => {
//     console.log("task.model.js Task.create");

//     console.log("newTask: " + JSON.stringify(newTask))

//     // const insertTaskWorker = (taskNum, workerNum, personalRole, importance) => {
//     //     return new Promise(resolve => {
//     //         console.log("insertTaskWorker: " + taskNum)
//     //         sql.query(`INSERT INTO task_worker VALUES(${taskNum}, ${workerNum}, "${personalRole}", ${importance})`, (err, res) => {
//     //             if(err){
//     //                 console.log("create_error3: ", err);
//     //                 resolve(err);
//     //                 // resolve(result(err, null));
//     //             }
//     //             console.log("created task_worker: ", {taskNum:taskNum, "worker_num":workerNum});
//     //             resolve(false);
//     //         });
//     //     })
//     // }
    
//     let task_num;
//     var promise;

//     sql.query("INSERT INTO task SET ?", newTask.task, (err) => {
//         if(err){
//             console.log("create_error1: ", err);
//             result(err);
//             return;
//         }

//         console.log("created task: ", {...newTask.task});

//         sql.query(`SELECT task_num FROM task WHERE task_name = '${newTask.task.task_name}'`, async (err, res) => {
//             if(err){
//                 console.log("create_error2: ", err)
//                 result(err);
//                 return;
//             }
//             task_num = res[0].task_num;
//             console.log("task_num: " + task_num);
//             console.log("select task_num 완료");

//             for(let worker of newTask.selected_workers_list){
//                 promise = await insertTaskWorker(task_num, worker.user_num, worker.personalRole, false, result);
                
//                 if(promise){
//                     console.log("err있음1")
//                     result(err);
//                     return;
//                 }
//                 else{
//                     console.log("else1")
//                 }
//             }

//             promise = await insertTaskWorker(task_num, newTask.manager, newTask.manager_role, false);

//             if(promise){
//                 console.log("err있음2")
//                 result(err);
//                 return;
//             }
//             else{
//                 console.log("else2")
//             }
            
//             result(null);
//         });
//     });
// };


// Task.delete = async (taskNum, result) => {
//     console.log("model delete");
        
//     const deleteTask = (taskNum) => {
//         return new Promise(resolve => {
//             sql.query(`DELETE FROM task 
//             WHERE task_num = '${taskNum}'`,  (err) => {
//                 if(err){
//                     console.log("error(task.model.js task delete): ", err);
//                     resolve(err);
//                     return;
//                 }

//                 console.log("task.model.js task delete 끝")
//                 resolve(false);
//             });
//         })
//     }

//     const deleteTaskWorker = (taskNum) => {
//         return new Promise(resolve => {
//             sql.query(`DELETE FROM task_worker 
//             WHERE task_num = '${taskNum}'`,  (err) => {
//                 if(err){
//                     console.log("error(task.model.js task_worker delete): ", err);
//                     resolve(err);
//                     return;
//                 }

//                 console.log("task.model.js task_worker delete 끝")
//                 resolve(false);
//             });
//         })
//     }

//     const deleteDetailTasks = (taskNum) => {
//         return new Promise(resolve => {
//             sql.query(`DELETE FROM detail_task 
//             WHERE task_num = '${taskNum}'`,  (err) => {
//                 if(err){
//                     console.log("error(task.model.js detail_task delete): ", err);
//                     resolve(err);
//                     return;
//                 }
//                 console.log("task.model.js detail_task delete 끝")
//                 resolve(false);
//             });
//         })
//     }

//     var promise = await deleteTask(taskNum);
//     if(promise){
//         console.log("err있음")
//         result(err);
//         return;
//     }

//     promise = await deleteTaskWorker(taskNum);
//     if(promise){
//         console.log("err있음")
//         result(err);
//         return;
//     }

//     promise = await deleteDetailTasks(taskNum);
//     if(promise){
//         console.log("err있음")
//         result(err);
//         return;
//     }

//     console.log("err없음")
//     result(null);
// }

Task.deleteTask = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM task 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                console.log("error(task.model.js task delete): ", err);
                resolve({err: err});
                return;
            }

            console.log("task.model.js task delete 끝")
            resolve({err: null});
        });
    })
}

Task.deleteTaskWorker = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM task_worker 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                console.log("error(task.model.js task_worker delete): ", err);
                resolve({err: err});
                return;
            }

            console.log("task.model.js task_worker delete 끝")
            resolve({err: null});
        });
    })
}

Task.deleteDetailTasks = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`DELETE FROM detail_task 
        WHERE task_num = '${taskNum}'`,  (err) => {
            if(err){
                console.log("error(task.model.js detail_task delete): ", err);
                resolve({err: err});
                return;
            }
            console.log("task.model.js detail_task delete 끝")
            resolve({err: null});
        });
    })
}


// 원래 userId로 하면 안되고 세션으로 해야됨. id는 겹칠 수 있음. (?)
// 자신이 worker, manager로 있는 업무의 리스트를 반환.

// Task.findTasksbyUserId = (user, result) => {
//     let tasks_worker = {};
//     let tasks_manager = {};

//     sql.query(`SELECT 
//     t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color 
//     FROM task_worker as tw
//     LEFT JOIN task as t
//     ON tw.task_num = t.task_num
//     LEFT JOIN user as u
//     ON tw.worker_num = u.user_num   
//     WHERE u.id = '${user.id}'`, (err1, res1) => {
//         if(err1){
//             console.log("error(worker): ", err1);
//             result(err1, null);
//             return;
//         }
//         if(res1.length){
//             console.log("task of worker res: " + JSON.stringify(res1));
//             console.log("num of task worker: " + res1.length);
//             tasks_worker = res1;
//         }
//     });

//     sql.query(`SELECT 
//     t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color
//     FROM user AS u
//     RIGHT OUTER JOIN task AS t
//     ON u.user_num = t.manager
//     WHERE u.id = '${user.id}'`, (err2, res2) => {
//         if(err2){
//             console.log("error(manager): ", err2);
//             result(err2, null);
//             return;
//         }
//         if(res2.length){
//             console.log("task of manager res: " + JSON.stringify(res2));
//             console.log("num of task manager: " + res2.length);
//             tasks_manager = res2;
//         }

//         console.log("tasks_worker_num: " + tasks_worker.length);
//         console.log("tasks_manager_num: " + tasks_manager.length);
//         console.log("user.user_num: " + user.user_num);
//         result(null, {"tasks_worker":tasks_worker, "tasks_manager":tasks_manager, "userNum":user.user_num});
//     }); 
// };

Task.selectTasksofWorkers = (userId) => {
    console.log("model selectTasksofWorkers")
    return new Promise(resolve => {
        sql.query(`SELECT 
        t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.complete, t.register_date, t.complete_date, t.label_color 
        FROM task_worker as tw
        RIGHT JOIN task as t
        ON tw.task_num = t.task_num AND tw.worker_num != t.manager
        LEFT JOIN user AS u
        ON tw.worker_num = u.user_num   
        WHERE u.id = '${userId}'`, (err, res) => {
            if(err){
                console.log("error(worker): ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("task of worker res: " + JSON.stringify(res));
                console.log("num of task worker: " + res.length);
                resolve({err: null, data: res});
            }
            // select된 task가 없을 경우 
            resolve({err: null, data: res})
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
        ON tw.task_num = t.task_num AND tw.worker_num = t.manager
        WHERE u.id = '${userId}'`, (err, res) => {
            if(err){
                console.log("error(manager): ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("task of manager res: " + JSON.stringify(res));
                console.log("num of task manager: " + res.length);
                resolve({err: null, data: res});
            }
            // select된 task가 없을 경우 
            resolve({err: null, data: res})
        }); 
    })
}




// Task.findTasksbyUserId = async (user, result) => {
//     const selectTasksofWorkers = (userId) => {
//         return new Promise(resolve => {
//             sql.query(`SELECT 
//             t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.complete, t.register_date, t.complete_date, t.label_color 
//             FROM task_worker as tw
//             RIGHT JOIN task as t
//             ON tw.task_num = t.task_num AND tw.worker_num != t.manager
//             LEFT JOIN user AS u
//             ON tw.worker_num = u.user_num   
//             WHERE u.id = '${userId}'`, (err, res) => {
//                 if(err){
//                     console.log("error(worker): ", err);
//                     resolve({err: err, data: null});
//                     return;
//                 }
//                 if(res.length){
//                     console.log("task of worker res: " + JSON.stringify(res));
//                     console.log("num of task worker: " + res.length);
//                     resolve({err: null, data: res});
//                     return;
//                 }
//             });
//         })
//     }

//     const selectTasksofManager = (userId) => {
//         return new Promise(resolve => {
//             sql.query(`SELECT t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, tw.importance, t.complete, t.register_date, t.complete_date, t.label_color
//             FROM task as t
//             LEFT JOIN user AS u
//             ON t.manager = u.user_num
//             LEFT JOIN task_worker AS tw
//             ON tw.task_num = t.task_num AND tw.worker_num = t.manager
//             WHERE u.id = '${userId}'`, (err, res) => {
//                 if(err){
//                     console.log("error(manager): ", err);
//                     resolve({err: err, data: null});
//                     return;
//                 }
//                 if(res.length){
//                     console.log("task of manager res: " + JSON.stringify(res));
//                     console.log("num of task manager: " + res.length);
//                     resolve({err: null, data: res});
//                     return;
//                 }
//             }); 
//         })
//     }

//     const promise1 = await selectWorkers(user.id);

//     if(promise1.err){
//         result(err, null);
//         return;
//     }

//     const promise2 = await selectManager(user.id);
    
//     if(promise2.err){
//         result(err, null);
//         return;
//     }
    
//     // result(null, {"tasks_worker": promise1.data, "tasks_manager": promise2.data})
//     result(null, {"tasks_worker": promise1.data, "tasks_manager": promise2.data, "userNum":user.user_num})

//     // console.log("tasks_worker_num: " + tasks_worker.length);
//     // console.log("tasks_manager_num: " + tasks_manager.length);
//     // console.log("user.user_num: " + user.user_num);
//     // result(null, {"tasks_worker":tasks_worker, "tasks_manager":tasks_manager, "userNum":user.user_num});


//     // 후에 usernum은 front에 저장되어있어야 한다. 
// };

// Task.findTasksbyUserId = (user, result) => {
//     let tasks_worker = {};
//     let tasks_manager = {};

//     sql.query(`SELECT 
//     t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color 
//     FROM user AS u 
//     RIGHT OUTER JOIN task_worker AS tw 
//     ON u.user_num = tw.worker_num 
//     LEFT OUTER JOIN task AS t 
//     ON tw.task_num = t.task_num 
//     WHERE u.id = '${user.id}'`, (err1, res1) => {
//         if(err1){
//             console.log("error(worker): ", err1);
//             result(err1, null);
//             return;
//         }
//         if(res1.length){
//             console.log("task of worker res: " + JSON.stringify(res1));
//             console.log("num of task worker: " + res1.length);
//             tasks_worker = res1;
//         }
//     });

//     sql.query(`SELECT 
//     t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color
//     FROM user AS u
//     RIGHT OUTER JOIN task AS t
//     ON u.user_num = t.manager
//     WHERE u.id = '${user.id}'`, (err2, res2) => {
//         if(err2){
//             console.log("error(manager): ", err2);
//             result(err2, null);
//             return;
//         }
//         if(res2.length){
//             console.log("task of manager res: " + JSON.stringify(res2));
//             console.log("num of task manager: " + res2.length);
//             tasks_manager = res2;
//         }

//         console.log("tasks_worker_num: " + tasks_worker.length);
//         console.log("tasks_manager_num: " + tasks_manager.length);
//         console.log("user.user_num: " + user.user_num);
//         result(null, {"tasks_worker":tasks_worker, "tasks_manager":tasks_manager, "userNum":user.user_num});
//     }); 
// };

// task: task_num, complete_date
// task_num에 해당하는 task의 complete에 true대입, complete_date에 complete_date대입 
Task.updateComplete = (task) => { 
    return new Promise(resolve => {
        sql.query(`UPDATE task 
        SET complete = true, 
        complete_date = '${task.complete_date}' 
        WHERE task_num = ${task.task_num}`, (err) => {
            if(err){
                console.log("error(task.model.js taskComplete): ", err);
                resolve({err: err});
                // result(err);
                return;
            }

            console.log("task.model.js taskComplete update 끝")
            resolve({err: null});
            // result(null);
            return;
        })
    })
}

Task.updateImportance = (taskInfo) => {
    return new Promise(resolve => {
        sql.query(`UPDATE task_worker 
        SET importance = ${taskInfo.importance} 
        WHERE task_num = ${taskInfo.task_num} AND worker_num = ${taskInfo.worker_num}`, (err) => {
            if(err){
                console.log("error(task.model.js updateImportance): ", err);
                resolve({err: err});
                return;
            }

            console.log("task.model.js updateImportance update 끝")
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
                console.log("error(task.model.js getDetailTasksbyTaskNum): ", err);
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                console.log("task.model.js getDetailTasksbyTaskNum 끝");
                return;
            }
            resolve({err: null, data: res})
        })
    })
}

Task.getWorkersbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT tw.worker_num, tw.personal_role, u.name, u.id, u.email, u.profile_img
        FROM task_worker AS tw
        RIGHT JOIN task as t
        ON tw.task_num = t.task_num AND tw.worker_num != t.manager
        LEFT JOIN user AS u
        ON u.user_num = tw.worker_num 
        WHERE tw.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                console.log("error(task.model.js getWorkersbyTaskNum): ", err);
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                console.log("task.model.js getWorkersbyTaskNum 끝")
                return;
            }
            resolve({err: null, data: res})
        })
    })
}

Task.getManagerbyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT t.manager, tw.personal_role, u.name, u.id, u.email, u.profile_img
        FROM task AS t
        LEFT JOIN user AS u
        ON t.manager = u.user_num
        LEFT JOIN task_worker AS tw
        ON tw.task_num = t.task_num AND tw.worker_num = t.manager
        WHERE t.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                console.log("error(task.model.js getManagerbyTaskNum): ", err);
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                console.log("task.model.js getManagerbyTaskNum 끝")
                return;
            }
            resolve({err: null, data: res})
        })
    })
}

Task.getTaskInfobyTaskNum = (taskNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM task WHERE task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve({err: err, data: null});
                console.log("error(task.model.js getTaskInfobyTaskNum): ", err);
                return;
            }
            if(res.length){
                console.log("res: " + JSON.stringify(res));
                resolve({err: null, data: res});
                console.log("task.model.js getTaskInfobyTaskNum 끝")
                return;
            }
            resolve({err: null, data: res})
        })
    })
}



module.exports = Task;