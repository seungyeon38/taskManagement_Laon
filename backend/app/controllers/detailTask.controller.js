const DetailTask = require("../models/detailTask.model.js");


exports.addDetailTask = async (req, res) => {
    const detailTask = new DetailTask({
        task_num: req.params.taskNum,
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
            message: `Error retrieving DetailTask with task_num ${req.params.taskNum}`
        });
    }

    promise = await DetailTask.getRecentDetailTaskNum(req.user.user_num);

    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with task_num ${req.params.taskNum}`
        });
    }

    const detail_task_num = promise.data;


    for(let detailTask_checklist of req.body.detailTask_checklists){
        promise = await DetailTask.insertDetailTaskChecklist(req.params.taskNum, detail_task_num, detailTask_checklist);

        if(promise.err){
            console.log("err: " + promise.err);
            res.status(500).send({
                message: `Error retrieving DetailTask with task_num ${req.params.taskNum}`
            });
        }
    }

    res.send({result: true});
}

exports.getDetailTask = async (req, res) => {
    const promise1 = await DetailTask.getDetailTaskbyNum(req.params.detailTaskNum);

    if(promise1.err){
        console.log("err: " + promise1.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    const promise2 = await DetailTask.getChecklistNumsbyNum(req.params.detailTaskNum);

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

    promise = await DetailTask.deleteDetailTaskChecklists(req.params.detailTaskNum)

    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    console.log("req.body.detailTask_checklists: " + JSON.stringify(req.body.detailTask_checklists))

    for(let detailTask_checklist of req.body.detailTask_checklists){
        promise = await DetailTask.insertDetailTaskChecklist(req.params.taskNum, req.params.detailTaskNum, detailTask_checklist);

        if(promise.err){
            console.log("err: " + promise.err);
            res.status(500).send({
                message: `Error retrieving DetailTask with task_num ${req.params.taskNum}`
            });
        }
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