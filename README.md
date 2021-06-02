업무 관리 서비스/ Task management service
==========================================


## 1. 개발 환경
* Frontend: Vue.js
  + UI Framework: Element-UI
 
* Backend: Node.js

* DB: MySQL
![개발환경](https://user-images.githubusercontent.com/29995318/119928555-c087a400-bfb6-11eb-8575-fc63f30727dd.png)

<br />

## 2. 설계 (Design)
### 2-1. 주요 기능

* 사용자 관련 기능

  + 로그인
  + 회원가입
 
<br />

* 업무 관련 기능

  + 업무 목록 보기
  + 업무 등록
  + 업무 수정
  + 업무 삭제
 
<br />

* (각 업무에 대한) 세부업무 관련 기능 

  + 세부업무 목록 보기
  + 세부업무 등록
  + 세부업무 수정 
  + 세부업무 삭제 

<br />

### 2-2. 화면정의서

* 로그인

![화면정의서_로그인](https://user-images.githubusercontent.com/29995318/119926442-671d7600-bfb2-11eb-9117-18bad7279aae.png)

<br />

* 회원가입

![화면정의서_회원가입](https://user-images.githubusercontent.com/29995318/119926511-83211780-bfb2-11eb-9152-07a77260e224.png)

<br />

* 업무 목록(메인)

![화면정의서_업무목록](https://user-images.githubusercontent.com/29995318/119926551-9502ba80-bfb2-11eb-98aa-f55d29322e2f.png)

<br />

* 업무 등록

![화면정의서_업무등록](https://user-images.githubusercontent.com/29995318/119926589-a21fa980-bfb2-11eb-9806-9a6f3c84baf5.png)

<br />

* 세부업무 목록

![화면정의서_세부업무목록](https://user-images.githubusercontent.com/29995318/119926619-ab107b00-bfb2-11eb-8f4a-0ca95371b7f0.png)

<br />

* 세부업무 등록

![화면정의서_세부업무등록](https://user-images.githubusercontent.com/29995318/119926888-3984fc80-bfb3-11eb-94c4-d2bb20ee8fe5.png)

<br />

### 2-3 API list (최종)
![API_list](https://user-images.githubusercontent.com/29995318/119927170-e495b600-bfb3-11eb-97e1-b33c0e549dfb.png)

<br />

### 2-4 E-R Diagram (최종) 
![ERdiagram (2) (1) (1)](https://user-images.githubusercontent.com/29995318/119927875-4c003580-bfb5-11eb-8e36-f3b6c2f6067a.png)

<br />

## 3. 개발 주요 내용
#### DB 연동 
* ORM VS query 

회사 실무에서 하드한 것은 query로 직접 구현하고, 간단한 것들은 ORM을 사용하는 하이브리드 방식을 많이 이용한다. 

(나는 이전 웹 프로젝트에서 Django를 풀스택 프레임워크로 사용했을 때, ORM(Django Model)을 사용해본 경험이 있기 때문에, 
이번에는 직접 query를 하는 방식으로 진행하였다.)

<br /> 

#### 로그인, 로그아웃
* Passport 모듈 (passport-local)
  
  Session을 사용한 로그인. 
  
  + **post /login** 
  
  <br />
  
    ```javascript
    app.post("/login",
    // 앞(local)은 전략
        passport.authenticate('local', {
            successRedirect: '/login',  
            failureRedirect: '/login',
            failureFlash: true
        }), 
    );
    ```
  <br />
  
   + **LocalStrategy** 
   
      로그인 시에 사용자가 입력한 id, pw에 일치하는 사용자가 있는지 확인. 

      일치하는 사용자가 존재하지 않는 경우, error message 전달 (flash 이용)<br />
      일치하는 사용자가 존재하는 경우, 유저의 정보를 serialuser callback함수의 인자로 보냄. 
    
  ```javascript
  passport.use(new LocalStrategy({
      usernameField: 'id',
      passwordField: 'pw'
      },
      async function(id, pw, done) {
          const promise = await User.getUserById(id);
          if(promise.err){ 
              if(promise.err === "not_found"){
                  // 첫번째 인자: DB조회 같은 때 발생하는 서버 에러를 넣는 곳, 무조건 실패하는 경우에만 사용(성공했을 시 null) 
                  // 두번째 인자: 성공했을 때 return할 값을 넣는 곳 
                  // 세번째 인자: 사용자가 임의로 실패를 만들고 싶을 때 사용 
                  return done(null, false, {message: '존재하지 않는 회원입니다.'});
              }
              else{
                  console.log(err)
                  return done(err); 
              }
          }  
          if(!await bcrypt.compare(pw, promise.data.password)){
              return done(null, false, { message: '비밀번호를 확인해주세요.' });
          }
          // 로그인에 성공시 serializeUser의 callback 함수의 첫번째 인자로 주입해주도록 약속되어있다. 
          // console.log("promise.data: " + JSON.stringify(promise.data));
          return done(null, promise.data);
          // return done(null, user);
      }
  ));
  ```
  <br />

  + **serializeUser**
   
     로그인에 성공했을 때, 딱 한번 호출된다.<br />
     로그인에 성공했다는 것을, session store에 저장하는 기능을 한다. 즉, req.session.passport.user에 저장할 것을 지정한다.
    
  ```javascript
  passport.serializeUser(function(user, done) {

    done(null, user.user_num);
  });
  ```

  <br />
  
  + **deserializeUser**
  
    실제 서버로 들어오는 요청마다 serializeUser에서 저장된 세션 정보와 비교. serializeUser에서 done으로 넘겨주는 user가 deserializeUser의 첫번째 매개변수로 전달된다. 따라서 둘의 타입이 항상 일치해야 한다. 
    
  ```javascript
  passport.deserializeUser(async function(userNum, done) {
      const promise = await User.getUserInfo(userNum);

      done(promise.err, promise.data);
  });
  ```
  
  <br />
  
  + **logout**
    
  <br />
  
  ```javascript
  app.get("/logout", function(req, res){
      req.logout();  // request.user(req.user)라는 데이터를 삭제하고, session store에 있는 passport데이터를 삭제한다.
      req.session.save(function(){
          res.send({logout: true}); // session을 잃은 후 다시 돌아갈 페이지 redirect
      })
  });
  ```
  
<br />

#### 회원가입 
* 유효성 검사 

  + **express-validator 사용**: frontend와 backend에서 모두 유효성 검사를 하고, back단에서는 이 미들웨어 사용.
  
  <br />
  
  ```javascript
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
  ```
  
<br />

* 비밀번호 암호화

  + **bcrypt 사용**: 현업에서 많이 사용하고 있는 패스워드 암호화 알고리즘

<br />

* 이미지 파일 업로드

  + **multer 사용**
  
  <br /> 

  
  ```javascript
  var multer  = require('multer');
  var _storage = multer.diskStorage({
      // 사용자가 전송한 파일을 어느 디렉토리에 저장할 것인가. 
      destination: function (req, file, cb) {
          cb(null, 'uploads/')
      },
      // 그 디렉토리에 저장할 파일의 이름을 어떻게 할 것인가. 
      filename: function (req, file, cb) {
          cb(null, Date.now() + '_' + file.originalname)
      }
  }) // 객체 안의 두가지 property: destination, filename
  // storage로 지정하면 multer가 동작하면서 (사용자의 업로드와 관련된 작업을 처리하면서) 
  // multer는 storage가 가리키고 있는 것의 destination이라는 property와 filename이라는 property에 속해있는 함수를 실행시킬 것이다라는 약속이 되어있다.
  var upload = multer({ storage: _storage });
  
  
  
  app.post("/users", upload.single('profile_img'), user.addUser);
  ```
  
<br />

#### 업무 목록

* 업무 세분화 

본인이 관리자나 실무담당자로 있는 업무 리스트를 각각 받아서 

1. **완료된 업무**: 완료 유무 

2. **마감된 업무**: 마감일과 현재날짜, 시간 비교 

3. **진행 중인 업무**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3-1. **관리자 진행 중 업무**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 업무 수정, 삭제, 완료가 가능하도록 구성 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3-2. **실무 담당자 진행 중 업무** 

4. 진행 중인 업무에 대해서 **중요 표시가 된 업무**를 따로 리스트에 push 

<br />    

![업무세분화](https://user-images.githubusercontent.com/29995318/120430937-b4cf1f80-c3b2-11eb-98df-2e290204e486.png)

 
<br />    
    
## 4. 결과 

<br />   

* 회원가입

![회원가입](https://user-images.githubusercontent.com/29995318/120432464-eba63500-c3b4-11eb-9870-78785a45c69e.png)

<br />

* 로그인

![로그인](https://user-images.githubusercontent.com/29995318/120432433-e1843680-c3b4-11eb-8553-fdaf65795853.png)

<br />

* 업무 등록

![업무 등록](https://user-images.githubusercontent.com/29995318/120431857-07f5a200-c3b4-11eb-886f-7681d497fce1.png)

<br />

* 업무 목록

![업무목록(메인)](https://user-images.githubusercontent.com/29995318/120431878-117f0a00-c3b4-11eb-8b08-d3bd9579f76e.png)

<br />

* 업무 수정

![업무수정](https://user-images.githubusercontent.com/29995318/120431903-1cd23580-c3b4-11eb-9d8b-fd17e5032126.png)

<br />

* 업무 삭제

![업무삭제](https://user-images.githubusercontent.com/29995318/120431943-265b9d80-c3b4-11eb-8c18-850e8f69ad89.png)

<br />

* 세부 업무 목록

![세부업무목록](https://user-images.githubusercontent.com/29995318/120431962-2d82ab80-c3b4-11eb-89e0-403162f84930.png)

<br />

* 세부 업무 필터

![세부업무필터](https://user-images.githubusercontent.com/29995318/120432006-412e1200-c3b4-11eb-82d9-74f82fad7ff9.png)

<br />

* 세부 업무 등록 

![세부업무등록](https://user-images.githubusercontent.com/29995318/120432034-48552000-c3b4-11eb-9620-6c2b22715d80.png)

<br />

* 세부 업무 수정

![세부업무수정](https://user-images.githubusercontent.com/29995318/120432731-4c357200-c3b5-11eb-93c8-92e5bafa41ee.png)

<br />

* 세부 업무 삭제

![세부업무삭제](https://user-images.githubusercontent.com/29995318/120432769-57889d80-c3b5-11eb-9a07-4c31dc5846fe.png)

<br />


## 5. 프로젝트 일정

<br />    

![schedule](https://user-images.githubusercontent.com/29995318/119923162-2de20780-bfac-11eb-87b2-d3d5fc89f3c3.png)

<br />    
    
## 6. 개선 방안 

* 알림 기능 

   현재는 자신이 관리자나 실무담당자로 등록된 업무가 업무 목록에 다 뜨지만, 알림 기능을 추가하여 자신이 관리자나 실무담당자로 등록된 경우, 알림을 주고, 본인이 수락을 해야 자신의 업무 목록에 뜨도록 하는 기능이 있으면 본인이 의도하지 않은 업무를 받지 않아도 되므로 사용하기 더 편리해질 것 같음.


* 체크리스트 보완

   현재는 체크리스트 완료유무의 관리권한이 관리자에게만 있지만, 이를 업무 등록 시에 실무담당자들에게 각각 부여하면 각자 맡은 바에 대해서 관리하게 되어 더 효율적일 것 같음. 


* 사용자 그룹화 

   현재는 업무 등록 시에 전체 사용자에 대해서 관리자와 실무담당자를 선택할 수 있는데, 사용자가 많아지게 되면 불편할 것 같기도 하고, 전체 사용자 대상이므로 자신이 관리자나 실무담당자로 있는 업무들만 볼 수 있지만, 그룹화를 하면 그 그룹에 대해서만 관리자와 실무담당자를 선택할 수 있도록 할 수 있고, 자신이 속한 그룹이 진행하고 있는 모든 업무를 볼 수 있도록 하는 기능 등을 추가할 수 있어 편리해질 것 같음. 









