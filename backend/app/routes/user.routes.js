const passport = require('passport');
const {body} = require('express-validator');

// const isAuthenticated = require('isAuthenticated');
var multer  = require('multer');
var _storage = multer.diskStorage({
    // 사용자가 전송한 파일을 어느 디렉토리에 저장할 것인가. 
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    // 그 디렉토리에 저장할 파일의 이름을 어떻게 할 것인가. s
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
}) // 객체 안의 두가지 property: destination, filename
// {"fieldname":"profile_img","originalname":"6.jpg","encoding":"7bit","mimetype":"image/jpeg","destination":"uploads/","filename":"6.jpg","path":"uploads\\6.jpg","size":48802}
// storage로 지정하면 multer가 동작하면서 (사용자의 업로드와 관련된 작업을 처리하면서) 
// multer는 storage가 가리키고 있는 것의 destination이라는 property와 filename이라는 property에 속해있는 함수를 실행시킬 것이다라는 약속이 되어있다.
var upload = multer({ storage: _storage }); // 사용자가 업로드한 파일이 application의 디렉토리 중에 어디에 최종적으로 저장되어야될지 설정
// var upload = multer({ dest: 'uploads/' });
// multer라는 모듈이 사실은 함수. 이렇게 옵션(설정)을 줘서 실행을 시키면 이 함수는 unload를 받아낼 수 있는 미들웨어라고 하는 것을 return해주게 된다. 
// upload라는 것을 통해서 여러가지 제어작업을 할 수 있게 된다. 

var type_numOrEng = /^[a-zA-Z0-9]{8,12}$/;
var type_includeNumEngSpe = /^(?=.*[a-zA-Z])(?=.*?[#?!@$%^&*-])(?=.*[0-9]).{8,12}$/;

const check = [
    // 유효성 검사 
    body('name', '이름은 10자 이내로 적어주세요.')
    .isLength({ max: 10 }),
    body('id', '아이디는 대소문자나 숫자(최소 8자, 최대 12자)로 구성하여야 합니다.')
    .matches(type_numOrEng),
    body('password', '비밀번호는 대소문자, 숫자, 특수문자(!@#$%^*)를 포함하여 최소 8자, 최대 12자로 구성하여야 합니다.')
    .matches(type_includeNumEngSpe),
    body('email', '이메일 형식이 올바르지 않습니다.')
    .isEmail()
]

module.exports = app => {
    const user = require("../controllers/user.controller.js");

    // function isLoggedIn(req, res, next){
    //     if(!req.isAuthenticated()){
    //         console.log("로그인 안되어있음");
    //         res.send({isLoggedIn: false})
    //         // return next();
    //     }
    //     console.log("이미 로그인 되어있음");
    //     res.send({isLoggedIn: true})
    // }

    app.get("/:userId/exist", user.checkIdExist);
  

    app.post("/users", upload.single('profile_img'), check, user.createUser); // upload.single('') 이 안의 인자가 input type="file"인 것의 name이어야 된다. 
    // 두 번째 인자로 multer를 통해서 만든 모듈을 미들웨어라는 것을 이렇게 갖다놓게 되면 뒤에 있는 function이 실행되기 전에 이게 먼저 실행이 된다. 
    // 얘가 하는 역할은 사용자가 전달한 데이터에서 file이 포함되어있다면 그 파일을 가공해서 request객체에 file이라는 property를 암시적으로 추가하도록 약속되어있는 미들웨어
    
    app.get("/allUsers", user.getAllUsers);    

    app.get("/users/info", user.getUserInfo);

    // 로그인을 할 때 전송받는 부분을 passport의 체계로 바꿔야 한다. 
    // '/login'으로 인증정보를 보냈을 때. 데이터가 들어오면 데이터를 처리하는 callback을 passport에서 제공하는 API로 
    // 사용자가 login을 전송했을 때 passport가 그 login data를 처리하기 위한 코드 

    
    // 기존의 라우팅인 app.post("경로", callback) 형태와 동일.
    // 대신 callback 자리에 passport가 제공하는 authenticate라는 함수가 대입됨.

    // passport.authenticate("파라미터1", "파라미터2") 함수
    // 파라미터1: 어떤 strategy를 사용할 지 넘겨줍니다. (여기서는 ID/Password 방식을 사용하는 local 전략을 넘겨주었습니다.) 
    // 파라미터2: 객체. 
    // successRedirect는 로그인에 성공했을 때의 redirection 경로
    // failureRedirect는 로그인에 실패했을 때의 redirection 경로
    // failureFlash는 로그인에 실패했을 때 실패 메시지를 출력 할지에 대한 여부를 결정하는 옵션
    app.post("/login",
    // 앞(local)은 전략
        passport.authenticate('local', {
            successRedirect: '/login',  // home으로 
            failureRedirect: '/login',
            failureFlash: true
        }), 
    );

    app.get("/login", user.loginResult);

    app.get("/logout", function(req, res){
        req.logout();  // request.user(req.user)라는 데이터를 삭제하고, session store에 있는 passport데이터를 삭제한다.
        // destroy는 session을 지우는 것 
        // 현재 session의 상태를 sessionStore에 저장하고 저장 작업이 끝나면 redirect를 시키는 코드 
        req.session.save(function(){
            // req.session.destroy(); // session객체의 내용을 제거 
            res.send({logout: true}); // session을 잃은 후 다시 돌아갈 페이지 redirect
        })
    });

    // app.get("/isLoggedIn", isLoggedIn);
}