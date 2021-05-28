업무 관리 서비스/ Task management service
==========================================


## 1. 개발 환경
+ Frontend: Vue.js
  + UI Framework: Element-UI
 
+ Backend: Node.js

+ DB: MySQL

![개발환경](https://user-images.githubusercontent.com/29995318/119928555-c087a400-bfb6-11eb-8575-fc63f30727dd.png)


## 2. 설계 (Design)
### 2-1. 주요 기능

+ 사용자 관련 기능

  + 로그인
  + 회원가입

+ 업무 관련 기능

  + 업무 목록 보기
  + 업무 등록
  + 업무 수정
  + 업무 삭제

+ (각 업무에 대한) 세부업무 관련 기능 

  + 세부업무 목록 보기
  + 세부업무 등록
  + 세부업무 수정 
  + 세부업무 삭제 

### 2-2. 화면정의서
+ 로그인

![화면정의서_로그인](https://user-images.githubusercontent.com/29995318/119926442-671d7600-bfb2-11eb-9117-18bad7279aae.png)

+ 회원가입

![화면정의서_회원가입](https://user-images.githubusercontent.com/29995318/119926511-83211780-bfb2-11eb-9152-07a77260e224.png)

+ 업무 목록(메인)

![화면정의서_업무목록](https://user-images.githubusercontent.com/29995318/119926551-9502ba80-bfb2-11eb-98aa-f55d29322e2f.png)

+ 업무 등록

![화면정의서_업무등록](https://user-images.githubusercontent.com/29995318/119926589-a21fa980-bfb2-11eb-9806-9a6f3c84baf5.png)

+ 세부업무 목록

![화면정의서_세부업무목록](https://user-images.githubusercontent.com/29995318/119926619-ab107b00-bfb2-11eb-8f4a-0ca95371b7f0.png)

+ 세부업무 등록

![화면정의서_세부업무등록](https://user-images.githubusercontent.com/29995318/119926888-3984fc80-bfb3-11eb-94c4-d2bb20ee8fe5.png)


### 2-3 API list (최종)
![API_list](https://user-images.githubusercontent.com/29995318/119927170-e495b600-bfb3-11eb-97e1-b33c0e549dfb.png)

### 2-4 E-R Diagram (최종) 
![ERdiagram (2) (1) (1)](https://user-images.githubusercontent.com/29995318/119927875-4c003580-bfb5-11eb-8e36-f3b6c2f6067a.png)

## 3. 개발 주요 내용
#### DB 연동 
+ ORM VS query 

회사 실무에서 하드한 것은 query로 직접 구현하고, 간단한 것들은 ORM을 사용하는 하이브리드 방식을 많이 이용한다. 

(나는 이전 웹 프로젝트에서 Django를 풀스택 프레임워크로 사용했을 때, ORM(Django Model)을 사용해본 경험이 있기 때문에, 
이번에는 직접 query를 하는 방식으로 진행하였다.)

#### 로그인
+ Passport 모듈
Session을 사용한 로그인. 


## 4. 프로젝트 일정
![schedule](https://user-images.githubusercontent.com/29995318/119923162-2de20780-bfac-11eb-87b2-d3d5fc89f3c3.png)





