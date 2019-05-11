const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//Db URI
let key = 'mongodb+srv://kartik:kartik@cluster0-tw8l8.mongodb.net/test?retryWrites=true'
mongoose.connect(key,{ useNewUrlParser: true });

let db = mongoose.connection; 

// Check Connection
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

db.on('error',(err)=>{
    console.log(err);
});

// Init app
const app = express();


// Bringing models
let Article = require('./models/article');


// Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');


//Body Parser
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())



// Home route
app.get('/', (req,res) => {
    Article.find({}, (err,articles) =>{
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title : 'Articles',
                articles : articles
            });
        }
    })
});

app.get('/articles/add', (req,res) => {
        res.render('add_article',{
            title : 'Add Article',
        });
});

//Get single article

app.get('/article/:id', (req,res) =>{
    Article.findById(req.params.id ,(err, article) =>{
        res.render('article',{
            article:article,
        });
    
});

// Add post submit route
app.post('/article/add',(req,res) =>{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save( (err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    } )
});

// Start server
app.listen(3000,() =>{
    console.log('Server started on port 3000');
})