module.exports = app => {
    const detailTask = require("../controllers/detailTask.controller.js");
    // const isAuthenticated = require("../models/passport.js");
    
    // function isAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()){
    //         console.log("session 있음")
    //         return next();
    //     }
    //     console.log("session 없음")
    //     res.redirect('/');
    // };

    app.post("/addDetailTask", detailTask.addDetailTask);

    app.get("/getDetailTask/:detailTaskNum", detailTask.getDetailTask);

    app.post("/modifyDetailTask", detailTask.modifyDetailTask);
}