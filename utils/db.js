import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";
    const uri = `mongodb://${host}:${port}`;

    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    this.client
      .connect()
      .then((client) => {
        this.db = client.db(database);
        console.log("Successfully connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB", err);
      });
  }

  isAlive() {
    return this.client.isConnected && this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.db) {
      throw new Error("Database connection not established yet.");
    }
    try {
      return await this.db.collection("users").countDocuments();
    } catch (err) {
      throw new Error(`Unable to get number of users: ${err.message}`);
    }
  }

  async nbFiles() {
    if (!this.db) {
      throw new Error("Database connection not established yet.");
    }
    try {
      return await this.db.collection("files").countDocuments();
    } catch (err) {
      throw new Error(`Unable to get number of files: ${err.message}`);
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
