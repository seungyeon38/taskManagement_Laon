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
    
    app.get("/tasks", task.getTasks);

    app.post("/tasks/:taskNum/complete", task.completeTask);

    // app.get("/tasks/:taskNum/details", task.showDetailbyTaskNum);

    app.post("/tasks/:taskNum/importance", task.changeTaskImportance);

    // app.get("/tasks/info/:taskNum", task.getTaskInfobyTaskNum);
    app.get("/tasks/info/:taskNum", task.getTaskInfo);

    // app.get("/tasks/:taskNum/importance", task.getTaskImportance);

}