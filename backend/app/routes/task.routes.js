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

    app.post("/tasks", task.addTask);

    app.delete("/tasks/:taskNum", task.deleteTask);

    app.put("/tasks", task.modifyTask);
    
    app.get("/tasks", task.getTasksbyUserId);

    app.post("/tasks/:taskNum/complete", task.completeTask);

    app.get("/showDetail/:taskNum", task.showDetailbyTaskNum);

    app.post("/taskImportance", task.changeTaskImportance);

    app.get("/getTaskInfo/:taskNum", task.getTaskInfobyTaskNum);

}