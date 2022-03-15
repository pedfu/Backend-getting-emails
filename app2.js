const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); // uses the public folder to save static stuffs, such as images, css etc. this app.use allow the program to use it

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

  mailchimp.setConfig({
  apiKey: "46eb1d975de6bf513e2e1bd7fb423e71-us14",
  server: "as14"
});

  const listId = "82aad572fa";
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
    );
  }

  run();

  // const data = {
  //   members: [
  //     email_address= email,
  //     status= "subscribed",
  //     merge_fields= {
  //       FNAME: firstName,
  //       LNAME: lastName
  //     }
  //   ]
  // }
  //
  // const jsonData = JSON.stringify(data);
  //
  // const url = "https://us14.api.mailchimp.com/3.0/list/82aad572fa";  //us14 from the end of api key
  //
  // const Options = {
  //         method: "POST",
  //         headers: {
  //             Authorization: 'pedro:46eb1d975de6bf513e2e1bd7fb423e71-us14'
  //         }
  //       }
  // const request = https.request(url, Options, function(response) {
  //   response.on("data", function(data) {
  //     console.log(JSON.parse(data));
  //   })
  // })
  //
  // request.write(jsonData);
  // request.end();
})

app.listen(3000, function() {
  console.log("server is running on port 3000");
})


// 46eb1d975de6bf513e2e1bd7fb423e71-us14  // api key
// 82aad572fa  // audience id
