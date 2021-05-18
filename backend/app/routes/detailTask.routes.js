module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");
    
    app.post("/addDetailTask", detailTask.addDetailTask);

    app.get("/getDetailTask/:detailTaskNum", detailTask.getDetailTask);

    app.post("/modifyDetailTask", detailTask.modifyDetailTask);
}