const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./database')
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.get('/', function (req, res) {

    if (req.cookies.userToken) {
		res.sendFile(path.join(__dirname + '/views/index.html'))
		console.log("Account was already generated.")
		
    } else {
		function genUid() {
			return new Promise((resolve, reject) => {
				db.query("INSERT INTO tb_accounts (username) VALUES ('undefined')")
					.then(() => {
						db.query("SELECT id FROM tb_accounts ORDER BY id DESC LIMIT 1")
							.then((rows) => {
								var result = rows[0].id
								var uid = "user" + result
								db.query("UPDATE tb_accounts SET username = '"+uid+"' WHERE id = '"+result+"'")

								res.cookie('userToken', result, { expires: new Date(Date.now() + 900000), httpOnly: true })
								resolve(result);
							})
					});
			});
		}

		genUid().then(result => {
			res.sendFile(path.join(__dirname + '/views/index.html'))
			console.log("Account " + result + " was succesfully generated!")
		})
    }
});

app.listen(3000);
console.log('Express server started');