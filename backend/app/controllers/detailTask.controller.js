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