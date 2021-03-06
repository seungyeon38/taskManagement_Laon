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

User.getUserInfo = (userNum) => {
    return new Promise(resolve => {
        sql.query(`SELECT user_num, name, id, email, profile_img FROM user WHERE user_num = '${userNum}'`, (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                // console.log("found user: ", res[0]);
                resolve({err: null, data: res[0]});
                return;
            }
            resolve({err: "not_found", data: res});
        });
    });
};

User.getAllUserInfo = () => {
    return new Promise(resolve => {
        sql.query("SELECT user_num, name, id, email, profile_img FROM user", (err, res) => {
            if(err){
                console.log("error: ", err);
                resolve({err: err, data: null});
                return;
            }
            if(res.length){
                resolve({err: null, data: res});
                return;
            }

            resolve({err: "not_found", data: res});
        });
    });
};


module.exports = User;