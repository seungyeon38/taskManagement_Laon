// const { Task } = require("../models/task.model.js");
// const { DetailTask } = require("../models/task.model.js");
const Task = require("../models/task.model.js");
// const DetailTask =  require("../models/task.model.js");
// newTask[0]: task객체, newTask[1]: task에 등록된 worker_num배열



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
        console.log("task.controller.js not_found")
        res.send({result: "duplicate"});
        return;
    }

    // if(promise.err){
    //     if(promise.err === "not_found"){
    //         console.log("task.controller.js not_found")
    //         res.send({result: true});
    //         return;
    //     }
    //     else {
    //         res.status(500).send({
    //             message:
    //             promise.err.message || "Some error occurred while creating the task."
    //         });
    //         return;
    //     }    
    // }
    
    // 존재하지 않으면 insert 
    promise = await Task.insertTask(task);
    
    if(promise.err){
        console.log("create_error1: ", promise.err);
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }
    
    promise = await Task.selectTaskNumbyTaskName(req.body.task_name);

    // 못 찾아도 오류임 
    if(promise.err){
        console.log("create_error selectTaskNumbyTaskName: ", promise.err);
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }

    task_num = promise.data;

    console.log("task_num: " + task_num);
    console.log("select task_num 완료");


    for(let worker of req.body.selected_workers_list){
        promise = await Task.insertTaskWorker(task_num, worker.user_num, worker.personalRole, false);
        
        if(promise.err){
            console.log("err있음1")
            res.status(500).send({
                message:
                    promise.err.message || "Some error occurred while creating the task."
            });
            return;
        }
    }

    promise = await Task.insertTaskWorker(task_num, req.body.manager, req.body.manager_role, false);

    if(promise.err){
        console.log("err있음2")
        res.status(500).send({
            message:
                promise.err.message || "Some error occurred while creating the task."
        });
        return;
    }

    res.send({result: true});
};


exports.deleteTask = async (req, res) => {
    console.log("model delete");
    var promise;

    promise = await Task.deleteTask(req.body.task_num);

    if(promise.err){
        console.log("err있음")
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    promise = await Task.deleteTaskWorker(req.body.task_num);
    if(promise.err){
        console.log("err있음")
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    promise = await Task.deleteDetailTasks(req.body.task_num);
    if(promise.err){
        console.log("err있음")
        res.status(500).send({
            message: `Error retrieving Task with id ${req.body.id}`
        });
        return;
    }

    res.send({result: true});
}

exports.findTasksbyUserId = async (req, res) => {
    console.log("controller findTasksbyUserId")

    console.log("req.user.id: "+ req.user.id)

    const promise1 = await Task.selectTasksofWorkers(req.user.id);

    if(promise1.err){
        if(promise1.err != "not_found"){
            // result(err, null);
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    const promise2 = await Task.selectTasksofManager(req.user.id);

    if(promise2.err){
        if(promise2.err != "not_found"){
            // result(err, null);
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
            return;
        }
    }

    res.send({tasks_worker: promise1.data, tasks_manager: promise2.data, userNum: req.user.user_num});
};

exports.taskComplete = async (req, res) => {
    console.log("task.controller.js taskComplete 함수 들어옴")
    console.log("req: " + JSON.stringify(req.body));
    // console.log("req.task_num: " + JSON.stringify(req.task_num));
    // console.log("req.complete_date: " + JSON.stringify(req.complete_date));
    // task_num: taskNum, 
    // complete_date: this.$moment().format()

    var promise = await Task.updateComplete(req.body);
    
    if(promise.err){
        console.log("promise.err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving Task with task_num ${req.body.task_num}`
        });
        return;
    }

    console.log("task.controller.js taskComplete update 끝")
    res.send({result: true});

    // Task.updateComplete(req.body, (err) => {
    //     if(err){
    //         console.log("err: " + err);
    //         res.status(500).send({
    //             message: `Error retrieving Task with task_num ${req.body.task_num}`
    //         });
    //     }
    //     else{
    //         console.log("task.controller.js taskComplete update 끝")
    //         res.send({update: true});
    //     }
    // });
}

exports.taskImportance = async (req, res) => {
    // task_num: taskNum, 
    // importance: true
    console.log("task.controller.js taskImportance 함수 들어옴")
    console.log("req: " + JSON.stringify(req.body));
    console.log("req.user.user_num: " + JSON.stringify(req.user.user_num));
    // const taskInfo = {task_num: req.body.task_num, importance: req.body.importance, worker_num: req.user.user_num};
    var promise = await Task.updateImportance({task_num: req.body.task_num, importance: req.body.importance, worker_num: req.user.user_num});

    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving Task with task_num ${req.body.task_num}`
        });
        return; 
    }

    console.log("task.controller.js taskComplete update 끝")
    res.send({result: true});

    // Task.updateImportance(req.body, (err, data) => {
    //     if(err){
    //         console.log("err: " + err);
    //         res.status(500).send({
    //             message: `Error retrieving Task with task_num ${taskInfo.task_num}`
    //         });
    //     }
    //     console.log("task.controller.js taskImportance update 끝")
    //     res.send(data);
    // });
}

exports.showDetailbyTaskNum = async (req, res) => {
    console.log("task.controller.js getDetailTasks 함수 들어옴")
    console.log("req: " + JSON.stringify(req.params.taskNum));

    var promise1;
    var promise2;
    var promise3;
    var promise4;
    
    // var detailData = {};

    promise1 = await Task.getDetailTasksbyTaskNum(req.params.taskNum);

    if(promise1.err){
        if(promise1.err != "not_found"){
            console.log("promise1.err: " + promise1.err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise2 = await Task.getManagerbyTaskNum(req.params.taskNum);

    if(promise2.err){
        if(promise2.err != "not_found"){
            console.log("promise2.err: " + promise2.err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise3 = await Task.getTaskInfobyTaskNum(req.params.taskNum);

    if(promise3.err){
        if(promise3.err != "not_found"){
            console.log("promise3.err: " + promise3.err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }

    promise4 = await Task.getWorkersbyTaskNum(req.params.taskNum);

    if(promise4.err){
        if(promise4.err != "not_found"){
            console.log("promise4.err: " + promise4.err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
            return; 
        }
    }


    console.log("detail tasks: " + JSON.stringify(promise1.data))
    console.log("manager: " + JSON.stringify(promise2.data))
    console.log("info: " + JSON.stringify(promise3.data))    
    console.log("worker: " + JSON.stringify(promise4.data))

    

    res.send({detailTasks: promise1.data, manager: promise2.data, info: promise3.data, workers: promise4.data});






    // await Task.getWorkersbyTaskNum(req.params.taskNum, (err, data) => {
    //     if(err){
    //         console.log("err: " + err);
    //         res.status(500).send({
    //             message: `Error retrieving Worker with task_num ${req.body.task_num}`
    //         });
    //     }
    //     detailData.workers = data;

    //     console.log("task.controller.js getWorkersbyTaskNum 끝")
    // })

    // await Task.getManagerbyTaskNum(req.params.taskNum, (err, data) => {
    //     if(err){
    //         console.log("err: " + err);
    //         res.status(500).send({
    //             message: `Error retrieving Manager with task_num ${req.body.task_num}`
    //         });
    //     }
    //     detailData.manager = data;
    //     console.log("task.controller.js getManagerbyTaskNum 끝")
    // })

    // await Task.getTaskInfobyTaskNum(req.params.taskNum, (err, data) => {
    //     if(err){
    //         console.log("err: " + err);
    //         res.status(500).send({
    //             message: `Error retrieving Worker with task_num ${req.body.task_num}`
    //         });
    //     }
    //     detailData.info = data;

    //     console.log("task.controller.js getTaskInfobyTaskNum 끝")
    // })

    // console.log("detailData: " + JSON.stringify(detailData));
    // res.send(detailData);
}



// exports.printSession = (req, res) => {
//     console.log("printSession");
//     console.log("req.session: " + JSON.stringify(req.session));
//     console.log("req.user: " + JSON.stringify(req.user));
//     res.send(req.user);
// }