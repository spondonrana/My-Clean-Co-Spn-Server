const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//! warning: Do not use in production
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

const uri =
  "mongodb+srv://spncleanco:jW7TjRQaobb1PNwy@cluster0.lqqqoou.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db("cleanco").collection("service");

    /*
    get /get-service ==> all data
    post /add-service ==> create new data
    put /update-service ==> modify a data on collection
    delete /delete-service ==> delete a data from collection
    */
    app.get("/get-service", async (req, res) => {
      const services = await servicesCollection.find({}).toArray();
      res.send(services);
    });

    app.post("/add-service", async (req, res) => {
      const data = req.body;

      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    app.put("/update-service/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: data };
      const options = { upsert: true };

      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/delete-service/:id", async (req, res) => {
      const { id } = req.params;

      const query = { _id: ObjectId(id) };

      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
    //* with try catch block
    // app.post("/add-service", async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const result = await servicesCollection.insertOne(data);
    //     res.send({ status: true, result: result });
    //   } catch (error) {
    //     res.send({ status: false, error });
    //   }
    // });
  } finally {
  }
}
run().catch(console.dir);

// Body
app.get("/dummy-route/user2", async (req, res) => {
  const data = req.body;
  res.json(data);
});

// Query

app.get("/dummy-route/user", async (req, res) => {
  const data = req.query;
  console.log(data);
  res.send(data);
});

// This param
app.get("/dummy-route/user/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send(id);
});

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Ami Run hossi Port ${port} theke.`);
});

// spncleanco  jW7TjRQaobb1PNwy
