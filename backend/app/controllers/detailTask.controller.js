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
// detail_task_num: detailTaskNum,
// detail_task_name: this.form.detailTask_name,
// content: this.form.detailTask_content,
// update_date: this.$moment().format()
exports.modifyDetailTask = async (req, res) => {
    console.log("modifyDetailTask req.body: " + JSON.stringify(req.body));
    const promise = await DetailTask.updateDetailTask(req.body.detail_task_num, req.body.detail_task_name, req.body.content, req.body.update_date);
    
    if(promise.err){
        console.log("err: " + promise.err);
        res.status(500).send({
            message: `Error retrieving DetailTask with detail_task_num ${req.params.detailTaskNum}`
        });
    }

    res.send({result: true});
}