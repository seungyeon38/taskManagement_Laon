module.exports = app => {
    const task = require("../controllers/task.controller.js");

    app.post("/addTask", task.create);

    app.get("/tasks", task.findTasksByUserId);

    app.post("/taskComplete", task.taskComplete);

    app.get("/showDetail/:taskNum", task.showDetailbyTaskNum);

    app.post("/taskImportance", task.taskImportance);
    // app.get("/print", task.printSession);
}