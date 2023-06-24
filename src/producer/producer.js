require('dotenv').config();
const amqp = require('amqplib');


let {
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD,
    QUEUE_NAME,
    MESSAGE_SIZE,
    MESSAGES_PER_SECOND,
} = process.env;

const size = process.argv[2]; 
const rate = process.argv[3]; 
if(size && rate){
    MESSAGE_SIZE = size;
    MESSAGES_PER_SECOND = rate;
}

const interval = Math.floor(1000 / Number(MESSAGES_PER_SECOND));

async function connect() {
    try {
        const connection = await amqp.connect({
            hostname: RABBITMQ_HOST,
            port: RABBITMQ_PORT,
            username: RABBITMQ_USERNAME,
            password: RABBITMQ_PASSWORD,
        });

        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME);

        setInterval(() => {
            const message = [...Array(Number(MESSAGE_SIZE))].map(() => Math.random().toString(36).charAt(2)).join('');
            channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
            console.log('Message sent:', message);
        }, interval);
    } catch (error) {
        console.log("CONECTION ERROR")
        setTimeout(connect, 2000);
    }
}

connect();
