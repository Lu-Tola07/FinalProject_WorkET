require('./config/db');
const express = require('express');
const cors = require('cors');
const staffRouter = require('./router/staffRouter');
const userRouter = require('./router/userRouter');


const port = process.env.PORT || 4400;

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use('/api/v1', staffRouter, userRouter);

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});