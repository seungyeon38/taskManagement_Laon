module.exports = app => {
    const task = require("../controllers/task.controller.js");

    // function isAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()){
    //         console.log("session 있음")
    //         return next();
    //     }
    //     console.log("session 없음")
    //     res.redirect('/');
    // };

    app.post("/tasks", task.createTask);

    app.delete("/tasks/:taskNum", task.deleteTask);

    app.put("/tasks", task.updateTask);
    
    app.get("/tasks", task.getTasksofUser);

    app.post("/tasks/:taskNum/complete", task.completeTask);

    app.post("/tasks/:taskNum/importance", task.updateTaskImportance);

    app.get("/tasks/:taskNum/info", task.getTaskInfo);

    app.get("/tasks/:taskNum/detailTasks", task.getDetailTasks);

    app.put("/tasks/:taskNum/checklists/:checklistNum", task.checkChecklist);

    app.get("/tasks/:taskNum/checklists/allComplete", task.allChecklistIsDone);

}