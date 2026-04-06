import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose
    .connect(process.env.MONGO_URI, {
            dbName: 'CHAT_APPLICATION'
        })
        .then(() => {
            console.log('Connected to Mongo DB database');
        })
        .catch((err) => {
            console.log('Error while connecting to the database:- ', err);
        })
};