import express, { Express, RequestHandler } from 'express';
import data from './data.json';

const app: Express = express();
const port = 5000;

interface Client {
    email: string;
    number: string;
};
const clients: Client[] = data;

const sleep = (time: number): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

app.use(express.static('./dist/client'));

app.get('/search', async (request, response) => {
    try {
        if (!request.query.email) 
            throw {message: 'Поле Email обязательно'};

        const email: string = String(request.query.email);
        const emailValidationPattern  = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!email.match(emailValidationPattern)) 
            throw {message: 'Неправильный Email'};
        
        const queryNumber: string = String(request.query.number);

        if (request.query.number && (queryNumber.length !== 6 || !queryNumber.match(/^\d+$/))) 
            throw {message: 'Неправильный номер'};

        let filteredClients: Client[];

        filteredClients = clients.filter((client: Client): boolean => {
            let result = client.email === email;
            if (request.query.number && client.number !== queryNumber) result = false;
            return result;
        });
        await sleep(5e3);

        response.json(filteredClients);
        
    } catch (error) {
        if (error instanceof Error) {
            response.send('unknown error');
        } else {
            response.status(400).send(error.message);
        }
    }
});

app.listen(port, () => console.log(`Listen port ${port}`));

