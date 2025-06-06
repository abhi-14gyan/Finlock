require('dotenv').config();
require('./config/passport');
const connectDB = require('./db/index.js');
const { app } = require('./app.js');

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("connectDB Connection Failed!!", error);
  });
