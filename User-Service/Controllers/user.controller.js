const asyncHandler = require("../utils/asyncHandler")
const { BadRequestError } = require("../utils/errorTypes")

const { UserService, getProfile } = require("../Services/UserService")


exports.userprofile = asyncHandler(async (req, res) => {

    console.log("Done")
    const userID = req.user.id;
    console.log("this is the userId", userID);

    if (!userID) {
        throw new BadRequestError("User id is missing");
    }

    //   check in redis first 
    const user = await getProfile(userID);



    console.log(
        "usererrerr", user
    )

    console.log("USER JWT_SECRET:", process.env.JWT_SECRET);


    return res.status(200).json({
        message: "Fetched user data",
        success: true,
        data: {
            user
        }
    })



})