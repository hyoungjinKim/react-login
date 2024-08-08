const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
const config = require("./config/dev");
const { auth } = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("DB connection error: " + err));

app.get("/", (req, res) => {
  res.send("Hello World~~안녕 ㅎㅎ");
});

app.post("/api/user/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((userInfo) => {
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.post("/api/user/login", async (req, res) => {
  try {
    // 이메일로 사용자 찾기
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: "해당 이메일로 등록된 사용자가 없습니다.",
      });
    }
    console.log("이메일 확인");
    // 비밀번호 일치 확인
    try {
      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) {
        return res.status(400).json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
      // 비밀번호가 일치할 경우 이후 작업을 수행합니다.
    } catch (error) {
      // 비교 과정에서 에러가 발생한 경우 처리합니다.
      return res.status(500).json({
        loginSuccess: false,
        message: "비밀번호 비교 중 에러가 발생했습니다.",
      });
    }

    // 토큰 생성
    const token = await user.generateToken();
    console.log("토큰 생성 확인");

    // 쿠키에 토큰 저장 및 응답
    res.cookie("x_auth", token).status(200).json({
      loginSuccess: true,
      userId: user._id,
    });
    console.log("토큰 쿠키로 전송 완료");
  } catch (error) {
    res
      .status(500)
      .json({ loginSuccess: false, message: "로그인 중 오류가 발생했습니다." });
  }
});

app.get("/api/user/auth", auth, (req, res) => {
  //여기까지 미틀웨어를 통과하면 Auth가 true임
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  console.log("로그아웃 시작");
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      return res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
  console.log("logout success");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요").json(console.log("안녕하세요"));
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
