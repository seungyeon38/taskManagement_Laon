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
        complete: req.body.complete,
        register_date: req.body.register_date,
        complete_date: req.body.complete_date,
        label_color: req.body.label_color,
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
        promise = await Task.insertTaskWorker(task_num, worker.user_num, worker.personalRole, false);
        
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

    promise = await Task.deleteTaskWorker(req.body.task_num);
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
    var promise = await Task.updateImportance({task_num: req.body.task_num, importance: req.body.importance, worker_num: req.user.user_num});

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
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise2 = await Task.getManagerbyTaskNum(req.params.taskNum);

    if(promise2.err){
        if(promise2.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise3 = await Task.getTaskInfobyTaskNum(req.params.taskNum);

    if(promise3.err){
        if(promise3.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise4 = await Task.getWorkersbyTaskNum(req.params.taskNum);

    if(promise4.err){
        if(promise4.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }


    res.send({detailTasks: promise1.data, manager: promise2.data, info: promise3.data, workers: promise4.data});
}

