const fs = require('fs'); 
const { resolve } = require('path');
const path = require("path");
module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostByID, getPostsByCategory, getPostsByMinDate, getPublishedPostsByCategory};


let posts = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "data", "posts.json"), 'utf8', (err, data) => {
            if (err) 
            {
              reject("Unable to read file");
            }
            posts = JSON.parse(data); 

            fs.readFile(path.join(__dirname, "data", "categories.json"), 'utf8', (err, data) => {
                if (err) 
                {
                  reject("Unable to read file"); 
                }
                categories = JSON.parse(data); 
                resolve();
              });
          });
    })
}

function getAllPosts() 
{
    return new Promise((resolve, reject) => 
    {
        if (posts.length === 0) 
        {
            reject("No results returned");
        } 
        else 
        {
            resolve(posts);
        }
    })
}

function getPublishedPosts() 
{
    return new Promise((resolve, reject) => 
    {
        let publishedPosts = [];
        posts.forEach((post) => 
        {
            if (post.published === true) 
            {
                publishedPosts.push(post);
            }
        })

        if (publishedPosts.length > 0) 
        {
            resolve(publishedPosts);
        } 
        else 
        {
            reject("No results returned");
        }
    })    
}

function getCategories() 
{
    return new Promise((resolve, reject) => 
    {
        if (categories.length === 0) 
        {
            reject("No results returned");
        } 
        else 
        {
            resolve(categories);
        }
    })
}

function addPost(postData)
{
    return new Promise((resolve, reject) =>
    {

        if (postData.published == undefined) 
        {
            postData.published = false;
        }
        else
        {
            postData.published = true;
        }
        postData.id = posts.length + 1;
        posts.push(postData);
        resolve(postData);
    })
}

function getPostsByCategory(category)
{
    return new Promise((resolve, reject) => 
    {
        const filteredPosts = posts.filter(post => post.category == category);
        if (filteredPosts.length > 0)
        {
            resolve(filteredPosts);
        }
        else
        {
            reject("no results returned");
        }
    })
}

function getPostsByMinDate(minDateStr)
{
    return new Promise((resolve, reject) => 
    {
        const filteredPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDate));
        if (filteredPosts.length > 0)
        {
            resolve(filteredPosts);
        }
        else
        {
            reject("no results returned");
        }
    })
}

function getPostByID(id)
{
    return new Promise((resolve, reject) => 
    {
        const filteredPosts = posts.filter(post => post.id == id);
        if (uniquePost)
        {
            resolve(uniquePost);
        }
        else
        {
            reject("no results returned");
        }
    })
}

function getPublishedPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredPosts = posts.filter(post => post.category == category && post.published === true);

        if (filteredPosts.length > 0) {
            resolve(filteredPosts);
        } else {
            reject("no results returned");
        }
    })
}