const DetailTask = require("../models/detailTask.model.js");


exports.addDetailTask = async (req, res) => {
    const detailTask = new DetailTask({
        task_num: req.body.task_num,
        worker: req.user.user_num,
        detail_task_name: req.body.detail_task_name,
        content: req.body.content,
        report_date: req.body.report_date,
    });

    console.log("detailTask: " + JSON.stringify(detailTask))
    const promise = await DetailTask.addDetailTask(detailTask);
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with task_num ${req.body.task_num}`
        });
    }

    res.send({result: true});
};

exports.getDetailTask = async (req, res) => {
    const promise = await DetailTask.getDetailTaskbyNum(req.params.detailTaskNum);

    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    res.send({detailTask: promise.data});
}

exports.modifyDetailTask = async (req, res) => {
    console.log("modifyDetailTask req.body: " + JSON.stringify(req.body));
    const promise = await DetailTask.updateDetailTask(req.params.detailTaskNum, req.body.detail_task_name, req.body.content, req.body.update_date);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    res.send({result: true});
}

exports.deleteDetailTask = async (req, res) => {
    const promise = await DetailTask.deleteDetailTask(req.params.detailTaskNum);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    res.send({result: true});
}

exports.getDetailTasksbyTaskNum = async (req, res) => {
    const promise = await DetailTask.getDetailTasksbyTaskNum(req.params.taskNum);

    if(promise.err){
        if(promise.err != "not_found"){
            res.status(500).send({
                message: `Error retrieving Worker with task_num ${req.params.taskNum}`
            });
            return; 
        }
    }

    // id, name, email, profile_img
        

    res.send({detailTasks: promise.data, userNum: req.user.user_num});
}