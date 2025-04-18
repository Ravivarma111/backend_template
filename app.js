//import export module
const exp=require("express");
// console.log("expfun",exp)

//exp is a function not an obj we need to call it,it will create a express apllication obj that contains functionalities  we can use
const app= exp();
//  console.log("expapp",app)

// to extract the body of req obj we use
//convert json to js
app.use(exp.json())

//import monfoclient from mondodb to communicate connection between server and db
const mongoClient=require("mongodb").MongoClient;
// console.log(mongoClient)

//connect dburl
const dbUrl="mongodb+srv://Ravi_Hepto:Ravi_Hepto@heptocluster.tqngk9b.mongodb.net/?retryWrites=true&w=majority&appName=HeptoCluster";


//connect dburl witj connect method
mongoClient.connect(dbUrl)
.then((clientObj)=>
{
    //fetch db
    const dbObj=clientObj.db("hepto");

    //fetch usercollection & prodcollection
    const userCollection=dbObj.collection("usercollection");
    const prodCollection=dbObj.collection("productcollection");

    //after fetching set collection ,so that user and prod api will use 
    app.set("userCollection",userCollection);
    app.set("prodCollection",prodCollection);

    console.log("DB connection is sucessfull")


})
.catch(err=>
    console.log("error when connect with db",err))
//we seperated files and now we need to connect them
//import user and product api
const userApi=require('./APIS/userApi');
const productApi=require('./APIS/productApi');

//after import we need to use it but when? so if particular  path matches use api route
app.use('/userApi',userApi);
app.use('/productApi',productApi);




//to handle invalid paths
app.use((request,response,next)=>
{
    response.send({message:`path ${request.url} is invalid`});
})

//to handl error(syntax kindof)
app.use((err,request,response,next)=>
{
    response.send({message:`error occured: ${err.message}`})
})


//listen port number 4000
 app.listen(4000,()=>
{
    console.log("request listening to port number 4000")
})