const express = require("express");
const app = express();
const port = 3000;
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "API_KEY",
  server: "SERVER"
});

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})


//Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
app.post("/", function(req, res) {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const listId = "LIST_ID";
      console.log(firstName);
      console.log(lastName);
      console.log(email);

      //This creates a function for us to run later that sends the info to MailChimp.  Part of this comes straight from the MailChimp guide, the rest is for handling the response.
      async function run() {

        //try/catch is used in an async function to catch any errors that come back.  Like if/else, it can run a different set of instructions based on what comes back.
        try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName
            }
          })
          res.sendFile(__dirname + "/success.html");
        } catch (error) {
          console.log(error);
          res.sendFile(__dirname + "/failure.html");
        }
      };

      //running the function created above.
      run();
  })

  // app.get("/failure", function(req,res) {
  //   res.redirect("/");
  // })

  //Our listener that opens the server
app.listen(process.env.PORT || 3000, function() {
  console.log("");
});
