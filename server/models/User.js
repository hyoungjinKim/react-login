const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10;
const JWT = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //스페이스바 공백 제거
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this; // 인스턴스 참조
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRound, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return reject(err); // 에러 발생 시 Promise를 reject
      resolve(isMatch); // 에러가 없을 경우 Promise를 resolve
    });
  });
};

userSchema.methods.generateToken = async function () {
  try {
    let user = this;
    const token = JWT.sign(user._id.toHexString(), "secretToken");
    user.token = token;
    await user.save();
    return token;
  } catch (error) {
    console.error("토큰 생성 및 저장 중 에러 발생:", error); // 에러 출력
    throw new Error("토큰 생성 및 저장 중 에러 발생");
  }
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this; // 인스턴스 참조
  JWT.verify(token, "secretToken", function (err, decode) {
    User.findOne({ _id: decode, token: token })
      .then((user) => {
        // 사용자를 찾았을 때의 로직
        cb(null, user);
      })
      .catch((err) => {
        // 오류가 발생했을 때의 처리
        cb(err);
      });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
