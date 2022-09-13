import express, {json} from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const startServer = () => {

    const port = 3000;
    
    process.on('SIGTERM', () => process.exit())
    process.on('SIGINT', () => process.exit())

    const app = express();
    
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json());
    
    app.post('/form/send', (req, res) => {
        console.log(req.body);
        res.send(req.body);
    });
    
    app.all('*', function(req, res){
        res.redirect('/');
    });
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })

}

startServer();

