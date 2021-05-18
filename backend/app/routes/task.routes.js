module.exports = app => {
    const task = require("../controllers/task.controller.js");
    // const isAuthenticated = require("../models/passport.js");

    // function isAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()){
    //         console.log("session 있음")
    //         return next();
    //     }
    //     console.log("session 없음")
    //     res.redirect('/');
    // };

    app.post("/addTask", task.addTask);

    app.post("/deleteTask", task.deleteTask);

    app.post("/modifyTask", task.modifyTask);
    // app.get("/tasks", task.findTasksbyUserId);
    app.get("/tasks", task.getTasksbyUserId);

    app.post("/completeTask", task.completeTask);

    app.get("/showDetail/:taskNum", task.showDetailbyNum);

    app.post("/taskImportance", task.changeTaskImportance);

    app.get("/getTaskInfo/:taskNum", task.getTaskInfobyNum);

}