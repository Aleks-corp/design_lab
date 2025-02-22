import app from "./app";

import mongoose from "mongoose";
import "dotenv/config";
import axios from "axios";

const { DB_HOST = "", PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful on port ${PORT}`);
    });
    setInterval(async () => {
      try {
        const response = await axios.get(
          `${process.env.VITE_BASE_URL || "http://localhost:" + PORT}/ping`
        );
        console.log("🔄 New Response:", response.data);
      } catch (error) {
        console.error("⚠️ Keep-alive request failed:", error);
      }
    }, 12 * 60 * 1000);
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown Error");
    }
    process.exit(1);
  });
