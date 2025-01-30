import express from "express";
import { collectDefaultMetrics, register } from "prom-client";

const app = express();
const PORT = 3030; // Change port if needed

// Enable default system metrics
collectDefaultMetrics();

// Expose metrics at /metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Metrics server running at http://localhost:${PORT}/metrics`);
});
