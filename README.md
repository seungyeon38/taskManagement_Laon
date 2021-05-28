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

* 회원가입

![화면정의서_회원가입](https://user-images.githubusercontent.com/29995318/119926511-83211780-bfb2-11eb-9152-07a77260e224.png)

* 업무 목록(메인)

![화면정의서_업무목록](https://user-images.githubusercontent.com/29995318/119926551-9502ba80-bfb2-11eb-98aa-f55d29322e2f.png)

* 업무 등록

![화면정의서_업무등록](https://user-images.githubusercontent.com/29995318/119926589-a21fa980-bfb2-11eb-9806-9a6f3c84baf5.png)

* 세부업무 목록

![화면정의서_세부업무목록](https://user-images.githubusercontent.com/29995318/119926619-ab107b00-bfb2-11eb-8f4a-0ca95371b7f0.png)

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

#### 로그인
* 비밀번호 암호화

  + **bcrypt 사용**: 현업에서 많이 사용하고 있는 패스워드 암호화 알고리즘

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
    
## 4. 프로젝트 일정
![schedule](https://user-images.githubusercontent.com/29995318/119923162-2de20780-bfac-11eb-87b2-d3d5fc89f3c3.png)





