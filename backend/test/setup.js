import  express from'express';
import mongoose from 'mongoose';
import SuperTest from 'supertest';
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes';
import orderRoutes from '../routes/orderRoutes';
//import uploadRoutes from '../routes/uploadRoutes';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes)

//app.use('/api/upload', uploadRoutes)

app.use(function (req, res, next) {
    let err = new Error("Route Not Found");
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    // console.log(err);
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message
    })
});

beforeAll(done => {
    mongoose
        .connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(db => {
            done();
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
});

afterAll(done => {
    mongoose
        .disconnect()
        .then(() => {
            done();
        });

});

module.exports = SuperTest(app);
