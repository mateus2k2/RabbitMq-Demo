require('dotenv').config();
const amqp = require('amqplib');

const {
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
  QUEUE_NAME,
} = process.env;

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

    channel.consume(QUEUE_NAME, (message) => {
      console.log('Message received:', message.content.toString());
      channel.ack(message);
    });
  } 
  catch (error) {
    console.log("CONECTION ERROR")
    setTimeout(connect, 2000);
  }
}

connect();
