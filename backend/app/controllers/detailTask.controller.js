const DetailTask = require("../models/detailTask.model.js");


exports.addDetailTask = (req, res) => {
    console.log("addDetailTask")
    console.log("req.session: " + JSON.stringify(req.session))
    console.log("req.user: " + JSON.stringify(req.user))
    // task_num, detail_task_name, worker(user_num), content, report_date 
    console.log("req.body: " + JSON.stringify(req.body))

    const detailTask = new DetailTask({
        task_num: req.body.task_num,
        worker: req.user.user_num,
        detail_task_name: req.body.detail_task_name,
        content: req.body.content,
        report_date: req.body.report_date,
    });

    console.log("detailTask: " + JSON.stringify(detailTask))
    DetailTask.addDetailTask(detailTask, (err, data) => {
        if(err){
            console.log("err: " + err);
            res.status(500).send({
                message: `Error retrieving DetailTask with task_num ${req.body.task_num}`
            });
        }
        console.log("task.controller.js taskComplete update 끝")
        res.send(data);
    });
};