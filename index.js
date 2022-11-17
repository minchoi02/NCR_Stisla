const { response } = require('express');
const express = require('express')
const app = express()
const port = 5000
const http = require('http');

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "192.168.32.164",
  database: "cstecgigan",
  password: "qwer!@#$",
  port: 5432,
});

// app.get('/', (req, res) => {
//     res.send('안녕하세요')
// })

//메인
app.get("/", (req, res) => {
  //response.render(__dirname + '/index.ejs')
  // res.sendFile(__dirname + "/index.html");
  console.log('111123123');
  console.log('111',req.cookies['user']);
  if (req.cookies['user']) {
    const [, privateKey] = req.headers.cookie.split('=');
    res.sendFile(__dirname + "/public/index.html");
    // const userInfo = session[privateKey];
    // res.render('__dirname + "/index.html"', {
    //   isLogin: true,
    //   userInfo,
    // });
  } else {
    res.redirect("/login");
  }
});
app.set('view-engine', 'ejs');

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// 정적 파일 불러오기
app.use(express.static(__dirname + "/public"));

// 라우팅 정의



// 로그인
app.get('/login', (req, res, next) =>  {
    res.render(__dirname + "/public/auth-login.ejs");
});


//회원가입
app.get('/signup', (req, res, next) =>  {
  res.render(__dirname + "/public/auth-login-signup.ejs");
});

// //그룹 설정
// app.get('/user/group_setting', (req, res, next) =>  {
//   res.render(__dirname + "/user/group_setting");
// });



// 로그인 POST
app.post("/login", async function(req,res,next){
    let body = req.body;
    console.log(body);
    let pw
    let inputEmail = body.email;
    let inputPassword = body.password;
      const client = await pool.connect()
      try {
        const queryText = 'select * from "TN_USER" where "TR_USER_ID" = \'' + inputEmail + '\';'
        const res = await client.query(queryText)
        pw = res.rows[0];
        if(pw === undefined){
          console.log('일치하는 id 없음');
          }else{
            pw = res.rows[0]['TR_USER_PASSWD'];
        };
      } catch (e) {
        throw e
      } finally {
        client.end();
      }
      console.log('11111',pw)
      if(inputPassword === pw){
        console.log("비밀번호 일치");
        res.cookie("user", body.email , {
          expires: new Date(Date.now() + 900000),
          httpOnly: true
      });
        res.redirect("/user/group_setting");
        // res.redirect("/admin/training_management");
      }
      else{
        console.log("비밀번호 불일치");
        //res.redirect('/login?msg=등록되지 않은 사용자 입니다');
        res.render(__dirname + "/public/auth-login.ejs");
      }
      });

// 회원가입 POST
app.post("/signup", async function(req,res,next){

  let body = req.body;
  console.log(body);
  //아이디
  let inputEmail = body.email_user;
  let inputPassword = body.password_user;
  //비밀번호 재확인
  let inputConfirmPassword = body.password2_user;
  // 이름
  let inputName = body.frist_name;
  // 기관명
  let inputOrganization = body.organization_name;
  console.log('pw1',inputPassword ,'pw2',inputConfirmPassword )
    const client = await pool.connect()
    
 
    if(inputPassword === inputConfirmPassword){
      console.log("비밀번호 일치");
      const queryText = 'INSERT INTO  "TN_USER" ("TR_USER_ID", "TR_USER_PASSWD", "TR_USER_ORG",  "ROLE") VALUES (\'' + inputEmail + '\', \'' + inputPassword + '\', \'' + inputOrganization + '\', 1);'
      console.log('>>>>>', queryText)
      const res = await client.query(queryText)
      client.end();
      console.log("계정이 생성 되었습니다.")

      // console.log("계정이 생성 되었습니다.")
    }
    else{
    
      console.log("비밀번호 불일치");
     
      res.render(__dirname + "/public/auth-login-signup.ejs");
    } 
    res.redirect("/login");
    });




// 그룹 설정 POST
app.post("/user/group_setting", async function(req,res,next){

  let body = req.body;
  console.log(body);

    //그룹 설정 조, 팀 코드 변수 선언
    // const { selected_value } = require("/user/group_setting");
    let teamGroup = body.team;
    let teamCode = body.teamcode;
  

    // document.getElementById("team");

    const client = await pool.connect()
    console.log(teamGroup)
    // console.log(selected_value)
    // console.log(req.body.team)
    console.log(teamCode)
 
      const queryText = 'SELECT * FROM "TC_TEAMCODE" where "TR_USER_GRP" = \'' + teamGroup + '\';'
      const queryText2 = 'SELECT * FROM "TC_TEAMCODE" where "TEAM_CD" = \'' + teamCode + '\';'
      console.log('>>>>>', queryText)
      //const res = await client.query(queryText)
      teamGroup = (await client.query(queryText)).rows[teamGroup];
      teamCode = (await client.query(queryText)).rows[teamGroup];
      pw = res.rows[0];
      client.end();
     

      res.redirect("/user/group_setting");
      
    
   
     
    //  res.render(__dirname + "/public/auth-login-signup.ejs");
     
    });

// });
//     client.connect();

//     await client.query('select * from public."TN_ADMIN";', (err, db_res) => {
//       console.log(err, db_res.rows);
//       client.end();
//     });
//     console.log('1123123123');
//     // let result = await models.user.findOne({
//     //     where: {
//     //         email : body.userEmail
//     //     }
//     // });

//     // let dbPassword = result.dataValues.password;
//     // let inputPassword = body.password;
//     // let salt = result.dataValues.salt;
//     // let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

//     // if(dbPassword === hashPassword){
//     //     console.log("비밀번호 일치");f
//     //     res.redirect("/user");
//     // }
//     // else{
//     //     console.log("비밀번호 불일치");
//     //     res.redirect("/user/login");
//     // }
// });


//사용자
app.get("/user/group_setting", (req, res) => {
    res.sendFile(__dirname + "/public/user/group.html");
  });

app.get("/user/problem_solving", (req, res) => {
    res.sendFile(__dirname + "/public/user/problem_solving.html");
  });
app.get("/user/training_statistics", (req, res) => {
    res.sendFile(__dirname + "/public/user/training_statistics.html");
  });

//관리자
app.get("/admin/training_management", (req, res) => {
    res.sendFile(__dirname + "/public/admin/training_management.html");
  });
app.get("/admin/problem_group", (req, res) => {
    res.sendFile(__dirname + "/public/admin/problem_group.html");
  });

app.get("/admin/question_management", (req, res) => {
    res.sendFile(__dirname + "/public/admin/question_management.html");
  });
app.get("/admin/problem_solving", (req, res) => {
    res.sendFile(__dirname + "/public/admin/problem_solving.html");
  });

 app.get("/admin/view_results", (req, res) => {
    res.sendFile(__dirname + "/public/admin/view_results.html");
  });
  
// 서버 실행
/*app.listen(port, () => {
    console.log(`Listen : ${port}`);
  });*/

// app.get('/', function(req,res) {
//     res.sendFile(__dirname + "index.html")
// })

// app.get('/index', function(req,res) {
//     res.sendFile(__dirname + "index.html")
// })
/*
function doDisplay(){ 	
  var con = document.getElementById("hidden"); 	
  if(con.style.display=='none'){ 		
    con.style.display = 'block'; 	
  }else{ 		
    con.style.display = 'none'; 	
  } 
}
*/