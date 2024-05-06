module.exports = function(app, appData) {

    
    const { check, validationResult } = require('express-validator');

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }

    // Handle my routes
    app.get('/',function(req,res){
        res.render('index.ejs', appData)
    });

    app.get('/about',function(req,res){
        res.render('about.ejs', appData);
    });
    
    app.get('/register', function (req,res) {
        res.render('register.ejs', appData);                                                              
    });                                                                                                 
    app.post('/registered', [check('email').isEmail()], function (req, res)  {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./register'); }
        else { 

        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword)  {
            let sqlquery = "INSERT INTO UserInfo(username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
           // execute sql query
           let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email) + '.<a href='+'./'+'>Home</a>';
             res.send(result);             
             });
        });    
        };                                                                 
    }); 

    app.get('/login', function (req, res) {
        res.render('login.ejs', appData);
     });
 
     app.post('/LoggedIn', function (req, res) {
        const bcrypt = require('bcrypt');
        const username = req.body.username;
        const userPassword = req.body.password; 

        const sqlquery = "SELECT hashedPassword FROM UserInfo WHERE username = ?";
    
        db.query(sqlquery, [username], (err, result) => {
            if (err) {
                return console.error(err.message);
            } else {
                if (result.length > 0) {
                    const hashedPasswordFromDatabase = result[0].hashedPassword;
    
                    bcrypt.compare(userPassword, hashedPasswordFromDatabase, function (err, passwordMatch) {
                        if (err) {
                            return console.log("Error");
                        } else if (passwordMatch) {
                            req.session.userId = req.body.username;
                            res.send("Success " + req.sanitize(req.body.username) + ' You have successfully logged in. <a href='+'./'+'>Home</a>');
                        } else {
                            res.send("Incorrect password");
                        }
                    });
                } else {
                    res.send("User not found in the database" + '. <a href='+'./'+'>Home</a>');
                }
            }
        });
    });

    app.get('/language',function(req,res){
        res.render('language.ejs', appData)
    });

    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('You are now logged out. <a href='+'./'+'>Home</a>');
        })
    });
}
