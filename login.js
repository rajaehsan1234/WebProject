const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

// //set static folder
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampleDB',
    connectionLimit: 10
})



app.post('/', encoder, (req, res) => {

    var username = req.body.uname;
    var userID = req.body.psw;
    connection.query(`Select * from logins where Uname ='${username}' and   ID=${userID}  `, (err, results, field) => {
        if (err) console.log("error");
        if (results.length > 0) {

            res.redirect("/Home");
        }
        else {
            res.redirect("/");
        }
        res.end();
    })
})
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(express.static(path.join(__dirname, '/public')));



app.set("view engine", "hbs")
let id;
app.get('/men/shirt/:id', (req, res) => {
    id = req.params.id;
    connection.query(`Select * from product JOIN prodimages using(ID) JOIN prodsize using (ID) where ID=${req.params.id}`, (err, results, field) => {
        if (err) console.log("error");
        else {
            let myarr = results[0].sizes.split(' ');
            res.render("product",
                {
                    rslt: {
                        first1: results[0],
                        myarray: myarr
                    }
                }
            );
        }
    })
});

app.get('/admin/addproduct',(req,res)=>{
    res.sendFile(__dirname + '/html/addproduct.html')
})

app.get('/checkout', (req,res)=>{
    
    res.sendFile(__dirname + '/html/checkout.html');
})

app.post('/admin/addproduct',encoder,(req,res)=>{
    connection.query(`Insert into product (ID,Name,Price,Actual,Discount,sizes) values(${req.body.id},'${req.body.name}',${req.body.price},${req.body.price},${req.body.discount},'${req.body.sizes}')`)
    
    res.sendFile(__dirname + '/html/addproduct.html')
}) 

app.get('/admin/dashboard',(req,res)=>{    
    res.sendFile(__dirname + '/html/admindashboard.html')

}) 


app.get('/admin/showproduct',(req,res)=>{
    connection.query(`Select* from product`,(err,results,field)=>{
        if (err) console.log("error");
        else {
            console.log(results);
            res.render("adminproducts",
            {
                data:results
            }
            );
        }
    })


}) 

app.post('/checkout',encoder,(req,res)=>{
    console.log(req.body);

})
app.post('/men/shirt/:id', encoder, (req, res) => {
    connection.query(`Insert into orders(size,ID) values('${req.body.size}',${id})`, (err, results, field) => {
        if (err) console.log(err);

    });

})

app.get('/Home', (req, res) => {
    res.sendFile(__dirname + '/html/Home.html');
}
);


app.get('/cart', (req, res) => {
    connection.query(`Select * from orders join product using (ID) join prodimages using (ID) `,(err,results, field) => {
        if (err) console.log("error");
        else {
            console.log(results);
            res.render("shoping _cart",
            {
                data:results
            }
            );
        }
    })
});
app.get('/product', (req, res) => {

    res.sendFile(__dirname + 'Express/product.html');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/Sign.html');
}
);
app.listen(1337)
{
    console.log("Listning!!!!!!");
};

module.exports = connection; 