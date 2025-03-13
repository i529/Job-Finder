const express    = require('express');
const exphbs     = require('express-handlebars');
const app        = express();
const path       = require('path');
const db         = require('./db/connection');
const PORT       = 3000;
const bodyParser = require('body-parser');
const job        = require('./models/Job');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;


app.listen(PORT, function(){
    console.log(`O Express está rodando na porta ${PORT}`);
});


//body parser

app.use(bodyParser.urlencoded({extended: false}));

// handlebars

app.set('views', path.join(__dirname,'views')); 
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder

app.use(express.static(path.join(__dirname, 'public')));

//db connection

db  //authenticate its a connection with a db
    .authenticate()
    
    .then(() => {
        console.log("Conectou ao banco!");
    })

    .catch(err => {
        console.log("Deu erro ao conectar");
    })

// routes
app.get('/',(req, res) => { 

    let search = req.query.job;
    let query  = '%'+search+'%';

    if(!search) {
        Job.findAll({order:  [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            
            res.render('index', {
                jobs
            });
        })
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order:  [
                ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            
            res.render('index', {
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }

    
});

// jobs routes

app.use('/jobs', require('./routes/jobs'));