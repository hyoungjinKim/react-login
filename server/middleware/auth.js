const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리
  //클라이언트 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;
  //토큰을 복호화 한후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) {
      console.log("err" + err);
      return Promise.reject(err);
    }
    if (!user) {
      console.log("err");
      return Promise.resolve({ isAuth: false, error: true });
    }
    req.token = token;
    req.user = user;
    console.log("인증완료");
    next();
  });
  //유저 있으면 인증
  //없을 시 인증 x
};

module.exports = { auth };
