//导入数据库操作模块
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')

const config = require('../config.js')

const jwt = require('jsonwebtoken')
//01 注册新用户的处理函数
exports.regUser = (req, res) => {

    //011获取客户端提交到服务器的信息
    const userinfo = req.body
    console.log(userinfo);
    //对表单中的数据进行合法性的校验
    // if (!userinfo.name || !userinfo.password) {
    //     return res.send({
    //         status: 1,
    //         msg: '用户名或密码不合法'
    //     })
    // }

    //012实现密码重复的报错
    // 测试mysql模块是否正常工作
    db.query('select 1', (err, results) => {

        if (err) { console.log(err.message); }

        console.log(results);
    })
    //定义sql语句
    const sqlStr = 'select * from ev_users where username= ?'
    // 执行Sql语句
    db.query(sqlStr, userinfo.username, (err, results, next) => {
        if (err) { res.send({ status: 1, msg: err.message }); }
        //   //判断用户名是否被占用
        if (results.length > 0) { res.send({ status: 1, msg: '用户名已存在' }); return; }


    })

    //013用户名可用对密码进行加密
    // 调用bcrypt.hashSync()对密码进行加密

    // userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    const saltRounds = 10;
    bcrypt.hash(userinfo.password, saltRounds, function (err, hash) {
        if (err) { return res.send({ status: 1, msg: err.message }); }
        userinfo.password = hash;
        //014定义插入新用户的sql语句
        const sql = 'insert into ev_users set ? ';
        db.query(sql, userinfo, (err, results) => {
            if (err) { return res.send({ status: 1, msg: err.message }); }
            if (results.affectedRows !== 1) { return res.send({ status: 1, msg: '注册用户失败，请稍后再试' }); }
            res.send({ status: 0, msg: '注册用户成功' });
        });
    });

    // //014定义插入新用户的sql语句
    // const sql = 'insert into ev_users set ? '
    // //调用db.query()执行sql语句
    // db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
    //     //判断sql语句是否执行成功
    //     if (err) { res.send({ status: 1, msg: err.message }); }
    //     // 判断影响行数是否为1
    //     if (results.affectedRows !== 1) { res.send({ status: 1, msg: '注册用户失败，请稍后再试' }); }


    // })

    // res.send({ status: 0, msg: '注册成功！' });
    // return;


}

//02 登录的处理函数
exports.logUser = (req, res) => {
    //021 获取客户端提交到服务器的值
    const userinfo = req.body
    //022 定义sql语句
    const sql1 = 'select * from ev_users where username = ?'
    //023 执行sql语句根据用户名查询用户的信息
    db.query(sql1, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) { return res.send(err); }
        // 执行sql语句成功，但是获取到的数据条数不等于1
        console.log(results.length);
        if (results.length !== 1) { return res.cc('登录失败'); }
        //0231  判断密码是否正确.
        
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);

        if (!compareResult) { res.cc('密码错误'); }

        //0232 在服务器端生成token的字符串
        const user = {...results[0],password:'',user_pic:''}
        console.log(user); 
        console.log(config.secretKey);
        //对用户的信息进行加密生成Token字符串
        const tokenStr = jwt.sign(user,config.secretKey,{expiresIn:config.expiresIn})
        console.log(tokenStr);
        // 调用res.send将token响应给客户端.
        res.send({
            status:0,
            msg:'登陆成功',
            token:'Bearer '+tokenStr
        })
        res.send('login OK');
    })








}