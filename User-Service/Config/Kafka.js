const { Kafka, logLevel } = require("kafkajs");
require("dotenv").config();

let isKafkaConnected = false;

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "user-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9093"],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 300,
    retries: 8,
    maxRetryTime: 3000,
  },
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
  idempotent: true, // ensures exactly-once delivery
  maxInFlightRequests: 5,
  retry: {
    retries: 5,
  },
});

const connectProducer = async () => {
  if (!isKafkaConnected) {
    await producer.connect();
    isKafkaConnected = true;
    console.log("✅ Kafka Producer Connected");
  }
};

const disconnectProducer = async () => {
  if (isKafkaConnected) {
    await producer.disconnect();
    isKafkaConnected = false;
    console.log("❌ Kafka Producer Disconnected");
  }
};

// Graceful shutdown
process.on("SIGTERM", disconnectProducer);
process.on("SIGINT", disconnectProducer);

module.exports = {
  kafka,
  producer,
  connectProducer,
  disconnectProducer,
};
