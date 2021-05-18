const Task = require("../models/task.model.js");



exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "Content can not empty!"
        });
    }

    const task = new Task({
        task_name: req.body.task_name,
        explanation: req.body.explanation,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        manager: req.body.manager,
        manager_role: req.body.manager_role,
        complete: req.body.complete,
        register_date: req.body.register_date,
        complete_date: req.body.complete_date,
        label_color: req.body.label_color,
        update_date: req.body.update_date,
    });
    
    var task_num;
    var promise;

    // 해당 이름을 가진 task가 존재하는지 확인 
    promise = await Task.selectTaskNumbyTaskName(req.body.task_name);

    if(promise.err != "not_found"){
        res.send({result: "duplicate"});
        return;
    }

    // 존재하지 않으면 insert 
    promise = await Task.insertTask(task);
    
    if(promise.err){
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }
    
    promise = await Task.selectTaskNumbyTaskName(req.body.task_name);

    // 못 찾아도 오류임 
    if(promise.err){
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }

    task_num = promise.data;

    for(let worker of req.body.selected_workers_list){
        promise = await Task.insertTaskWorker(task_num, worker.user_num, worker.personal_role, false);
        
        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }

    promise = await Task.insertTaskWorker(task_num, req.body.manager, req.body.manager_role, false);

    if(promise.err){
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }

    // promise = await Task.insertTaskManager(task_num, req.body.manager, req.body.manager_role, false);

    res.send({result: true});
};

exports.deleteTask = async (req, res) => {
    var promise;

    promise = await Task.deleteTask(req.body.task_num);

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    promise = await Task.deleteTaskWorkerbyTaskNum(req.body.task_num);
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    promise = await Task.deleteDetailTasks(req.body.task_num);
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    res.send({result: true});
}

exports.findTasksbyUserId = async (req, res) => {
    const promise1 = await Task.selectTasksofWorkers(req.user.id);

    if(promise1.err){
        if(promise1.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    const promise2 = await Task.selectTasksofManager(req.user.id);

    if(promise2.err){
        if(promise2.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    res.send({tasks_worker: promise1.data, tasks_manager: promise2.data, userNum: req.user.user_num});
};

exports.taskComplete = async (req, res) => {
    var promise = await Task.updateComplete(req.body);
    
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with task_num ${req.body.task_num}`
        });
        return;
    }

    res.send({result: true});
}

exports.taskImportance = async (req, res) => {
    var promise = await Task.updateImportance({task_num: req.body.task_num, importance: req.body.importance, user_num: req.user.user_num});

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with task_num ${req.body.task_num}`
        });
        return; 
    }

    res.send({result: true});
}

exports.showDetailbyTaskNum = async (req, res) => {
    var promise1;
    var promise2;
    var promise3;
    var promise4;

    promise1 = await Task.getDetailTasksbyTaskNum(req.params.taskNum);

    if(promise1.err){
        if(promise1.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }
    // t.manager, t.manager_role, u.name, u.id, u.email, u.profile_img
    promise2 = await Task.getManagerbyTaskNum(req.params.taskNum);

    if(promise2.err){
        if(promise2.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }
    // task_num, task_name, explanation, start_date, end_date, register_date, complete_date, label_color, complete
    promise3 = await Task.getTaskInfobyTaskNum(req.params.taskNum);

    if(promise3.err){
        if(promise3.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }
    // tw.user_num, tw.personal_role, u.name, u.id, u.email, u.profile_img
    promise4 = await Task.getWorkersbyTaskNum(req.params.taskNum);

    if(promise4.err){
        if(promise4.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    res.send({detailTasks: promise1.data, manager: promise2.data, info: promise3.data, workers: promise4.data, userNum: req.user.user_num});
}


exports.getTaskInfobyTaskNum = async (req, res) => {
    console.log("getTaskInfobyTaskNum")
    console.log("req.params.taskNum: " + req.params.taskNum)
    
    // console.log(1)
    
    const promise1 = await Task.getTaskInfobyTaskNum(req.params.taskNum);
    
    if(promise1.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    // console.log(2)

    const promise2 = await Task.getManagerbyTaskNum(req.params.taskNum);

    if(promise2.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }
    
    // console.log(3)

    const promise3 = await Task.getWorkersbyTaskNum(req.params.taskNum);

    if(promise3.err){
        if(promise3.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    // console.log(4)

    const promise4 = await Task.getImportance({task_num: req.params.taskNum, user_num: req.user.user_num});

    if(promise4.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    // console.log(5)

    res.send({info: promise1.data, manager: {manager: promise2.data.manager, personal_role: promise2.data.manager_role}, workers: promise3.data, importance: promise4.data});
}


exports.modifyTask = async (req, res) => {
    console.log("modifyTask req.body: " + JSON.stringify(req.body));
    console.log("modifyTask req.body.info: " + JSON.stringify(req.body.info));

    var promise = await Task.selectTaskNumbyTaskName(req.body.info.task_name);

    if(promise.err != "not_found" && promise.data != req.body.info.task_num){
        res.send({result: "duplicate"});
        return;
    }

    promise = await Task.updateTaskInfo(req.body.info);
 
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
        });
        return; 
    }
 
    console.log("req.body.sameManager: " + req.body.sameManager)

    // 업데이트 
    if(req.body.sameManager){
        console.log("req.body.info.manager: " + req.body.info.manager)
        console.log("req.body.info.manager_role: " + req.body.info.manager_role)
        promise = await Task.updateTaskWorker(req.body.info.task_num, req.body.info.manager, req.body.info.manager_role);
        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
            });
            return; 
        }
    }
    // Task.updateTaskWorker = (task_num, user_num, personal_role)
    // 새로운 매니저라면 
    else{
        promise = await Task.deleteTaskWorkerbyTaskNumUserNum(req.body.info.task_num, req.body.beforeManager);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
            });
            return; 
        }

        promise = await Task.insertTaskWorker(req.body.info.task_num, req.body.info.manager, req.body.info.manager_role, false);
        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
            });
            return; 
        }
    }

    for(let worker of req.body.addedWorkers_list){
        promise = await Task.insertTaskWorker(req.body.info.task_num, worker.user_num, worker.personal_role, false);
        
        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }
    
    for(let worker of req.body.existedWorkers_list){
        promise = await Task.updateTaskWorker(req.body.info.task_num, worker.user_num, worker.personal_role);

        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }
    
    for(let userNum of req.body.deletedWorkerNum_list){
        promise = await Task.deleteTaskWorkerbyTaskNumUserNum(req.body.info.task_num, userNum);

        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }




    // addedWorkers_list: addedWorkers_list,
    // existedWorkers_list: existedWorkers_list,
    // deletedWorkerNum_list: deletedWorkerNum_list 



    // importance를 업무를 생성할 때는 다 false로 생성했다. 
    // 그리고 별표시 누를때마다 업데이트.
    // 변경을 하면 없어진 실무담당자나 관리자의 정보는 없애야 하고, 
    // 있던 사람들의 importance는 그대로 가야하고 (역할이 바꼈을 수도 있기 때문에 personal_role은 업데이트 해야됨), 
    // 없던 사람들의 importance는 false로 설정되어야 한다. 



    // 현재 있는 taskworker가져와. 없는건 없애고 있는건 업데이트. 

    // promise = await Task.getTaskWorkerbyTaskNum(req.body.info.task_num);
    // if(promise.err){
    //     res.status(500).send({
    //         message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
    //     });
    //     return; 
    // }

    // const taskworkerList = promise.data;

    // for(let taskworker of req.body.taskworkerList){
    //     if(taskworker.user_num == req.info.manager || taskworker.user_num)
    // }

    // promise = await Task.deleteTaskWorker(req.body.info.task_num);
    // console.log(3)
    // if(promise.err){
    //     res.status(500).send({
    //         message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
    //     });
    //     return; 
    // }

    // console.log("req.body.selected_workers_list: " + JSON.stringify(req.body.selected_workers_list))
    // for(let worker of req.body.selected_workers_list){
    //     console.log("안")
    //     promise = await Task.insertTaskWorker(req.body.info.task_num, worker.user_num, worker.personal_role, req.body.info.importance);
    //     if(promise.err){
    //         res.status(500).send({
    //             message:
    //                 promise.err.message || "Some error occurred while creating the task."
    //         });
    //         return;
    //     }
    // }

    // promise = await Task.insertTaskWorker(task_num, req.body.manager, req.body.manager_role, req.body.info.deleteDetailTasksimportance);

    // if(promise.err){
    //     res.status(500).send({
    //         message:
    //             promise.err.message || "Some error occurred while creating the task."
    //     });
    //     return;
    // }

    res.send({result: true});
}