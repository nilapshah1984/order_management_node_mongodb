import express from "express";
import { register, login, forgetPassword } from "../controllers/auth.js";
//import { isAdmin, requireSignin } from "../middleware/auth.js";

const router = express.Router();
// middleware

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password",forgetPassword);
// router.get("/auth-check",requireSignin,(req, res) => {
//       res.json({ok :true});
// } )
// router.get("/admin-check" , requireSignin, isAdmin,(req, res) => {
//       res.json({ok: true});
// } )

// router.put("/profile", requireSignin, upDateProfile);

// router.get("/orders", requireSignin, getOrders);

// router.get("/all-orders", requireSignin, isAdmin, allOrders)
 

//testing
//  router.get("/secret",requireSignin,isAdmin,(req, res) => {
//       res.json({currentUser:req.user})
//  })
//router.get("/pra", pra);
export default router;