import express, { Request, Response} from 'express';
import path from 'path';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import * as dotenv from 'dotenv'
dotenv.config();
import { allRoutes} from "./routes/router";

const startServer = () => {
    
    if (!process.env.AWS_ACCESS_KEY_ID) {
        console.log(`AWS_ACCESS_KEY_ID must be set`);
        process.exit();
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
        console.log(`AWS_SECRET_ACCESS_KEY must be set`);
        process.exit();
    }
    
    const port = 3000;
    
    process.on('SIGTERM', () => process.exit())
    process.on('SIGINT', () => process.exit())
    
    const app = express();
    
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({
        extended: true
    }));
    
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '/views'))
    
    app.use(allRoutes);
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
    
}

startServer();

