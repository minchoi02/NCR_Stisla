const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "192.168.32.164",
  database: "cstecgigan",
  password: "qwer!@#$",
  port: 5432,
});
client.connect();

let query = 'select * from "TN_ADMIN" where "ADMIN_ID" = \'' + "testadmin" + '\';'
let pw = undefined
client.query(query, (err, res) => {
    console.log(res.rows[0]);
    pw = res.rows[0];
    if(pw === undefined){
        console.log('pass');
        }else{
        console.log(res.rows[0]['ADMIN_PASSWD']);
        pw = res.rows[0]['ADMIN_PASSWD'];
    };
    client.end();
});

console.log(1111111,pw);


if(pw === undefined){
    console.log('ㄴㄴㄴㄴ');
    }

if(pw === 'admin1234'){
  console.log('ㅇㅇㅇㅇ');
  }