const express = require('express');
const app = require('../app');
const moment = require('moment');
const router = express.Router();
const db = require('../db/baseDB');
const { GUID } = require('../util/baseUtil')
const usersMiddlewareOne = (req, res, next) => {
  req.query = {
    userInfo: {
      userName: 'Han',
      passWord: 'aaabbbccc',
      requestTime: new Date().getTime(),
      hostname: req.hostname,
      ip: req.ip,
      requestUrl: req.url 
    },
    params: {
      ...req.query
    }
  }
  console.log('执行了usersMiddlewareOne.req:', req.query)
  next()
}

const usersMiddlewareTwo = (req, res, next) => {
  console.log('userInfo',req.query.userInfo || '当前无用户信息')
  next()
} 

const middlewares = [usersMiddlewareOne, usersMiddlewareTwo]

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/getAll', function(req, res) {
  try{
    console.log('开始连接db')
    const connection = db.connection();
    db.executeSql(connection, 'SELECT * FROM user_info',{}, (results) => {
      return res.send(results?JSON.stringify(results):'[]')
    })
    db.close(connection); // 执行结束  关闭数据库连接
  }catch{
    res.send('db error');
  }
});


router.post('/adduser', function(req, res) {
  try{
    console.log(req)
    const { username, password, age, email, phone } = req.body
    const userInfo = {
      username, password, age, email, phone
    }
    console.log('userInfo: ', userInfo)
    const sql_str = `
    INSERT INTO user_info 
    (username, password, age, id, createtime, email, phone)
    VALUES('${username}','${password}', '${age}', '${GUID()}', '${moment().format()}', '${email}', '${phone}')
    `;
    console.log('sql:',sql_str)
    const connection = db.connection();
    db.executeSql(connection, sql_str, {}, (results) => {
      
      res.render('hello', {
        layout: false,
        title: "登录页",
        indexInfo: "index paper"
    });
      // return res.send(results?JSON.stringify({results, userInfo}):'[]')
    })
    db.close(connection); // 执行结束  关闭数据库连接
  }catch{
    res.send('db error');
  }
});

module.exports = router;
