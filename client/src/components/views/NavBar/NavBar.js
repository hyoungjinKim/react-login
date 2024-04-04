import React from "react";

function NavBar() {
  return (
    <div>
      <button>
        <a href="/login">로그인</a>
      </button>
      <button>
        <a href="/register">회원가입</a>
      </button>
    </div>
  );
}

export default NavBar;
