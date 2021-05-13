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

    app.post("/addTask", task.create);

    app.post("/deleteTask", task.deleteTask);

    app.get("/tasks", task.findTasksbyUserId);

    app.post("/taskComplete", task.taskComplete);

    app.get("/showDetail/:taskNum", task.showDetailbyTaskNum);

    app.post("/taskImportance", task.taskImportance);
    // app.get("/print", task.printSession);
}