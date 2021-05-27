module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");

    app.post("/tasks/:taskNum/detailTasks", detailTask.addDetailTask);

    app.get("/tasks/:taskNum/detailTasks/:detailTaskNum", detailTask.getDetailTask);

    app.put("/tasks/:taskNum/detailTasks/:detailTaskNum", detailTask.modifyDetailTask);

    app.delete("/tasks/:taskNum/detailTasks/:detailTaskNum", detailTask.deleteDetailTask);

    // app.get("/tasks/:taskNum/detailTasks", detailTask.getDetailTasksbyTaskNum);
    // Task로 옮김
}