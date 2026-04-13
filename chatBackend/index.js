import { app } from "./app.js";
import { dbConnect } from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

dbConnect();
app.listen(PORT, () => {
  console.log(`server is Running on PORT ${PORT}`);
});
