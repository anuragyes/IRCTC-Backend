// // For Singleton Behaviour

// const { producer, connectProducer } = require("../../Config/kafka");
// const logger = require("../../Config/logger");
// const { TOPICS } = require("../../utils/constants");

// class NotificationProducer {
//     constructor() {
//         this.isInitialized = false;
//     }

//     async initialize() {
//         if (!this.isInitialized) {
//             await connectProducer();
//             this.isInitialized = true;
//             logger.info("Kafka Notification Producer Initialized");
//         }
//     }

//     async sendMessage(topic, key, value) {
//         try {
//             await this.initialize();

//             await producer.send({
//                 topic,
//                 messages: [
//                     {
//                         key: key || `${topic}-${Date.now()}`,
//                         value: JSON.stringify(value),
//                         timestamp: Date.now().toString(),
//                     },
//                 ],
//             });

//             const result = await producer.send(message);
//             logger.info(`message send to kafka topic ${topic}`, {
//                 key,
//                 partition: result[0].partition,
//                 offset: result[0].offset
//             });
//             return result;
//         } catch (error) {
//             logger.error("Kafka send error:", error);
//             throw error;
//         }
//     }

//     async sendOTPEmail(email, otp, ttlMinutes = 5) {
//         return this.sendMessage(
//             TOPICS.OTP_EMAIL,
//             `otp-${email}`,
//             { email, otp, ttlMinutes }
//         );
//     }
// }

// module.exports = new NotificationProducer();
