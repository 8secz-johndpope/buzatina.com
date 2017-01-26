var express = require('express');
var app = express();

// prepare server
 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/public'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running... ');

app.get('/', function(req, res){
  
	res.sendFile(__dirname + '/index.html');

});

app.get('/forgotPassword', function(req, res){

  res.sendFile(__dirname + '/forgot.html');

});

app.get('/validate', function(req, res){

  res.sendFile(__dirname + '/validate.html');
  
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/login.html');
});

app.get('/settings', function(req, res){
  res.sendFile(__dirname + '/settings.html');
});

  /// Get Detailed Advice
  var artidStuff2;
  artidSet2 = function(artidValue){
    artidStuff2 = artidValue
  };

 
/// Get Detailed Advice
var artidStuff;
artidSet = function(artidValue){
  artidStuff = artidValue
};

app.get('/question/:artid/:id', function(req, res){

    var id = ''+ req.params.id;
    var artid = ''+ req.params.artid;
    console.log('Params value is: ...');
    console.log(artid);

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;
    
    //// SET ARTICLE ID
    artidSet(artid);

    //// Get profile
    getProfileQuestion(id, artid);

    res.sendFile(__dirname + '/questionDetail.html');

});

/// Get Detailed Advice Ends Here

io.on('connection', function(socket){

////Get Profile
    var emitProfile = function(data){
      socket.emit('profile', data);
    };

/// Authentication related events
  socket.on('UserConnect', function(data){

  socket.emit('UserConnectGetAccess', data);

 });

  //// Comment on something
  socket.on('postAdviceCommentEvent', function(data){
    var addTodata = data;
    addTodata.artid = artidStuff;
    putComment(addTodata);
  });

  //// Get ID on profile view to decide if following or not
  socket.on('checkFollowEvent', function(data){
    var profileid = artidStuff2;
  });

  //// Comment on something
  socket.on('postQuestionCommentEvent', function(data){
    saveQuestionAnswer(data);
  });

  socket.on('userData', function(data){

  io.sockets.emit('userData', data);

 });

/// Load Advice

// Load the SDK and UUID and Stuff
	var AWS = require('aws-sdk');
	AWS.config = new AWS.Config();
	AWS.config.accessKeyId = process.env.ACCESSKEY;
	AWS.config.secretAccessKey = process.env.SECRETKEY;

	AWS.config.region = 'us-west-2';


///// Post Advice
    socket.on('postAdviceEvent', function(data){

       var nako = Date.now();
       var userid = data.userId;


       var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
       var uniqueID = '';
       for (var i = 0; i < 11; i++) {
           var letterSelect = Math.floor(Math.random()*26)+1;
           var numberSelect = Math.floor(Math.random()*100)+1;

           uniqueID = uniqueID+letters[letterSelect]+numberSelect;
       };
       
       AWS.config.region = 'us-west-2';

        var params = {
                TableName: 'tips',
                Item: {
                    id: uniqueID,
                    articleDate: nako,
                    author: data.username,
                    insight: data.advice,
                    //name: 'We have to get userName from usersTable',
                    type: 'article',
                    //userPic: profilePicUrl,
                    country: data.country,
                    tag: data.tag
                }};

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.put(params, function(err, data){
            if (err) {

            }else{

                notify(userid);

                }
              
            });

    });

///// Ask Question
    socket.on('postQuestionEvent', function(data){
       
       console.log('Post question event logged');
       console.log(data);

       var nako = Date.now();
       var userid = data.userId;
       var pushQuestionData = data;

       var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
       var uniqueID = '';
       for (var i = 0; i < 11; i++) {
           var letterSelect = Math.floor(Math.random()*26)+1;
           var numberSelect = Math.floor(Math.random()*100)+1;

           uniqueID = uniqueID+letters[letterSelect]+numberSelect;
       };

       pushQuestionData.uniqueID = uniqueID;
       
       AWS.config.region = 'us-west-2';

        var params = {
                TableName: 'questions',
                Item: {
                    id: uniqueID,
                    articleDate: nako,
                    author: data.userId,
                    insight: data.question,
                    name: data.name,
                    authorEmail: data.username,
                    type: 'forumQuestion',
                    userPic: data.profilePicUrl,
                    country: data.country
                }
              };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.put(params, function(err, data){
            if (err) {
              console.log(err);

            }else{

                notify(userid, pushQuestionData);

                }
              
            });

    });

  //// set Business Event
  socket.on('businessEvent', function(data){
    setBusiness(data);
  });

    //// set Business Event
  socket.on('pictureEvent', function(data){
    setPic(data);
  });


    //// set Business Event
  socket.on('userUpdateEvent', function(data){
    setUsername(data);
  });

  /// Get a list of followers

  notify = function(userid, pushQuestionData){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

      AWS.config.region = 'us-west-2';

      var params = {
          TableName: 'following',
          FilterExpression: "#yr = :start_yr",
          ExpressionAttributeNames: { "#yr": "advisorId"},
          ExpressionAttributeValues: { ":start_yr": userid}             
      };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      var response = {};

      docClient.scan(params, function(err, data){
          
          if (err) {

          }else{
               
               sendNotification(data.Items, pushQuestionData);

              }          
      });

  };



	/// Get list of Items        

	var params = {
	    TableName: 'tips',
	    FilterExpression: "#yr = :start_yr",
	    ExpressionAttributeNames: { "#yr": "type"},
	    ExpressionAttributeValues: { ":start_yr": 'article'}             
	};

	dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
	docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

	var response = {};

	docClient.scan(params, function(err, data){
	    if (err) {
	        response.error = error.message;
	        io.sockets.emit('pushAdvice', response);
	    }else{
	        response.advice = data.Items;
	        io.sockets.emit('pushAdvice', response);    
	        }          
	});

	connections.push(socket);
	console.log('connected: %s sockets connected', connections.length);

	socket.on('disconnect', function(data){
	users.splice(users.indexOf(socket.username, 1));
	updateUsernames();
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected: %s sockets connected', connections.length);
	});

  socket.on('getQuestions', function(data){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

      AWS.config.region = 'us-west-2';

      var params = {
          TableName: 'questions',
          FilterExpression: "#yr = :start_yr",
          ExpressionAttributeNames: { "#yr": "type"},
          ExpressionAttributeValues: { ":start_yr": 'forumQuestion'}             
      };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      var response = {};

      docClient.scan(params, function(err, data){
          if (err) {
              io.sockets.emit('gotQuestions', error.message);
          }else{
              socket.emit('gotQuestions', data.Items);
              
              }          
      });
  });
 
	socket.on('loggedIn', function(data){
		io.sockets.emit('session', data);
	});

  socket.on('followEvent', function(data){
    console.log('follow event triggered');
    console.log(data);
    follow(data);
  });

	socket.on('session', function(data){
    socket.emit('session', data);
	});

  socket.on('GetUser', function(data){
    getUser(data);
  });

  socket.on('login', function(data){
    io.sockets.emit('loginAccess', data);
  });

	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

app.get('/profile/:profileid', function(req, res){

  var profileid = ''+ req.params.profileid;
  // artidSet2(profileid);
  getFollowers(req.params.profileid);

  var AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.ACCESSKEY;
  AWS.config.secretAccessKey = process.env.SECRETKEY;

  AWS.config.region = 'us-west-2';

        var params = {
            TableName: 'users',
            Key: {
                "userid": profileid          
            }
        };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.get(params, function(err, data){
            if (err) {
 
            } else {
              
              emitProfile(data.Item);

                }
              
            });

    res.sendFile(__dirname + '/profile.html');
});  

//// Socket Ends Here

});

//// Send a notification method;
sendNotification = function(data, pushQuestionData){

	var helper = require('sendgrid').mail;
	for (i=0; i<data.length; i++){
        var from_email = '';
        var to_email = ''; 
      	from_email = new helper.Email('notifications@buzatina.com');
      	to_email = new helper.Email(data[i].fanEmail);
      	subject = "buzatina.com notification";

        var htmlView = "<!DOCTYPE html>"+
        "<html>"+
        "<head>"+
          "<title> Some Title </title>"+
        "</head>"+"<div style='background-color: white; padding: 10px; border-radius: 5px; border: 1px solid #d9d8d5;'>"+
        "<body>"+
             "<h3>"+ data[i].advisor+"</h3>"+

             "<img "+ "src='"+pushQuestionData.profilePicUrl+"'" +" style='height: 65px;' >"+

             "<h4>"+ "Asked: " + pushQuestionData.question  +"</h4>"+
             "<a href='http://127.0.0.1:3000/question/"+pushQuestionData.uniqueID+'/'+pushQuestionData.userId+"'>view</a>"+
        +"</div>"+"</body>"+
        "</html>";
      	content = new helper.Content("text/html", htmlView);

//        content = new helper.Content("text/plain", data[i].advisor + " shared new advice");        
      	mail = new helper.Mail(from_email, subject, to_email, content);

      	var sg = require('sendgrid')(''+process.env.SENDGRIDKEY+'');
      	var request = sg.emptyRequest({
      	  method: 'POST',
      	  path: '/v3/mail/send',
      	  body: mail.toJSON()
      	});

      	sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
      	})
    };
  };

//// Send follow event notification
sendNotificationFollow = function(data){

  var helper = require('sendgrid').mail;

    var from_email = '';
    var to_email = ''; 
    from_email = new helper.Email('notifications@buzatina.com');
    to_email = new helper.Email(data.emailProfile);
    subject = "buzatina.com: you got a new follower...";

    var htmlView = "<!DOCTYPE html>"+
    "<html>"+
    "<head>"+
      "<title> Some Title </title>"+
    "</head>"+
    "<body>"+
         "<h3>"+data.nameUser+"</h3>"+

         "<img "+ "src='"+data.profilePicUrl+"'" +" style='height: 65px;' >"+

         "<h4>"+ "Is now following you on buzatina.com"+"</h4>"+
         "<a href='http://127.0.0.1:3000/profile/"+data.useridUser+"'>View Profile</a>"+
    "</body>"+
    "</html>";
    content = new helper.Content("text/html", htmlView);

//        content = new helper.Content("text/plain", data[i].advisor + " shared new advice");        
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(''+process.env.SENDGRIDKEY+'');
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
    })

  };

//// Send a notification method;
sendNotificationComment = function(data){

  console.log('Sendgrid event fired');

  var helper = require('sendgrid').mail;

    var from_email = '';
    var to_email = ''; 
    from_email = new helper.Email('notifications@buzatina.com');
    to_email = new helper.Email(data.authorEmail);
    subject = "buzatina.com: got an answer on your question...";

    var htmlView = "<!DOCTYPE html>"+
    "<html>"+
    "<head>"+
      "<title> Some Title </title>"+
    "</head>"+
    "<body>"+
         "<h3>"+data.name+"</h3>"+

         "<img "+ "src='"+data.profilePicUrl+"'" +" style='height: 65px;' >"+

         "<h4>"+ "Answered on your question:" + data.answer +"</h4>"+
         "<a href='http://127.0.0.1:3000/question/"+data.uniqueID+'/'+data.userId+"'>view</a>"+
    "</body>"+
    "</html>";
    content = new helper.Content("text/html", htmlView);

//        content = new helper.Content("text/plain", data[i].advisor + " shared new advice");        
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(''+process.env.SENDGRIDKEY+'');
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)
    })

  };
  
  /// Follow an advisor

 follow = function(data){

       var dataNotify = data;

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;    

       var nako = Date.now();


       var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
       var uniqueID = '';
       for (var i = 0; i < 11; i++) {
           var letterSelect = Math.floor(Math.random()*26)+1;
           var numberSelect = Math.floor(Math.random()*100)+1;

           uniqueID = uniqueID+letters[letterSelect]+numberSelect;
       };
       
       AWS.config.region = 'us-west-2';

        var params = {
                TableName: 'following',
                Item: {
                    id: uniqueID,
                    articleDate: nako,
                    advisor: data.nameProfile,
                    advisorId: data.useridProfile,
                    advisorEmail: data.emailProfile,
                    fan: data.nameUser,
                    fanId: data.useridUser,
                    fanEmail: data.emailUser
                }};

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.put(params, function(err, data){
            if (err) {

            }else{
                sendNotificationFollow(dataNotify);
                console.log('Following boss');
                }
              
            });

    };

    setBusiness = function(data){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

       AWS.config.region = 'us-west-2';

       if (data.bizSite) {

          var params = {
                  TableName: 'users',

                  Key: {
                      "userid": data.userId,                   
                  },
                  UpdateExpression: 'set bizName = :bN, bizSite = :bZ, description = :d, contactEmail = :cE',
                  ExpressionAttributeValues:{':bN': data.bizName, ':bZ': data.bizSite, ':d': data.description, ':cE': data.contactEmail},
                  ReturnValues:"UPDATED_NEW"
                };

       } else {

          var params = {
                    TableName: 'users',

                    Key: {
                        "userid": data.userId,                   
                    },
                    UpdateExpression: 'set bizName = :bN, description = :d, contactEmail = :cE',
                    ExpressionAttributeValues:{':bN': data.bizName, ':d': data.description, ':cE': data.contactEmail},
                    ReturnValues:"UPDATED_NEW"
                  };

       };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.update(params, function(err, data){
            if (err) {

            }else{

                }
              
            });   

    };

      setUsername = function(data){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

   
       AWS.config.region = 'us-west-2';

      var params = {

              TableName: 'users',

              Key: {
                  "userid": data.userId,                   
              },
              UpdateExpression: 'set Username = :bN, profession = :d, email = :eML',
              ExpressionAttributeValues:{':bN': data.name, ':d': data.title, ':eML': data.email},
              ReturnValues:"UPDATED_NEW"
          };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      docClient.update(params, function(err, data){
          if (err) {
 
              
          }else{
 

              }
            
          });

    };

/////////////// START GETTING DETAILED TIP API ///////////////

    getProfile = function(id, artid){

 

        var AWS = require('aws-sdk');
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = process.env.ACCESSKEY;
        AWS.config.secretAccessKey = process.env.SECRETKEY;
                                                                      
        AWS.config.region = 'us-west-2';

          var params = {
            TableName: 'users',
            Key: {
                "userid": id,           
            }
        };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.get(params, function(err, data){
            if (err) {
 
              
            } else {

              io.sockets.emit('author', data.Item);

              getTip(artid, id)

                }
              
            });
    };

    getProfileQuestion = function(id, artid){

 

        var AWS = require('aws-sdk');
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = process.env.ACCESSKEY;
        AWS.config.secretAccessKey = process.env.SECRETKEY;
                                                                      
        AWS.config.region = 'us-west-2';

          var params = {
            TableName: 'users',
            Key: {
                "userid": id,           
            }
        };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.get(params, function(err, data){
            if (err) {

 
              
            } else {

              io.sockets.emit('author', data.Item);
 

              getDetailedQuestion(artid, id)

                }
              
            });
    };

    getTip = function(artid, id){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;
 
      var params = {
              TableName: 'tips',
              Key: {
                  "id": artid,                   
              }
      };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      docClient.get(params, function(err, data){
          if (err) {

 

          } else {

              io.sockets.emit('advice', data.Item);

              getComments(artid);

              }
            
          });

    };

    getComments = function(artid){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

      AWS.config.region = 'us-west-2';

      var params = {
          TableName: 'comments',
          FilterExpression: "#yr = :start_yr",
          ExpressionAttributeNames: { "#yr": "commentId"},
          ExpressionAttributeValues: { ":start_yr": artid}           
      };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      docClient.scan(params, function(err, data){
          if (err) {
            
          } else {

              io.sockets.emit('adviceComments', data.Items);
     
          }
            
      });

    };

    putComment = function(data){

      var AWS = require('aws-sdk');
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = process.env.ACCESSKEY;
      AWS.config.secretAccessKey = process.env.SECRETKEY;

         var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
         var uniqueID = '';
         for (var i = 0; i < 11; i++) {
             var letterSelect = Math.floor(Math.random()*26)+1;
             var numberSelect = Math.floor(Math.random()*100)+1;

             uniqueID = uniqueID+letters[letterSelect]+numberSelect;
         };
         
         AWS.config.region = 'us-west-2';

          var params = {
                  TableName: 'comments',
                  Item: {
                      id: uniqueID,
                      commentCreated: Date.now(),
                      author: data.userId,
                      insight: data.answer,
                      name: data.name,
                      type: 'advice comment',
                      commentId: data.artid,
                      userPic: data.profilePicUrl
                  }

          };

          dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
          docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

          docClient.put(params, function(err, data){
              if (err) {

              } else {
 
                  
                  }
                  
              });

    };

///////////// CREATE A QUESTION API STARTS HERE

askQuestion = function(data){

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

     var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
     var uniqueID = '';
     for (var i = 0; i < 11; i++) {
         var letterSelect = Math.floor(Math.random()*26)+1;
         var numberSelect = Math.floor(Math.random()*100)+1;

         uniqueID = uniqueID+letters[letterSelect]+numberSelect;
     };
     
     AWS.config.region = 'us-west-2';

      var params = {
              TableName: 'questions',
              Item: {
                  id: uniqueID,
                  author: useriduserid,
                  forumDate: Date.now(),
                  insight: question,
                  name: name,
                  userPic: profilePicUrl,
                  country: country
              }

            };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      docClient.put(params, function(err, data){
          if (err) {
        
          } else {
              
              }
            
          });

};


////// RETRIEVE ASKED QUESTIONS API STARTS HERE

getQuestions = function(){

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    AWS.config.region = 'us-west-2';

    var params = {
        TableName: 'questions'           
    };

    dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
    docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
        

    docClient.scan(params, function(err, data){

        if (err) {

            
        } else {

   
        }
          
    });

};

////////// RETRIEVE DETAILED QUESTION WITH COMMENTS

getDetailedQuestion = function(artid, id){

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    AWS.config.region = 'us-west-2';

        var params = {
          TableName: 'questions',
          Key: {
              "id": artid          
          }
      };

    dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
    docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

    docClient.get(params, function(err, data){
        if (err) {

            
        } else {

              io.sockets.emit('questionDetail', data.Item);

              listQuestionAnswers(artid);
            
            }

    });

};

listQuestionAnswers = function(artid){

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    var params = {
        TableName: 'comments',
        FilterExpression: "#yr = :start_yr",
        ExpressionAttributeNames: { "#yr": "commentId"},
        ExpressionAttributeValues: { ":start_yr": artid}           
    };

    dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
    docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
   
    docClient.scan(params, function(err, data){
        if (err) {

          
        } else {

            io.sockets.emit('adviceComments', data.Items);
   
            }
          
        });

};

saveQuestionAnswer = function(data){

    console.log('Save question comment triggered');

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

     var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
     var uniqueID = '';
     for (var i = 0; i < 11; i++) {
         var letterSelect = Math.floor(Math.random()*26)+1;
         var numberSelect = Math.floor(Math.random()*100)+1;

         uniqueID = uniqueID+letters[letterSelect]+numberSelect;
     };

     data.uniqueID = uniqueID;
     var dataSend = data;
     
     AWS.config.region = 'us-west-2';

      var params = {

              TableName: 'comments',

              Item: {
                      id: uniqueID,
                      commentCreated: Date.now(),
                      author: data.userId,
                      insight: data.answer,
                      name: data.name,
                      type: 'question answer',
                      commentId: data.artid,
                      userPic: data.profilePicUrl 
              }

        };

      dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
      docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

      docClient.put(params, function(err, data){
          if (err) {

 
          } else {

              sendNotificationComment(dataSend);

              }
            
          });
};

getUser = function(profileid){
 
  var AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.ACCESSKEY;
  AWS.config.secretAccessKey = process.env.SECRETKEY;

  AWS.config.region = 'us-west-2';

        var params = {
            TableName: 'users',
            Key: {
                "userid": profileid          
            }
        };

        dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
        docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

        docClient.get(params, function(err, data){
            if (err) {

                io.sockets.emit('AddUser', 'Please add your details under settings');

            } else {
 
              io.sockets.emit('GetUser', data.Item);

                }
              
            });

};

getFollowers = function(profileid){

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    var params = {
        TableName: 'following',
        FilterExpression: "#yr = :start_yr",
        ExpressionAttributeNames: { "#yr": "advisorId"},
        ExpressionAttributeValues: { ":start_yr": profileid}
    };

    dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
    docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
   
    docClient.scan(params, function(err, data){
        if (err) {
          
        } else {

            io.sockets.emit('pushFollowersEvent', data.Items);

            }
          
        });

};

var setPic = function(data){
    
    var file = data.file;

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    //  Get userid from front side
      var useriduserid = data.userId;

      var url;
        
      // Generate Random Number
       var random = Math.random()*1000000000;

       ///get username from front side
       var uniqueID = data.username+random;

       //Upload to S3
       AWS.config.region = 'us-west-2';
       var bucketName = 'uploadtebogo';
       var bucket = new AWS.S3({

         params: {

              Bucket: bucketName
            }
          });

        if (file) {

            //Object key will be facebook-USERID#/FILE_NAME

            var objKey = 'ProfilePic/' + useriduserid;

            var params = {

                Key: objKey,

                ContentType: file.type,

                Body: file
                
            };

            bucket.putObject(params, function (err, data) {
                if (err) {
 
                } else {
 
                    var arr = objKey.split(" ");
                    var urlsuffix = '';
                    
                    if (arr.length>1) {
                       urlsuffix = arr[0];                            
                       for (i=1; i < arr.length; i++) {
                            urlsuffix += '+' + arr[i];
                            };
                       url = 'https://s3-us-west-2.amazonaws.com/uploadtebogo/'+urlsuffix                                       
                    } else {

                        urlsuffix = objKey;
                        url = 'https://s3-us-west-2.amazonaws.com/uploadtebogo/'+objKey;

                    };
 
                    //Upload to DynamoDB
                   AWS.config.region = 'us-west-2';
                   var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
                       dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
                    docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
                    params = {
                                TableName: 'users',

                                Key: {
                                    "userid": useriduserid,                   
                                },
                                UpdateExpression: 'set profilePicUrl = :bN, imageKey = :d',
                                ExpressionAttributeValues:{':bN': url, ':d': objKey},
                                ReturnValues:"UPDATED_NEW"
                              };

                    docClient.update(params, function(err, data){
                        if (err) {
                        } else {

                        }
                    });                                                   
                }
            });

        } else {

        };
};