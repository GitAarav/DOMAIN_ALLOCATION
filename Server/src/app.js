import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(5500,()=>{
    console.log('Server is running on port 5500');
})