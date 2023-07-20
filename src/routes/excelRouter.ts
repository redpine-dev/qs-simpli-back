import { Router } from "express";

const ExcelRouter = () => {
  const router = Router();

  router.get("/excel", async (req, res) => {
    res.send("Excel");
  });

  return router;
};

export default ExcelRouter;
