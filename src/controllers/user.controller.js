const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUser() function
/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3?q=address
 * Response - 
 * {
 *   "address": "ADDRESS_NOT_SET"
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 403 - If request data doesn't match that of authenticated user
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *
 */
// const getUser = async (req, res) => {
//   let id = req.params.userId;
//   let data = await userService.getUserById(id);
//   try {
//     if (data) {
//       return res.status(httpStatus.OK).json(data);
//     } else {
//       res.status(httpStatus.FORBIDDEN).json({ message: "User not found" });
//     }
//   } catch (e) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
//   }

// };

const getUser = catchAsync(async (req, res) => {
  let data;

  if(req.query.q === "address"){
    data = await userService.getUserAddressById(req.params.userId)
  }
  else{
   data = await userService.getUserById(req.params.userId)
  }
  if (data.email !== req.user.email){
    throw new ApiError(httpStatus.FORBIDDEN, "User not Authenticated to see other user's data");
  }

  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND,"User Not Found")
  }

  if(req.query.q ==="address"){
    res.send({
      address:data.address
    })
  }
  else{
  res.send(data)
  }
});



// const createUser = async (req, res) => {
//   // const {name, email, password}= req.body;
//   try {
//     const result = await userService.createUser(req.body);
//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };


// const getUser = catchAsync(async (req, res) => {
// });

const setAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.send({
    address: address,
  });
});

module.exports = {
  getUser,
  setAddress,
};
