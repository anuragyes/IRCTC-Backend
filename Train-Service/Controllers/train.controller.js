const { prisma } = require("../Config/prisma");

exports.createTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, type } = req.body;

    // Basic validation
    if (!trainNumber || !trainName) {
      return res.status(400).json({
        success: false,
        message: "Train number and train name are required"
      });
    }

    const train = await prisma.train.create({
      data: {
        trainNumber,
        trainName,
        type
      }
    });

    return res.status(201).json({
      success: true,
      data: train
    });

  } catch (error) {
    console.error(error);

    // Unique constraint error
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Train number already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};