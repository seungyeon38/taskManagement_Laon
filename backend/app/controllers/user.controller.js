const User = require("../models/user.model.js");
const bcrypt = require('bcrypt')

exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "Content can not empty!"
        });
    }

    console.log("create req.file: " + JSON.stringify(req.file));
    // console.log("create req.file.id: " + JSON.stringify(req.file.id));

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10)
    
    var filename;

    if(typeof req.file === 'undefined'){
        console.log("여기")
        filename = null;
    }
    else{
        console.log("저기")
        filename = req.file.filename;
    }

    const user = new User({
        name: req.body.name,
        id: req.body.id,
        password: encryptedPassword,
        email: req.body.email,
        profile_img: filename
    });

    console.log("create user: " + JSON.stringify(user));

    const promise = await User.create(user);
    if(promise.err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user."
        });
        return;
    }

    res.send({result: true});

    // User.create(user, (err, data) => {
    //     if(err)
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while creating the user."
    //         });
    //     else res.send(data);
    // });
};

exports.getAllUser = async (req, res) => {
    const promise = await User.getAllUser();
    if(promise.err){
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving users."
        });
        return; 
    }

    res.send(promise.data);

    // User.getAllUser((err, data) => {
    //     if(err)
    //         res.status(500).send({
    //             message: 
    //                 err.message || "Some error occurred while retrieving users."
    //         });
    //     else {
    //         console.log("controller getAllUser")
    //         res.send(data)
    //     };
    // });
};

// exports.getAllWorker = (req, res) => {
//     User.getAllWorker((err, data) => {
//         if(err)
//             res.status(500).send({
//                 message: 
//                     err.message || "Some error occurred while retrieving workers."
//             });
//         else res.send(data);
//     });
// };

exports.getUserInfo = async (req, res) => {
    const promise = await User.findById(req.user.id);
    if(promise.err){
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving users."
        });
        return;
    }
    res.send(promise.data);

    // User.findById(req.user.id, (err, data) => {
    //     if(err)
    //         res.status(500).send({
    //             message: 
    //                 err.message || "Some error occurred while retrieving users."
    //         });
    //     else 
    //         console.log(JSON.stringify(data));
    //         res.send(data);
    // })
}

// 세션 삭제 방법 
// req.session.destroy(function(err){});
// exports.logout = function (req, res) {
//     req.session.destory() // 세션 삭제
//     res.clearCookie("sid") // 세션 쿠키 삭제
// }


// 회원가입: 해당 아이디를 가진 사용자가 존재하지 않을 경우와 존재하는 경우의 구분만 해주면 됨. 
exports.isExistWithId = async (req, res) => {
    // console.log(req.params)
    const promise = await User.findById(req.params.userId);
    
    if(promise.err === "not_found"){
        console.log("user.controller.js not_found")
        res.send({result: true});
        return;
    }

    else if(promise.err){
        res.status(500).send({
            message: `Error retrieving User with id ${req.params.id}`
        });
        return;
    }

    else res.send({result: false});


    // User.findById(req.params.userId, (err, data) => {
    //     if(err){
    //         if(err.kind === "not_found"){
    //             console.log("user.controller.js not_found")
    //             res.send("notExist");
    //         }
    //         else{
    //             res.status(500).send({
    //                 message: `Error retrieving User with id ${req.params.id}`
    //             });
    //         }
    //     }
    //     else res.send("exist");
    // });
};

// 아이디, 이름, 사진 가져오기 
// exports.getUserInfo = async (req, res) => {

//     const promise = await User.findById(req.user.id)
//     if(promise.err){

//     }
//     User.findById(req.user.id, (err, data) => {
//         if(err){
//             if(err.kind === "not_found"){
//                 res.send(null);
//             }
//             else{
//                 res.status(500).send({
//                     message: 'Error retrieving User with id ${(req.user.id}'
//                 });
//             }
//         }
//         else res.send(data);
//     })
// }

// exports.findbyUserNum = (req, res) => {
//     User.findByUserNum((err, data) => {
//         if(err){
//             res.status(500).send({
//                 message: 
//                     err.message || "Some error occurred while retrieving user."
//             });
//         }
//         else res.send(data);
//     })
// }

exports.getAllManager = async (req, res) => {
    const promise = await User.getAllManager();
    if(promise.err){
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving managers."
        });
        return;
    }
    res.send(promise.data);


    // User.getAllManager((err, data) => {
    //     if(err){
    //         res.status(500).send({
    //             message: 
    //                 err.message || "Some error occurred while retrieving managers."
    //         });
    //     }
    //     else res.send(data);
    // });
}

exports.login = (req, res) => {
    console.log("login req.session: " + JSON.stringify(req.session));

    const fmsg = req.flash();

    if(fmsg.error){
        res.send({error: fmsg.error[0]});
    }
    else {
        res.send({error: null})
    }
}

