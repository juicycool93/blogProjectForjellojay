module.exports = (app,jsonCreator,User,passport)=>{
    //회원가입
    app.post('/Signin',(req,res)=>{
        User.findOne(req.body.reqId,(err,user,isNull)=>{
            if(isNull==false){
                res.status(400).json({message:"Givin ID is already Exist"});
                return;
            }else{
                User.registAccount(req.body,(err,result)=>{
                    if(err){
                        console.log(err);
                    }else if(!result){
                        console.log('[account.js][/Signin][ERR]err without log!');
                    }else{
                        res.json({"userId":result});
                        return;
                    }
                    res.status(400).json({message:"Unexpected Error"});
                    return;
                });
            }
        });
    });

    app.post('/Login-local',(req,res,next)=>{
        //local 전략으로 로그인
        passport.authenticate('local', {session: true},(err,user,info)=>{
            if(err || !user){//unhandled에러res.status(400).json(info);
                if(!info){
                    res.status(400).json({message:"Id or Pw mismatch!"});
                }else{
                    res.status(400).json({message:"Unexpected Error"});
                }
            }else{
                req.logIn(user,(err)=>{
                    if(err)
                        console.log('[account.js][/Login-local][ERR]'+err);
                    else
                        return res.status(200).json({message:req.user.userid});
                });
            }
            return;
        })(req,res,next);
    });

    app.post('/Logout',(req,res)=>{ //로그아웃
        req.logOut();
        req.session.destroy();
        res.status(200).json();
    });

};