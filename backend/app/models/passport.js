const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


// 사용자가 로그인을 시도할 때 로그인에 실패했는지 성공했는지 결정하는 코드 
// const passportConfig = require('./app/passport/localStrategy');
// const passportConfig = require('./app/passport');
// passportConfig();

// app.use(passport.initialize()); // passport를 사용하겠다. 
// app.use(passport.session());    // 우리의 passport는 내부적으로 session을 쓰겠다. 

// session을 처리하는 방법 
// passport에 serializeUser, deserializeUser라는 기능을 설치함. 
module.exports = () => {
    // 로그인에 성공했을 때 메소드에 인자로 전달된 callback함수가 호출되도록 약속되어있다. 
    // 로그인에 성공했다는 것을 session store에 저장하는 기능을 함. 딱 한번 호출된다. 
    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        // session data의 passport user안으로 간다. (req.session.passport.user에 저장)
        done(null, user.user_num);
        // done(null, user.id);
    });

    const User = require('./user.model');

    // 페이지에 방문할 때마다 deserializeUser의 callback이 호출되도록 약속되어있다. 
    // 호출될 때마다, 사용자에 대한 정보가 저장되어있는 곳에서 사용자의 실제 데이터를 조회해서 가져온다. 
    // 저장된 데이터를 기준으로 해서 우리가 필요한 데이터를 조회할 때 사용하는 것. 

    // 실제 서버로 들어오는 요청마다 (serializeUser에서 저장된) 세션 정보를 실제 DB의 데이터와 비교 
    // 해당하는 유저 정보가 있으면 done의 두 번째 인자를 req.user에 저장하고, 요청을 처리할 때 유저의 정보를 req.user를 통해서 넘겨준다. 
    // serializeUser에서 done으로 넘겨주는 user가 deserializeuser의 첫번째 매개변수로 전달되기 때문에 둘의 타입이 항상 일치해야 한다. 
    // serializeUser에서 id만 넘겨줬다면 deserializeUser의 첫 번째 매개변수도 id를 받아야 되고...
    // userNum은 req.session.passport.user에 저장된 값. 
    passport.deserializeUser(async function(userNum, done) {
        console.log('deserializeUser', userNum);
       
        const promise = await User.findByUserNum(userNum);

        // console.log("deserializeUser promise.data: " + JSON.stringify(promise.data));

        done(promise.err, promise.data);
        
        // await User.findByUserNum(userNum, function(err, user) {
        //     // deserializeUser의 callback함수가 호출될 때 done의 두번째 인자로 주입한 data가 request의 user라고하는 객체로 전달되도록 약속되어있다.
        //     // passport를 사용하지 않으면 request는 user라는 객체를 가지고 있지 않는다. 
        //     done(err, user); // 여기의 user가 req.user가 됨
        // });
        // console.log('끝 deserializeUser');
    });

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw'
        },
        // done이라는 함수를 어떻게 호출하느냐에 따라서 로그인의 성공, 실패를 passport에게 알려줄 수 있다. 
        async function(id, pw, done) {
            // 여기에서밖에 안 쓰임 
            const promise = await User.findById(id);
            if(promise.err){ 
                if(promise.err === "not_found"){
                    console.log("local2")
                    // 첫번째 인자: DB조회 같은 때 발생하는 서버 에러를 넣는 곳, 무조건 실패하는 경우에만 사용(성공했을 시 null) 
                    // 두번째 인자: 성공했을 때 return할 값을 넣는 곳 
                    // 세번째 인자: 사용자가 임의로 실패를 만들고 싶을 때 사용 
                    return done(null, false, {message: '존재하지 않는 회원입니다.'});
                }
                else{
                    console.log("local1")
                    console.log(err)
                    return done(err); 
                }
            }  
            if(!await bcrypt.compare(pw, promise.data.password)){
                console.log("local3")
                return done(null, false, { message: '비밀번호를 확인해주세요.' });
            }
            console.log("local4")
            // 로그인에 성공시 serializeUser의 callback 함수의 첫번째 인자로 주입해주도록 약속되어있다. 
            // console.log("promise.data: " + JSON.stringify(promise.data));
            return done(null, promise.data);
            // return done(null, user);
        }
    ));
}

// exports.isAuthenticated = function(req, res, next) {
//     if (req.isAuthenticated()){
//         console.log("session 있음")
//         return next();
//     }
//     console.log("session 없음")
//     res.redirect('/');
// };