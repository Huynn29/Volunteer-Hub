const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi đăng ký tài khoản." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác.",
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
     console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi đăng nhập tài khoản." });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, accessToken, userInfo } = req.body;
    let googleUser = null;

    // 1. Verify with Google ID token (credential)
    if (credential) {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          googleUser = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split("@")[0],
            avatar: payload.picture,
          };
        }
      } catch (err) {
        console.error("Lỗi xác thực ID token Google:", err);
      }
    }

    // 2. Fetch userinfo using Google access_token
    if (!googleUser && accessToken) {
      try {
        const userinfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (userinfoRes.ok) {
          const profile = await userinfoRes.json();
          googleUser = {
            googleId: profile.sub,
            email: profile.email,
            name: profile.name || profile.email.split("@")[0],
            avatar: profile.picture,
          };
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin Google từ access_token:", err);
      }
    }

    // 3. Fallback to passed userInfo (for verified client payload or dev mode)
    if (!googleUser && userInfo && userInfo.email) {
      googleUser = {
        googleId: userInfo.googleId || userInfo.sub || `google_${Date.now()}`,
        email: userInfo.email,
        name: userInfo.name || userInfo.email.split("@")[0],
        avatar: userInfo.avatar || userInfo.picture,
      };
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({
        success: false,
        message: "Không thể xác thực tài khoản Google. Vui lòng thử lại!",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      if (user.status === "banned") {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị!",
        });
      }

      let hasUpdates = false;
      if (!user.avatar && googleUser.avatar) {
        user.avatar = googleUser.avatar;
        hasUpdates = true;
      }
      if (!user.googleId && googleUser.googleId) {
        user.googleId = googleUser.googleId;
        hasUpdates = true;
      }
      if (hasUpdates) {
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
        authProvider: "google",
        role: "user",
        status: "active",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập Google thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi đăng nhập bằng Google.",
    });
  }
};

module.exports = { register, login, googleLogin };
