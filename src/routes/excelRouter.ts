import { Router } from "express";

const ExcelRouter = () => {
  const router = Router();

  router.get("/excel", async (req, res) => {
    const trips = req.body;
    console.log(trips);
    return res.status(200).json({ msg: "Excel" });
  });

  return router;
};

export default ExcelRouter;
