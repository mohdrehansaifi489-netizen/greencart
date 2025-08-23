import jwt from 'jsonwebtoken';

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // ✅ fixed "node" → "none"
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    const token = req.cookies.sellerToken;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: "Invalid token" });
      }
      return res.json({ success: true, email: decoded.email });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
