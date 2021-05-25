const Task = require("../models/task.model.js");



exports.addTask = async (req, res) => {
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
        completed: req.body.completed,
        register_date: req.body.register_date,
        completed_date: req.body.completed_date,
        label_color: req.body.label_color,
        update_date: req.body.update_date,
    });
    
    var task_num;
    var promise;


    // 해당 이름을 가진 task가 존재하는지 확인 
    promise = await Task.getTaskNumbyTaskName(req.body.task_name);

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

    promise = await Task.getTaskNumbyTaskName(req.body.task_name);

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

    for(let checklist of req.body.checklists){
        promise = await Task.insertChecklists(task_num, checklist, false);  

        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }

    res.send({result: true});
};

exports.deleteTask = async (req, res) => {
    var promise;

    promise = await Task.deleteTaskbyTaskNum(req.params.taskNum);

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.params.taskNum}`
        });
        return;
    }

    promise = await Task.deleteTaskWorkerbyTaskNum(req.params.taskNum);
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.params.taskNum}`
        });
        return;
    }

    promise = await Task.deleteDetailTasksbyTaskNum(req.params.taskNum);
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.params.taskNum}`
        });
        return;
    }

    promise = await Task.deleteChecklists(req.params.taskNum);
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with id ${req.params.taskNum}`
        });
        return;
    }

    res.send({result: true});
}

exports.getTasks = async (req, res) => {
    const promise1 = await Task.getTasksofWorkersbyUserNum(req.user.user_num);

    if(promise1.err){
        if(promise1.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    const promise2 = await Task.getTasksofManagerbyUserId(req.user.user_num);

    if(promise2.err){
        if(promise2.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    res.send({tasks_worker: promise1.data, tasks_manager: promise2.data});
};

exports.completeTask = async (req, res) => {
    var promise = await Task.updateComplete(req.params.taskNum, true, req.body.completed_date);

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Task with task_num ${req.params.taskNum}`
        });
        return;
    }

    res.send({result: true});
}

exports.changeTaskImportance = async (req, res) => {
    var promise = await Task.getImportance(req.params.taskNum, req.user.user_num);

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    var importance = promise.data; 

    if(importance){
        promise = await Task.updateImportance(req.params.taskNum, req.user.user_num, false);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }
    else{
        promise = await Task.updateImportance(req.params.taskNum, req.user.user_num, true);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    res.send({result: true});
}

exports.getTaskInfo = async (req, res) => {
    const promise1 = await Task.getTaskInfobyTaskNum(req.params.taskNum);
    
    if(promise1.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    const promise2 = await Task.getManagerbyTaskNum(req.params.taskNum);

    if(promise2.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    const promise3 = await Task.getWorkersbyTaskNum(req.params.taskNum);

    if(promise3.err){
        if(promise3.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    const promise4 = await Task.getChecklistsbyTaskNum(req.params.taskNum);

    if(promise4.err){
        if(promise4.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    res.send({info: promise1.data, manager: promise2.data, workers: promise3.data, checklists: promise4.data});
}

exports.modifyTask = async (req, res) => {
    var promise = await Task.getTaskNumbyTaskName(req.body.info.task_name);
    
    if(promise.err != "not_found" && promise.data != req.body.info.task_num){
        res.send({result: "duplicate"});
        return;
    }

    promise = await Task.updateTask(req.body.info);
 
    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
        });
        return; 
    }
 
    // addedWorkers_list: addedWorkers_list,
    // existedWorkers_list: existedWorkers_list,
    // deletedWorkerNum_list: deletedWorkerNum_list 

    // importance를 업무를 생성할 때는 다 false로 생성했다. 
    // 그리고 별표시 누를때마다 업데이트.
    // 변경을 하면 없어진 실무담당자나 관리자의 정보는 없애야 하고, 
    // 있던 사람들의 importance는 그대로 가야하고 (역할이 바꼈을 수도 있기 때문에 personal_role은 업데이트 해야됨), 
    // 없던 사람들의 importance는 false로 설정되어야 한다.

    // delete먼저, add나중에 (add한 것까지 delete됨)

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

    // 업데이트 
    if(req.body.sameManager){
        promise = await Task.updateTaskWorker(req.body.info.task_num, req.body.info.manager, req.body.info.manager_role);
        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
            });
            return; 
        }
    }

    // 새로운 매니저라면 
    else{
        // 이전 매니저 없애고 
        promise = await Task.deleteTaskWorkerbyTaskNumUserNum(req.body.info.task_num, req.body.beforeManager);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.info.task_num}`
            });
            return; 
        }
        // 새로운 매니저 insert
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

    // 체크리스트는 아예 다 삭제하고 새로 insert
    promise = await Task.deleteChecklists(req.body.info.task_num);

    for(let checklist of req.body.checklists){
        promise = await Task.insertChecklists(req.body.info.task_num, checklist, false);  

        if(promise.err){
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }

    res.send({result: true});
}

exports.checklistCheck = async (req, res) => {
    console.log("taskNum, checklistNum: " + req.params.taskNum, req.params.checklistNum);
    var promise = await Task.getChecklistCompleted(req.params.taskNum, req.params.checklistNum);

    if(promise.err){
        res.status(500).send({
            message: `Error retrieving Worker with task_num ${req.params.taskNum}`
        });
        return; 
    }

    var completed = promise.data; 

    console.log("checklistCheck completed: " + completed);

    if(completed){
        promise = await Task.updateChecklistCompleted(req.params.taskNum, req.params.checklistNum, false);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }
    else{
        promise = await Task.updateChecklistCompleted(req.params.taskNum, req.params.checklistNum, true);

        if(promise.err){
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    res.send({result: true});
}

exports.allChecklistIsDone = async (req, res) => {
    console.log("저것")
    var promise = await Task.getChecklistsbyTaskNum(req.params.taskNum);

    if(promise.err){
        if(promise.err == "not_found"){
            res.send({result: true});
        }
        else{
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.params.taskNum}`
            });
        }
        return; 
    }

    else{
        for(var i=0; i < promise.data.length; i++){
            if(promise.data[i].completed == 0){
                res.send({result: false});
                return;
            }
        }
    }

    res.send({result: true});
}
