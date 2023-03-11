/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dharmesh Patel     Student ID: 164242216     Date: March 10th, 2023
*
*  Online (Cyclic) Link: 
*
********************************************************************************/ 



var express = require("express");
var path = require("path");
const { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostByID, getPostsByCategory, getPostsByMinDate, getPublishedPostsByCategory } = require("./blog-service.js");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require("express-handlebars");
const stripJs = require('strip-js');

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

const app = express();
app.use(express.static('public')); 

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

cloudinary.config({
  cloud_name: 'ddvbx0ncc', 
  api_key: '955268425124594',
  api_secret: 'KUE_qtdx9UX3r-CTTTISChcx1rc',
  secure: true
});

const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      safeHTML: function (context) {
        return stripJs(context);
      },
    },
  })
);


initialize().then(() => 
{
  app.listen(HTTP_PORT, () => 
  {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})


app.get("/", (req,res) => 
{
  res.redirect("/about");
});

app.get("/about", (req, res) => 
{
    res.render("about");
});

app.get('/blog', async (req, res) => {

  let viewData = {};

  try{
      let posts = [];
      
      if(req.query.category){
    
          posts = await blogData.getPublishedPostsByCategory(req.query.category);

      }else{
          posts = await blogData.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
      let post = posts[0]; 
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      let categories = await blogData.getCategories();
      viewData.categories = categories;

  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {
  let viewData = {};

  try{
      let posts = [];

      if(req.query.category){
    
          posts = await blogData.getPublishedPostsByCategory(req.query.category);
      }else{
          posts = await blogData.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      viewData.post = await blogData.getPostById(req.params.id);

  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      let categories = await blogData.getCategories();
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }
  res.render("blog", {data: viewData})
});

app.get("/posts", (req, res) => 
{
  getAllPosts()
    .then((data) => 
    {
      res.json(data)
    })
    .catch((err) => 
    { 
      res.json(err);
    })
});

app.get('/posts/add',(req,res) => {
  res.sendFile(path.join(__dirname + "/views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => 
{
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    });
})


app.get("/categories", (req, res) => 
{
  getCategories()
  .then((data) => 
  {
    res.render("categories", { categories: data });
  })
  .catch((err) =>
  { 
    res.render("categories", { message: "NO RESULTS"});
  });
});

app.get("/posts", (req, res) => {
  
  if (req.query.category) {
    getPostsByCategory(req.query.category)
      .then((data) => {
        res.render("posts", { posts: data });
      })
     
      .catch((err) => {
        res.render("posts", { message: "no results" });
      });
  }
});
