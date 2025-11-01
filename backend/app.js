require('dotenv').config();

const express = require('express');
const cors=require('cors');
const app=express()

const connectDB = require('./db/connect')
const itemsRouter = require('./routes/items')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.json());
app.use(cors({origin : ['http://localhost:5173', 'http://127.0.0.1:5173',process.env.FRONTEND_URL], credentials: true}));
app.use('/api/watchlist',itemsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,() => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start();