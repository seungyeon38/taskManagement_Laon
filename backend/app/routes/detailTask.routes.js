module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");

    app.post("/detailTasks", detailTask.addDetailTask);

    app.get("/detailTasks/:detailTaskNum", detailTask.getDetailTask);

    app.put("/detailTasks/:detailTaskNum", detailTask.modifyDetailTask);

    app.delete("/detailTasks/:detailTaskNum", detailTask.deleteDetailTask);

    // app.get("/tasks/:taskNum/detailTasks", detailTask.getDetailTasksbyTaskNum);
    // Task로 옮김
}