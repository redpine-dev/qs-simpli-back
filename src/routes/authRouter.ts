import { Router } from "express";
import { Auth } from "../middlewares/auth";
import AuthService from "../services/authService";

const AuthRouter = () => {
  const router = Router();
  router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    let user = await AuthService.getUserByUsername(username);
    if (user.success) {
      return res.status(400).json({
        msg: "Usuario ya registrado",
      });
    }
    const result = await AuthService.createUser({
      username,
      password,
    });
    if (result.success) {
      const token = await result.data?.generateAuthToken(3600);
      return res.status(200).json({ token });
    } else {
      return res.status(result.status as number).send(result.error);
    }
  });
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.status(401).json({ error: "No credentials" });
    }
    const result = await AuthService.authenticate({
      username,
      password,
    });
    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(result.status as number).send(result.error);
    }
  });
  router.get("/show", Auth, async (req, res) => {
    const user = await req.user;
    const result = await AuthService.show(user);
    if (result.success) {
      const response = {
        user: result.data,
      };
      return res.json(response);
    } else {
      return res.status(result.status as number).send(result.error);
    }
  });
  router.get("/validate", async (req, res) => {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const result = await AuthService.tokenValidation(token);
    if (result.success) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  });

  return router;
};

export default AuthRouter;
