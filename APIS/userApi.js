//import export module
const exp=require("express");
// console.log("expfun",exp)

//exp is a function not an obj we need to call it,it will create a mini express apllication obj that contains router function  we can use
const userApp= exp.Router();
//  console.log("expapp",app)

// to extract the body of req obj we use
//convert json to js
userApp.use(exp.json())

//import express async handler to handle async errors
const expressAsyncHandler=require("express-async-handler");

//import bcrypt mdoule to hash the pass (non core install it)
const bcryptjs=require("bcryptjs");

//import jsonwetoken to send token to user when login sucess
const jsonToken=require("jsonwebtoken")

// create user for sign up
userApp.post('/create-user',expressAsyncHandler(async(request,response)=>
{
    //get user collection object;
    let userCollectionObj=await request.app.get("userCollection");
    let userName=request.body.username;
    let userObj=await userCollectionObj.findOne({username:userName});
    if(userObj==null)
    {
       let addUserObj=request.body;
       let userPassword=request.body.password;
       //need to hash the password using bcrypt

       let hashedPassword=await bcryptjs.hash(userPassword,6)
       //6 i salt, how effective the password should be
       addUserObj.password=hashedPassword;

       //insert to db
       let addUser=await userCollectionObj.insertOne(addUserObj);
       response.send({message:"new user is created"})


    }
    else
    {
        response.send({message:"username is already exist"})
    }
}))


//login user method
userApp.post('/login',expressAsyncHandler(async(request,response)=>
{
    let userCollectionObj=await request.app.get("userCollection");
    let loginUserObj=request.body;
    //check user existed or not
    let checkUserObj= await userCollectionObj.findOne({username:loginUserObj.username});
    if(checkUserObj==null)
    {
      response.send({message:"user not exits please create account or invalid user"})
    }
    else
    {
        //from client we get plain text ,but in db we send hash
        //convert the password to hash and compare and we need to give same salt number
        

        //We can try below code but we get different hash code
       // let hashedLoginPass=await bcryptjs.hash(loginUserObj.password,6);

       //for comparsion we neeed compare loginuserobj with db object not vice versa
        let passwordStatus= await bcryptjs.compare(loginUserObj.password,checkUserObj.password);
     

        if(passwordStatus==true)
        {
         //after password is match we need ti generate token

         let userToken =jsonToken.sign({username:checkUserObj.username},"secretKey@123",{expiresIn:90});
         response.send({message:"login success",token:userToken,payload:checkUserObj})
        }
        else
        {
            response.send({message:"password incorrect"})
        }
    }
}))



//created a route to handle getusers
userApp.get('/getusers',expressAsyncHandler(async(request,response)=>
{
    let userCollectionObj= await request.app.get("userCollection");
    let userCollections=await userCollectionObj.find().toArray();

    response.send({message:"fetched all users sucessfully",payload:userCollections});
}))

// update user data except uusername and password
userApp.put('/update-user',expressAsyncHandler(async(request,response)=>
{
    let modifyUserObj=request.body;
    let userCollectionObj= await request.app.get("userCollection");

    let updUserObj=await userCollectionObj.updateOne({username:modifyUserObj.username},{$set:{...modifyUserObj}});
    response.send({message:"user data is modified"})
}))

//delete user byb username
userApp.delete('/remove-user/:username',expressAsyncHandler(async(request,response)=>
{
    let userName=request.params.username;
    let userCollectionObj = await request.app.get("userCollection");

    let findUser=await userCollectionObj.findOne({username:userName});
    if(findUser==null)
    {
            response.send({message:"user not exist"})
    }
    else
    {
    let deleteUser=userCollectionObj.deleteOne({username:userName});
    response.send({message:"user deleted successfully"})
    }


}))

module.exports=userApp;
//created a route to handle getusers
// userApp.get('/getusers',(request,response)=>
// {
//     response.send({message:"fetched all users sucessfully",payload:users});
// })

// //created a route to handle getusers with id
// userApp.get('/getuser/:id',(request,response)=>
// {

//     //fetch if from req using req.params
//     let reqid=(+request.params.id);
//    // console.log("id",reqid)

//    //iterate users and find with id
//     let userobj=users.find(user=>user.id==reqid)

//     if(userobj==undefined)
//     {
//         response.send({message:"user with given id not existed"});

//     }
//     else
//     {
//     response.send({message:"fetched single user sucessfully",payload:userobj});
//     }
// })

// //created a route to handle createusers
// userApp.post('/create-user',(request,response)=>
// {
//     // console.log("req",request.body)
//     let userObj=request.body;
//     let user=users.find(user=>user.id==userObj.id);

//     if(user==undefined)
//     {
//         users.push(userObj);
//         response.send("created a  user sucessfully");
//     }
//     else
//     {
//         response.send("user alreday existed");
//     }
   
// })

// //created a route to handle update user
// userApp.put('/update-user',(request,response)=>
// {
   
//     let reqId=(+request.body.id);
//     // console.log("rId",reqId);

//     let userObj=users.find(user=>user.id==reqId);
//     // console.log("userObjUpd",userObj);

//     if(userObj==undefined)
//     {
//         users.push(request.body)
//         response.send("updated new user sucessfully");
//     }
//     else
//     {
//         userObj.id=request.body.id;
//         userObj.name=request.body.name;
//         userObj.dept=request.body.dept;
//         response.send("updated user sucessfully");
//         // console.log("userObjUpd1",userObj);

//     }
// })


// //created a route to handle delete user with id
// userApp.delete('/remove-user/:id',(request,response)=>
// {
//     let reqId=(+request.params.id);
//     let userIndex=users.findIndex(user=>user.id==reqId);
//     if(userIndex==-1)
//     {
//     response.send("user not existed");
//     }
//     else
//     {

//         //splice() method to remove elements from the users array.
//         //userIndex: This is the index at which to start modifying the array. It's the index of the user we want to delete.
//        //1: This is the number of elements to remove from the array starting at the userIndex. In this case, we're removing only one element, which is the user we want to delete.
//         users.splice(userIndex,1);
//         response.send("user deleted successfully");
//     }
// })
