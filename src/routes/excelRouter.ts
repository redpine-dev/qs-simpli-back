import axios from "axios";
import { Router } from "express";

interface Trip {
  reference: string;
  status: string;
  comments: string;
  date: Date;
}

const ExcelRouter = () => {
  const router = Router();

  router.post("/", async (req, res) => {
    const trips = req.body as Trip[];
    console.log(trips);
    try {
      // Create an array of Axios requests
      const requests = trips.map(async (trip) => {
        const response = await axios.get(
          "https://api.simpliroute.com/v1/routes/visits/reference/" +
            trip.reference,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + process.env.TOKEN,
            },
          }
        );
        console.log(response.data.results[0].id);
        const id = response.data.results[0].id;
        console.log(response.data.results[0].status);
        if (response.data.results[0].status === "pending") {
          const url =
            "https://api.simpliroute.com/v1/mobile/visit/multiple/checkout";
          var arrayToSend = [];
          arrayToSend.push(id);

          const data = {
            checkout_comment: trip.comments || "",
            checkout_time: new Date(trip.date).toISOString(),
            status: trip.status,
            visits: arrayToSend,
            checkout_latitude: "-33.463481",
            checkout_longitude: "-70.628915",
          };
          const headers = {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.TOKEN,
          };

          const config = {
            method: "post",
            url: url,
            data: data,
            headers: headers,
          };
          const update = await axios(config);
          console.log(update.data);
        }
      });

      // Execute the requests concurrently using Promise.all
      await Promise.all(requests);

      return res.status(200).json({ msg: "Excel" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ msg: "Error" });
    }
  });

  return router;
};

export default ExcelRouter;
