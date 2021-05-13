const User = require("../models/user.model.js");
const bcrypt = require('bcrypt')

exports.create = async (req, res) => {
    if(!req.body){
        res.status(400).send({
            message: "Content can not empty!"
        });
    }

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10)
    
    var filename;

    if(typeof req.file === 'undefined'){
        filename = null;
    }
    else{
        filename = req.file.filename;
    }

    const user = new User({
        name: req.body.name,
        id: req.body.id,
        password: encryptedPassword,
        email: req.body.email,
        profile_img: filename
    });

    const promise = await User.create(user);
    if(promise.err){
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user."
        });
        return;
    }

    res.send({result: true});
};

exports.getAllUser = async (req, res) => {

    const promise = await User.getAllUser();

    if(promise.err){
        if(promise.err != "not_found"){
            res.status(500).send({
                message: 
                    err.message || "Some error occurred while retrieving users."
            });
            return; 
        }
    }

    res.send(promise.data);
};

exports.getUserInfo = async (req, res) => {
    const promise = await User.findById(req.user.id);
    // 못 찾아도 오류 
    if(promise.err){
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving users."
        });
        return;
    }
    res.send(promise.data);
}

// 회원가입: 해당 아이디를 가진 사용자가 존재하지 않을 경우와 존재하는 경우의 구분만 해주면 됨. 
exports.isExistWithId = async (req, res) => {
    const promise = await User.findById(req.params.userId);
    
    if(promise.err){
        if(promise.err === "not_found"){
            res.send({result: true});
            return;
        }
        else {
            res.status(500).send({
                message: `Error retrieving User with id ${req.params.id}`
            });
            return;
        }    
    }

    else res.send({result: false});
};

exports.getAllManager = async (req, res) => {
    const promise = await User.getAllManager();

    if(promise.err){
        if(promise.err != "not_found"){
            res.status(500).send({
                message: 
                    err.message || "Some error occurred while retrieving managers."
            });
            return;
        }
    }

    res.send(promise.data);
}

exports.loginResult = (req, res) => {
    const fmsg = req.flash();

    if(fmsg.error){
        res.send({error: fmsg.error[0]});
    }
    else {
        res.send({error: null})
    }
}

