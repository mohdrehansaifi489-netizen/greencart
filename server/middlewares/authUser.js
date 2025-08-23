// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.json({ success: false, message: 'Not Authorized' });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
//     if (tokenDecode.id) {
//       req.body.userId = tokenDecode.id;
//     } else {
//       return res.json({ success: false, message: ' Not Authorized' });
//     }
//     next();
//     res.json({success: true, message:'user is logged in'})

//   } catch (error) {

//     res.json({ success: false, message: error.message });
//   }
// }

// export default authUser;
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {

      // console.log(req);
      req.userId = tokenDecode.id;

      next(); // Pass control to the next middleware
    } else {
      return res.json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

