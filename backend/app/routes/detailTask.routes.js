module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");

    app.post("/DetailTasks", detailTask.addDetailTask);

    app.get("/DetailTasks/:detailTaskNum", detailTask.getDetailTask);

    app.put("/DetailTasks/:detailTaskNum", detailTask.modifyDetailTask);
}