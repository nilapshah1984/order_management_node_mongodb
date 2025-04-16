// //middleware
// //auth.js
// import jwt from "jsonwebtoken";

// import User from "../models/users.js";

// export const requireSignin = (req, res, next) => {
//      try {
//       const decoded = jwt.verify(
//             req.headers.authorization,
//             process.env.JWT_SECRET
//       );
//       //console.log("decoded =>", decoded)
//       req.user = decoded;
//       next();
//      } catch (err) {
//       return res.status(401).json(err);
//      }
// }

// export const isAdmin = async (req, res, next) => {
//       try {
//             const user = await User.findById(req.user._id);
//             if(user.role !== 1) {
//                   return res.status(401).send("UnAuthorized");
//             } else {
//                   next();
//             }
//       } catch (err) {
//          console.log(err);
//       }
// }



import jwt from "jsonwebtoken";
import User from "../models/users.js";


export const requireSignin = (req, res, next) => {
   const token = req.headers.authorization;

   if (!token) {
      return res.status(401).json({ message: "Token is required" });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
   } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
   }
};


export const isAdmin = async (req, res, next) => {
   try {
      const user = await User.findById(req.user._id);
      if (!user || user.role !== 1) {
         return res.status(403).json({ message: "Forbidden: Admins only" });
      }
      next();
   } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};
