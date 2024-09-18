require('./config/db');
const express = require('express');
const cors = require('cors');
const staffRouter = require('./router/staffRouter');
const userRouter = require('./router/userRouter');
const keepServerAlive = require('./keepServerAlive');


const port = process.env.PORT || 4400;

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.get('/', (req, res) => {});
app.use('/api/v1', staffRouter, userRouter);

keepServerAlive();


app.get('/1', (req, res) => {
    res.send('Server is alive!');
});

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});