//import export module
const exp=require("express");
// console.log("expfun",exp)

//exp is a function not an obj we need to call it,it will create a express apllication obj that contains server we can use
const productApp= exp.Router();
//  console.log("expapp",app)

// to extract the body of req obj we use
//convert json to js
productApp.use(exp.json())

//import async express handler
const expressAsyncHandler=require("express-async-handler") 


//created a route to handle getusers
productApp.get('/getproducts',expressAsyncHandler(async(request,response)=>
{
    let prodCollection=await request.app.get("prodCollection");
    let productsArray=await prodCollection.find().toArray();
    if(productsArray==null)
    {
    response.send({message:"empty products lists"});
    }
    else
    {
    response.send({message:"fetched all products sucessfully",payload:productsArray});
    }
}))

//created a route to handle getusers with id
productApp.get('/getproduct/:id',expressAsyncHandler(async(request,response)=>
{

    //fetch if from req using req.params
    let reqid=(+request.params.id);
   // console.log("id",reqid)

   //get products list
   let prodCollection=await request.app.get("prodCollection");


   //iterate users and find with id
    let prodobj=await prodCollection.findOne({id:reqid})

    if(prodobj==null)
    {
    response.send({message:"product with given id not existed"});
    }
    else
    {
    response.send({message:"fetched single product sucessfully",payload:prodobj});
    }
}))

//created a route to handle createusers
//all operation are blocking req db->col->obj, we need step by step
// in req handler we are using sync await

productApp.post('/create-product',expressAsyncHandler(async(request,response)=>
{
    // console.log("req",request.body)
    let prodObj=request.body;
    let prodId=request.body.id;
    // we have body but we need add to db collection, so we need prod collection
    // we can use app.get but app is not available in this file, it is avaialble in req
    let prodCollectionObj=await request.app.get("prodCollection")
    let product=await prodCollectionObj.findOne({id:prodId});
    //console.log("proo",product);
    if(product==null)
    {
        let prodResult=await prodCollectionObj.insertOne(prodObj)
        response.send({message:"created a  product sucessfully"});
    }
    else
    {
        response.send("product alreday existed");
    }
   
}))

//created a route to handle update user
productApp.put('/update-product',expressAsyncHandler(async(request,response)=>
{
   let reqId=(+request.body.id);

   //get products list
    let prodCollectionObj=await request.app.get("prodCollection");

    // find  product
    let prodObj=await prodCollectionObj.findOne({id:reqId});
    let modifiedObj=request.body;
    let productId=(+request.body.id)
    let updateProduct=await prodCollectionObj.updateOne({id:productId},{$set:{...modifiedObj}})
    response.send("updated product sucessfully");
}))


//created a route to handle delete user with id
productApp.delete('/remove-product/:id',expressAsyncHandler(async(request,response)=>
{
    let reqId=(+request.params.id);
    let prodCollectionObj=await request.app.get("prodCollection");
    let product=await prodCollectionObj.findOne({id:reqId});
    if(product==null)
    {
    response.send("product with given id doesnot exist");
    }
    else
    {
    let prodIndex=await prodCollectionObj.deleteOne({id:reqId});
    response.send("product deleted successfully");
    }
}))

module.exports=productApp;