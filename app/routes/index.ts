import express, { Express } from "express";
import swagger from "../swagger";
import * as user from "../controller/user";
import * as company from "../controller/company";
import * as project from "../controller/project";
import * as auth from "../controller/auth";
import * as error from "../controller/error";
import { expressjwt as expressJwt, Request as JWTRequest } from "express-jwt";
import { userJWT, roleCheck } from "../middlewares/jwt";

export default function (app: Express) {
  const router = express.Router();

  //➫ get error demo
  router.get("/error", error.error);

  //➫ auth
  const authRouter = express.Router();
  router.use("/auth", authRouter);
  //User//
  authRouter.post("/user/login", auth.userLogin);
  authRouter.get("/user/logout", auth.userLogout);

  //➫ company
  const companyRouter = express.Router();
  router.use("/company", companyRouter);
  companyRouter.get("/", company.getCompany);
  companyRouter.post("/register", company.register);
  const projectRouter = express.Router();
  companyRouter.use("/project", projectRouter);
  projectRouter.post("/", project.register);
  projectRouter.get("/:id", project.getProject);

  //➫ user
  const userRouter = express.Router();
  router.use("/user", userRouter);
  userRouter.post("/register", user.register);
  userRouter.post("/login", user.login);
  userRouter.get("/logout", user.logout);
  //以下驗證 身份
  userRouter.use(expressJwt(userJWT), roleCheck("user"));
  userRouter.get("/do-something", user.doSomething);

  app.use("/api", router);
  swagger(app);
}
