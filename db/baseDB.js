const mysql = require("mysql");
const handatabaseConfig = require("./dbConfig")
let db = {};  //数据库 对象

//插入操作，注意使用异步返回查询结果
db.executeSql = function(connection, sql, params, callback){
    connection.query(sql, params, function (error, results, fields) {
        if (error) throw error;
        const result = {
            ...results,
            fields
        }
        callback(result);//返回插入的id
    });
}

//关闭数据库
db.close = function(connection){
    //关闭连接
    connection.end(function(err){
        if(err){
            return;
        }else{
            console.log('关闭连接');
        }
    });
}


//获取数据库连接
db.connection = function(){
    //数据库配置
    let connection = mysql.createConnection(handatabaseConfig);
    console.log('数据库连接已建立')
    //数据库连接
    connection.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
    });
    return connection;
}

module.exports = db;