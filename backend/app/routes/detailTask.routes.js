module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");

    app.post("/addDetailTask", detailTask.addDetailTask);

}