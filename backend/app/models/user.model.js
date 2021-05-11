const sql = require("./db.js");
// const e = require("cors");

const User = function(user){
    this.name = user.name;
    this.id = user.id;
    this.password = user.password;
    this.email = user.email;
    this.profile_img = user.profile_img;
};

User.create = (newUser, result) => {
    console.log("newUser");
    console.log(newUser);
    // User {
    //   name: 'dsadsad',
    //   id: 'dasdsadasd',
    //   password: '$2b$10$q4DX9sNjM0x.d/XAw/NjCuQ7AuTNGM5OnOem6fqMl6sO1cwv9erpq',
    //   email: 'asdsad@sdasds'
    // }
    console.log(typeof(newUser));
    // object

    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", {id: res.insertId, ...newUser});
        result(null, {id: res.insertId, ...newUser});
    });
};

// User.findByIdPw = (userIdPw, result) => {
//     console.log("userIdPw: " + userIdPw)
//     console.log("userIdPw.id: " + userIdPw.id)
//     console.log("userIdPw.pw: " + userIdPw.pw)
//     sql.query(`SELECT user_num, name, id, email FROM user WHERE id = '${userIdPw.id}'`, (err, res) => {
//         console.log("res.length")
//         console.log(res.length)

//         if(err){
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if(res.length){
//             if(bcrypt.compareSync(userIdPw.pw, res[0].password)){
//                 console.log("있음");
//                 console.log("found user: ", res[0]);
//                 result(null, res[0]);
//                 return;
//             }
//             else{
//                 console.log("비밀번호 틀림");
//                 result({kind: "pw_error"}, null)
//                 return;
//             }
//         }
//         result({ kind: "not_found" }, null);
//     });
// };

User.findById = (userId, result) => {
    console.log("user.model.js findById")
    sql.query(`SELECT * FROM user WHERE id = '${userId}'`, (err, res) => {
        console.log("res.length: " + res.length)
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }
        // 해당 id를 가진 사용자가 존재할 경우, 사용자의 정보를 보냄. 
        if(res.length){
            console.log("res: " + JSON.stringify(res));
            // [
            // RowDataPacket {
            //     user_num: 62,
            //     name: '늘곰',
            //     id: 'seongyeon38',
            //     password: '$2b$10$.Eu/obexEt51cQg5kMEu8eoTT56ID31hESE9lo2ojNDSt/jsxGP/q',
            //     email: 'seongyeon38@naver.com'
            // },
            // RowDataPacket {
            //     user_num: 65,
            //     name: '5gdfggd',
            //     id: 'seongyeon38',
            //     password: 'fsdfsdsdas',
            //     email: 'asdasa@asdsada'
            // }
            // ]
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }
        // error가 없고 해당 id를 가진 사용자가 존재하지 않는 경우
        result({ kind: "not_found" }, null);
    });
};

User.findByUserNum = (userNum, result) => {
    return new Promise(function(resolve, reject){
        console.log("user.model.js findByUserNum");

        sql.query(`SELECT user_num, name, id, email, profile_img FROM user WHERE user_num = '${userNum}'`, (err, res) => {
            console.log("res.length: " + res.length)
            if(err){
                console.log("error: ", err);
                resolve(result(err, null));
                return;
            }
            if(res.length){
                // console.log(res);
                // [
                // RowDataPacket {
                //     user_num: 62,
                //     name: '늘곰',
                //     id: 'seongyeon38',
                //     password: '$2b$10$.Eu/obexEt51cQg5kMEu8eoTT56ID31hESE9lo2ojNDSt/jsxGP/q',
                //     email: 'seongyeon38@naver.com'
                // },
                // RowDataPacket {
                //     user_num: 65,
                //     name: '5gdfggd',
                //     id: 'seongyeon38',
                //     password: 'fsdfsdsdas',
                //     email: 'asdasa@asdsada'
                // }
                // ]
                console.log("found user: ", res[0]);
                resolve(result(null, res[0]));
                return;
            }
            
            resolve(result({ kind: "not_found" }, null));
        });
    });
};

User.getAllUser = result => {
    console.log("getAllUser")
    sql.query("SELECT user_num, name, id, email FROM user", (err, res) => {
        if(err){
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
};

// User.getAllWorker = (taskNum, result) => {
//     sql.query(`SELECT *
//     FROM task_worker AS tw
//     LEFT OUTER JOIN user AS u
//     ON u.user_num = tw.worker_num
//     WHERE tw.task_num = ${taskNum}`, (err, res) => {
//         if(err){
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }

//         console.log("workers: ", res);
//         result(null, res);
//     });
// };

User.getAllManager = result => {
    sql.query(`SELECT distinct t.manager, u.name, u.id 
    FROM task AS t
    LEFT OUTER JOIN user AS u
    ON t.manager = u.user_num;`, (err, res) => {
        if(err){
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("managers: ", res);
        result(null, res);
    })
}


module.exports = User;