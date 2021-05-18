const sql = require("./db.js");

const User = function(user){
    this.name = user.name;
    this.id = user.id;
    this.password = user.password;
    this.email = user.email;
    this.profile_img = user.profile_img;
};

User.insertUser = (newUser) => {
    return new Promise(resolve => {
        sql.query("INSERT INTO user SET ?", newUser, (err) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err});
                return;
            }
            resolve({err: null});
        });
    });
};

User.getUserById = (userId) => {
    return new Promise(resolve => {
        sql.query(`SELECT * FROM user WHERE id = '${userId}'`, (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("task of worker res: " + JSON.stringify(res));
                resolve({err: null, data: res[0]});
                return;
            }
            resolve({err: "not_found", data: res});
        });
    });
};

User.getUserInfoByUserNum = (userNum) => {
    return new Promise(resolve => {
        console.log("user.model.js findByUserNum");

        sql.query(`SELECT user_num, name, id, email, profile_img FROM user WHERE user_num = '${userNum}'`, (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("found user: ", res[0]);
                resolve({err: null, data: res[0]});
                return;
            }
            resolve({err: "not_found", data: res});
        });
    });
};

User.getAllUserInfo = () => {
    console.log("getAllUser")
    return new Promise(resolve => {
        sql.query("SELECT user_num, name, id, email, profile_img FROM user", (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("users: ", res);
                resolve({err: null, data: res});
                return;
            }

            resolve({err: "not_found", data: res});
        });
    });
};

User.getAllManagerInfo = () => {
    return new Promise(resolve => {
        sql.query(`SELECT distinct t.manager, u.name, u.id 
        FROM task AS t
        LEFT OUTER JOIN user AS u
        ON t.manager = u.user_num;`, (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                console.log("managers: ", res);
                resolve({err: null, data: res});
                return;
            }

            resolve({err: "not_found", data: res});
        });
    });
};

module.exports = User;