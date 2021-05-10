const sql = require("./db.js");
const mysql = require('mysql2/promise');
// const e = require("cors");

const Task = function(task){
    this.task_name = task.task_name;
    this.explanation = task.explanation;
    this.start_date = task.start_date;
    this.end_date = task.end_date;
    this.manager = task.manager;
    this.importance = task.importance;
    this.complete = task.complete;
    this.register_date = task.register_date;
    this.complete_date = task.complete_date
    this.label_color = task.label_color;
    this.manager_role = task.manager_role;
};

// async
Task.create = (newTask, result) => {
    console.log("task.model.js Task.create");
    // newTask[0]: task객체, newTask[1]: task에 등록된 worker_num배열
    let task_num;
    console.log("newTask[0]: " + JSON.stringify(newTask[0]))
    sql.query("INSERT INTO task SET ?", newTask[0], (err, res) => {
        if(err){
            console.log("create_error1: ", err);
            result(err, null);
            return;
        }
        
        // task_num = res.insertId;
        // console.log("task_num");
        // console.log(task_num);

        console.log("created task: ", {...newTask[0]});
        result(null, {...newTask[0]});

        //
        sql.query(`SELECT task_num FROM task WHERE task_name = '${newTask[0].task_name}'`,(err, res) => {
            if(err){
                console.log("create_error2: ", err)
                result(err, null);
                return;
            }
            task_num = res[0].task_num;
            console.log("task_num: " + task_num);
            console.log("select task_num 완료");
            // console.log("newTask[1]: " + newTask[1])
            // console.log("typeof(newTask[1]): " + typeof(newTask[1]))
            // 
            for(let worker of newTask[1]){
                sql.query(`INSERT INTO task_worker VALUES('${task_num}', '${worker.user_num}', '${worker.personalRole}')`,(err, res) => {
                    if(err){
                        console.log("create_error3: ", err);
                        result(err, null);
                        return;
                    }
            
                    console.log("created task_worker: ", {id:task_num, "worker_num":worker.user_num});
                    // result(null, {id: task_num, "worker_num":worker});
                });
            }
            // console.log("res[0].task_num: " + res[0].task_num);
            // console.log("typeof(res.task_num): " + typeof(res.task_num));
            // console.log("JSON.stringify(res): "+ JSON.stringify(res))
            // console.log("task_num: " + task_num);
        });
    });
};

// 원래 userId로 하면 안되고 세션으로 해야됨. id는 겹칠 수 있음. (?)
// 자신이 worker, manager로 있는 업무의 리스트를 반환.

Task.findTasksbyUserId = (user, result) => {
    let tasks_worker = {};
    let tasks_manager = {};

    sql.query(`SELECT 
    t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color 
    FROM task_worker as tw
    LEFT JOIN task as t
    ON tw.task_num = t.task_num
    LEFT JOIN user as u
    ON tw.worker_num = u.user_num   
    WHERE u.id = '${user.id}'`, (err1, res1) => {
        if(err1){
            console.log("error(worker): ", err1);
            result(err1, null);
            return;
        }
        if(res1.length){
            console.log("task of worker res: " + JSON.stringify(res1));
            console.log("num of task worker: " + res1.length);
            tasks_worker = res1;
        }
    });

    sql.query(`SELECT 
    t.task_num, t.task_name, t.explanation, t.start_date, t.end_date, t.manager, t.importance, t.complete, t.register_date, t.complete_date, t.label_color
    FROM user AS u
    RIGHT OUTER JOIN task AS t
    ON u.user_num = t.manager
    WHERE u.id = '${user.id}'`, (err2, res2) => {
        if(err2){
            console.log("error(manager): ", err2);
            result(err2, null);
            return;
        }
        if(res2.length){
            console.log("task of manager res: " + JSON.stringify(res2));
            console.log("num of task manager: " + res2.length);
            tasks_manager = res2;
        }

        console.log("tasks_worker_num: " + tasks_worker.length);
        console.log("tasks_manager_num: " + tasks_manager.length);
        console.log("user.user_num: " + user.user_num);
        result(null, {"tasks_worker":tasks_worker, "tasks_manager":tasks_manager, "userNum":user.user_num});
    }); 
};

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
Task.updateComplete = (task, result) => { 
    sql.query(`UPDATE task 
    SET complete = true, 
    complete_date = '${task.complete_date}' 
    WHERE task_num = ${task.task_num}`, (err, res) => {
        if(err){
            console.log("error(task.model.js taskComplete): ", err);
            result(err, null);
            return;
        }

        console.log("task.model.js taskComplete update 끝")
        result(null, null);
        return;
    })
}

Task.updateImportance = (task, result) => {
    sql.query(`UPDATE task 
    SET importance = ${task.importance} 
    WHERE task_num = ${task.task_num}`, (err, res) => {
        if(err){
            console.log("error(task.model.js updateImportance): ", err);
            result(err, null);
            return;
        }

        console.log("task.model.js updateImportance update 끝")
        result(null, null);
        return;
    })
}

Task.getDetailTasksbyTaskNum = (taskNum, result) => {
    return new Promise(function(resolve, reject){
        sql.query(`SELECT * 
        FROM detail_task 
        WHERE task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve(result(err, null));
                console.log("error(task.model.js getDetailTasksbyTaskNum): ", err);
                return;
            }
            resolve(result(null, res));
            console.log("task.model.js getDetailTasksbyTaskNum 끝")
            return;
        })
    })
}

Task.getWorkersbyTaskNum = (taskNum, result) => {
    return new Promise(function(resolve, reject){
        sql.query(`SELECT tw.worker_num, tw.personal_role, u.name, u.id, u.email, u.profile_img
        FROM task_worker AS tw
        LEFT OUTER JOIN user AS u
        ON u.user_num = tw.worker_num
        WHERE tw.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve(result(err, null));
                console.log("error(task.model.js getWorkersbyTaskNum): ", err);
                return;
            }
            resolve(result(null, res));
            console.log("task.model.js getWorkersbyTaskNum 끝")
            return;
        })
    })
}

Task.getManagerbyTaskNum = (taskNum, result) => {
    return new Promise(function(resolve, reject){
        sql.query(`SELECT t.manager, t.manager_role, u.name, u.id, u.email, u.profile_img
        FROM task AS t
        LEFT OUTER JOIN user AS u
        ON u.user_num = t.manager
        WHERE t.task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve(result(err, null));
                console.log("error(task.model.js getManagerbyTaskNum): ", err);
                return;
            }
            resolve(result(null, res));
            console.log("task.model.js getManagerbyTaskNum 끝")
            return;
        })
    })
}

Task.getTaskInfobyTaskNum = (taskNum, result) => {
    return new Promise(function(resolve, reject){
        sql.query(`SELECT * FROM task WHERE task_num = ${taskNum}`, (err, res) => {
            if(err){
                resolve(result(err, null));
                console.log("error(task.model.js getTaskInfobyTaskNum): ", err);
                return;
            }
            console.log("res: " + JSON.stringify(res));
            resolve(result(null, res));
            console.log("task.model.js getTaskInfobyTaskNum 끝")
            return;
        })
    })
}



module.exports = Task;