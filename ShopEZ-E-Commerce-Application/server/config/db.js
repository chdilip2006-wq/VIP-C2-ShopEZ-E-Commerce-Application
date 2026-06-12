import dns from "node:dns";
import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopez";

  if (process.env.DNS_SERVERS) {
    const servers = process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean);

    if (servers.length > 0) {
      dns.setServers(servers);
    }
  }

  await mongoose.connect(mongoURI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
