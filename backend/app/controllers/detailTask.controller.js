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
    var promise = await DetailTask.insertDetailTask(detailTask);
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with task_num ${req.body.task_num}`
        });
    }

    promise = await DetailTask.getRecentDetailTaskNum(req.user.user_num);

    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with task_num ${req.body.task_num}`
        });
    }

    const detail_task_num = promise.data;


    for(var i=0; i<req.body.detailTask_checklists.length; i++){
        promise = await DetailTask.insertDetailTaskChecklist(req.body.task_num, detail_task_num, req.body.detailTask_checklists[i]);

        if(promise.err){
            console.log("err: " + promise.err);
            res.status(500).send({
                message: `Error retrieving DetailTask with task_num ${req.body.task_num}`
            });
        }
    }

    res.send({result: true});
};

exports.getDetailTask = async (req, res) => {
    const promise1 = await DetailTask.getDetailTaskbyNum(req.params.detailTaskNum);

    if(promise1.err){
        console.log("err: " + promise1.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    const promise2 = await DetailTask.getChecklistsbyNum(req.params.detailTaskNum);

    if(promise2.err){
        if(promise2.err != "not_found"){
            console.log("err: " + promise2.err);
            res.status(500).send({
                message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
            });
        }
    }

    res.send({detailTask: promise1.data, checklists: promise2.data});
}

exports.modifyDetailTask = async (req, res) => {
    var promise = await DetailTask.updateDetailTask(req.params.detailTaskNum, req.body.detail_task_name, req.body.content, req.body.update_date);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }



    promise = await DetailTask.updateDetailTaskChecklist(req.params.detailTaskNum, );
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }
    
    res.send({result: true});
}

exports.deleteDetailTask = async (req, res) => {
    var promise = await DetailTask.deleteDetailTask(req.params.detailTaskNum);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    promise = await DetailTask.deleteDetailTaskChecklists(req.params.detailTaskNum);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    res.send({result: true});
}