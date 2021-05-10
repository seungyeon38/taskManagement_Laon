// const { Task } = require("../models/task.model.js");
// const { DetailTask } = require("../models/task.model.js");
const Task = require("../models/task.model.js");
// const DetailTask =  require("../models/task.model.js");
// newTask[0]: task객체, newTask[1]: task에 등록된 worker_num배열
exports.create = (req, res) => {
    // console.log("req.body.task_name: " + req.body.task_name)
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

    console.log("create: " + JSON.stringify(req.body.selected_workers_list))

    // const selected_workers_list = req.body.selected_workers_list;

    // console.log(typeof(req.body.selected_workers_list))

    // var selected_workers_list = [];
    // selected_workers_list.push(req.body.selected_workers_list);
    // console.log(typeof(selected_workers_list));
    // console.log("selected_workers_list: " + JSON.stringify(selected_workers_list)); 
    // selected_workers_list.push({"user_num": req.body.manager,"personalRole": req.body.manager_role});
    // console.log(typeof(selected_workers_list))
    // console.log("selected_workers_list: " + JSON.stringify(selected_workers_list)); 
    // [{"user_num":5,"name":"스타다","id":"starstar","personalRole":"ㅁㄴㅇㅁㄴㅇ"},{"user_num":2,"personalRole":"ㄴㅁㅇㅁㄴㅇㅁㄴ"}]


    // console.log("JSON.stringify(worker_num_list): " + JSON.stringify(worker_num_list))
    // console.log("typeof(worker_num_list): " + typeof(worker_num_list))

    Task.create({"task": task, "selected_workers_list": req.body.selected_workers_list, "manager": req.body.manager, "manager_role": req.body.manager_role}, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the task."
            });
        else res.send(data);
    });
};

// exports.findTasksByUserId2 = (req, res) => {
//     console.log("controller findTasksByUserId")
//     console.log("req.body.id: " + req.body.id)

//     Task.findTasksbyUserId(req.body.id, (err, data) => {
//         if(err){
//             console.log("err: " + err);
//             res.status(500).send({
//                 message: `Error retrieving Task with id ${req.body.id}`
//             });
//         }

//         else{
//             console.log("controller output data: " + JSON.stringify(data));
//             res.send(data);
//         }
//     });
// };

exports.findTasksByUserId = (req, res) => {
    console.log("controller findTasksByUserId")
    // console.log("req: " + JSON.stringify(req.user))
    // console.log("req.body.id: " + req.body.id)
    console.log("req.session: " + JSON.stringify(req.session))
    console.log("req.user: " + JSON.stringify(req.user))
    
    Task.findTasksbyUserId(req.user, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Task with id ${req.user.id}`
            });
        }
        else {
            console.log("task.controller.js findTasksByUserId data: " + JSON.stringify(data));
            res.send(data);
            // next(data);
        }
    });
};

exports.taskComplete = (req, res) => {
    console.log("task.controller.js taskComplete 함수 들어옴")
    console.log("req: " + JSON.stringify(req.body));
    // console.log("req.task_num: " + JSON.stringify(req.task_num));
    // console.log("req.complete_date: " + JSON.stringify(req.complete_date));
    Task.updateComplete(req.body, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.body.task_num}`
            });
        }
        console.log("task.controller.js taskComplete update 끝")
        res.send(data);
    });
}

exports.taskImportance = (req, res) => {
    console.log("task.controller.js taskImportance 함수 들어옴")
    console.log("req: " + JSON.stringify(req.body));
    console.log("req.user.user_num: " + JSON.stringify(req.user.user_num));
    const taskInfo = {task_num: req.body.task_num, importance: req.body.importance, worker_num: req.user.user_num};
    Task.updateImportance(taskInfo, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Task with task_num ${taskInfo.task_num}`
            });
        }
        console.log("task.controller.js taskImportance update 끝")
        res.send(data);
    });
}

exports.showDetailbyTaskNum = async (req, res) => {
    console.log("task.controller.js getDetailTasks 함수 들어옴")
    console.log("req: " + JSON.stringify(req.params.taskNum));

    var detailData = {};

    await Task.getDetailTasksbyTaskNum(req.params.taskNum, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Task with task_num ${req.body.task_num}`
            });
        }
        detailData.detailTasks = data;

        console.log("task.controller.js getDetailTasks 끝")
    });

    await Task.getWorkersbyTaskNum(req.params.taskNum, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
        }
        detailData.workers = data;

        console.log("task.controller.js getWorkersbyTaskNum 끝")
    })

    await Task.getManagerbyTaskNum(req.params.taskNum, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Manager with task_num ${req.body.task_num}`
            });
        }
        detailData.manager = data;

        console.log("task.controller.js getManagerbyTaskNum 끝")
    })

    await Task.getTaskInfobyTaskNum(req.params.taskNum, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.body.task_num}`
            });
        }
        detailData.info = data;

        console.log("task.controller.js getTaskInfobyTaskNum 끝")
    })

    console.log("detailData: " + JSON.stringify(detailData));
    res.send(detailData);
}



// exports.printSession = (req, res) => {
//     console.log("printSession");
//     console.log("req.session: " + JSON.stringify(req.session));
//     console.log("req.user: " + JSON.stringify(req.user));
//     res.send(req.user);
// }