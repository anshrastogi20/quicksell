const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3030; // Change port if needed

// Enable default system metrics
client.collectDefaultMetrics();

// Expose metrics at /metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Metrics server running at http://localhost:${PORT}/metrics`);
});
