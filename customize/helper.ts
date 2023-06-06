"use client";

const Locale = {
    User: {
    SignUp: "注册",
    Username: "用户名",
    UsernameHelper: "长度低于4个字符",
    Email: "邮箱地址",
    EmailHelper: "请输入有效的邮箱地址",
    Passwd: "密码",
    PasswdHelper: "长度低于6个字符",
    ReenteredPasswd: "再次输入密码",
    PasswdNotMatch: "密码不一致",
    InvitationCode: "邀请码（可选）",
    Verify: "验证",
    Reverify: "再次验证",
    VerificationCode: "验证码",
    SentOk: "发送成功，请查收邮件",
    RegisterOk: "注册成功，请登录",
    SignInIfReg: "已有帐号？登录",
    SignIn: "登录",
    SignInOk: "登录成功",
    SignUpIfNon: "没有帐号？注册",
    Remember: "记住我",
    ForgetPasswd: "忘记密码？",
    Verification: "身份验证",
    ResetPasswd: "重置密码",
    PasswdReset: "密码重置",
    InputUsername: "请输入用户名",
    Back: "上一步",
    Next: "下一步",
    Confirm: "确认",
    ChangePasswd: "更改密码",
    UnknowError: "未知错误，请刷新页面重试",
    ResetSuccess: "重置密码成功",
    ServerError: "服务端异常",
    InputChallenge: "请输入验证码",
  },
}

export function t(key: string) {
  if (key in Locale.User) {
    return Locale.User[key as keyof typeof Locale.User];
  } else {
    return "FIXME";
  }
};