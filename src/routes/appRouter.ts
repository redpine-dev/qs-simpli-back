import { Router } from "express";
import { Auth } from "../middlewares/auth";
import AuthRouter from "./authRouter";
import ExcelRouter from "./excelRouter";

const routeEndpoints = () => {
  const router = Router();

  router.use("/auth", AuthRouter());
  router.use("/excel", Auth, ExcelRouter());

  return router;
};
export default routeEndpoints;
