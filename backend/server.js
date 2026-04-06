import app from './app.js';
import http from 'http';
import { v2 as cloudinary } from 'cloudinary';
import { initSocket } from './utils/socket.js';

//Configuring Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
    console.log(`Server is working on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})