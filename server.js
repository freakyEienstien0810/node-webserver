const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');

const port = process.env.PORT || 9898;
var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) =>{
        if (err){
            console.log('Unable to append to server.log.')
        }
    });
    next();
});

//Creating a Maintenance middle wear P.S. => Uncomment the code for blocking all route execution
/*app.use((req, res, next) =>{
    res.render('maintenance.hbs');
});*/

app.use(express.static(__dirname + '/public')); //rendering static files

app.get('/',(req, res) => {
    res.render('login.hbs');

});

app.post('/login',(req, res) => {
    res.send(`Your sent the fields : UserName :${req.body.username} and Password: ${req.body.password}`);
});

app.use(express.static(__dirname + '/public'));
app.get('/about' ,(req , res) =>{
    res.render('about.hbs',{
        pageTitle: 'About'
    });
});

app.get('/404' ,(req , res) =>{
    res.render('errorHandler.hbs',{
        errorCode: 500,
        errorMessage: 'Oops! Something went wrong'
    });
});


app.use((req, res, next) =>{
    res.status(404);
    res.format({
        html:() =>{
            res.render('errorHandler.hbs',{
                errorCode: 404,
                errorMessage: 'Page not found'
            });
        },
        json:() =>{
           res.json({error : 'Not found'});
        },
        default: () =>{
            res.render('errorHandler.hbs',{
                errorCode: 404,
                errorMessage: 'Page not found'
            });
        }
    })
});

app.use((err, req, res, next) => {
    res.render('errorHandler.hbs',{
        errorCode: 500,
        errorMessage: 'Oops! Something went wrong'
    });
});

app.listen(port ,() =>{
    console.log(`Server started on port: ${port}`);
});

module.exports.app =  app;