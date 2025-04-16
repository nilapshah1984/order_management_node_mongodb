import express from "express";
import {createDepartment,listDepartment,listAllDepartment,readDepartment,removeDepartment,updateDepartment} from "../controllers/department.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

router.post("/department", ExpressFormidable(), createDepartment);
router.get("/departments", listDepartment);
router.get("/departments/all", listAllDepartment);
router.get("/departments/:slug", readDepartment);
router.put("/departments/:id", ExpressFormidable(), updateDepartment);
router.delete("/departments/:id", removeDepartment);

export default router;

