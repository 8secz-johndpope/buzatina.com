var userUniqKey;
var username;

var userObject = {};

var methods = {};

getCurrent = function(){

    var userUniqKey = '';
    var username = '';

    var data = {
        UserPoolId : 'us-west-2_GQQlNpQpu', // Your user pool id here
        ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv' // Your client id here
    };

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);

    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
               alert(err);
            }

            username = cognitoUser.username;

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : 'us-west-2:f621a9ab-b4f6-454a-8fed-c2a4aa147af4', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-west-2.amazonaws.com/us-west-2_GQQlNpQpu' : session.getIdToken().getJwtToken()
                }
            });

            var useriduserid = '';
            cognitoUser.getUserAttributes(function(err, result) {
                if (err) {
                    return;
                } else{
                    
                    userUniqKey = result[2].Value;
                    userObject = {
                          username: username,
                          userId: userUniqKey
                    };
                    
                    socket.emit('session', userObject);
                }
            }); 

        });          

      };

};

login = function(username, password){
        
        var username = data.username;
        var password = data.password;

        console.log('Login function called');
        
        AWSCognito.config.region = 'us-west-2';

        var authenticationData = {
                Username : username,
                Password : password,
            };

            var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
            var poolData = { UserPoolId : 'us-west-2_GQQlNpQpu',
                ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv'
            };

            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
            var userData = {
                Username : username,
                Pool : userPool
            };

            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    console.log('access token + ' + result.getAccessToken().getJwtToken());
                    window.location.assign("/");
                },

                onFailure: function(err) {
                    console.log(err);
                }

            });
};

var signOut = function(){
       console.log('Sign-Out function called');

            var data = {
                UserPoolId : 'us-west-2_GQQlNpQpu', // Your user pool id here
                ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv' // Your client id here
            };
            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser != null) {
                cognitoUser.getSession(function(err, session) {
                    if (err) {
                       alert(err);
                    }
                    console.log('session validity: ' + session.isValid());
                    console.log(cognitoUser.username);

                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId : 'us-west-2:f621a9ab-b4f6-454a-8fed-c2a4aa147af4', // your identity pool id here
                        Logins : {
                            // Change the key below according to the specific region your user pool is in.
                            'cognito-idp.us-west-2.amazonaws.com/us-west-2_GQQlNpQpu' : session.getIdToken().getJwtToken()
                        }
                    });
 
                   AWS.config.region = 'us-west-2';

                    cognitoUser.signOut();
                    AWS.config.credentials.clearCachedId();

                });

              };
};

passwordChange = function(oldPassword, newPassword){

            var data = {
                UserPoolId : 'us-west-2_GQQlNpQpu', // Your user pool id here
                ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv' // Your client id here
            };

            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);

            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser != null) {
                cognitoUser.getSession(function(err, session) {
                    if (err) {
                       alert(err);
                    }
                    console.log('session validity: ' + session.isValid());
                    console.log(cognitoUser.username);

                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId : 'us-west-2:f621a9ab-b4f6-454a-8fed-c2a4aa147af4', // your identity pool id here
                        Logins : {
                            // Change the key below according to the specific region your user pool is in.
                            'cognito-idp.us-west-2.amazonaws.com/us-west-2_GQQlNpQpu' : session.getIdToken().getJwtToken()
                        }
                    });
                    
                  // Instantiate aws sdk service objects now that the credentials have been updated.
                  // example: var s3 = new AWS.S3();
                                                    //Upload to DynamoDB
                   AWS.config.region = 'us-west-2';

                        cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
                            if (err) {
                                console.log(err);
                                return;

                            }else{

                                console.log('password was changed');

                            };

                        });
  
                });                               

              };

};

methods.passwordChange = passwordChange;

signUp = function(email, password){

         var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
               
         var uniqueID = '';

               for (var i = 0; i < 11; i++) {
                   var letterSelect = Math.floor(Math.random()*26)+1;
                   var numberSelect = Math.floor(Math.random()*100)+1;

                   uniqueID = uniqueID+letters[letterSelect]+numberSelect;
               };

            AWSCognito.config.region = 'us-west-2'; //This is required to derive the endpoint
        
          var poolData = { UserPoolId : 'us-west-2_GQQlNpQpu',
              ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv'
          };

                var attribute = {
                    Name : 'email',
                    Value : email
                };

                var dataPhoneNumber = {
                    Name : 'name',
                    Value : uniqueID
                };

          var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
     
          var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
                var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

                var attributeList = [];

          attributeList.push(attribute);
                attributeList.push(attributePhoneNumber);

          userPool.signUp(email, password, attributeList, null, function(err, result){
              if (err) {

                  console.log('An error occured boss');
              }

              cognitoUser = result.user;
              console.log('user name is ' + cognitoUser.getUsername());
              window.location.assign("/validate");

          });            

    };

    methods.signUp = signUp;

    validateCode = function(email, code){

            AWSCognito.config.region = 'us-west-2'; //This is required to derive the endpoint
    
            var poolData = {
            UserPoolId : 'us-west-2_GQQlNpQpu',
            ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv'
            };

            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
            var userData = {
                Username : email,
                Pool : userPool
            };

            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            cognitoUser.confirmRegistration(code, true, function(err, result) {
                if (err) {

                    console.log('There was an error to validate the code received via email');
                }

                console.log('call result: ' + result);
                window.location.assign("/");

            });              

    };

    methods.validateCode = validateCode;

    forgotPassword = function(userNameForgot){

            var data = {
                UserPoolId : 'us-west-2_GQQlNpQpu', // Your user pool id here
                ClientId : '2fqeeg1m1vno4l5m4jn4n2gnjv' // Your client id here
            };

            AWSCognito.config.region = 'us-west-2';

            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);

            var userData = {
                            Username : userNameForgot,
                            Pool : userPool
                        };

            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

                cognitoUser.forgotPassword({
                        onSuccess: function (result) {
                            console.log('call result: ' + result);
                        },

                        onFailure: function(err){
                            console.log(err);
                        },
                        
                        inputVerificationCode() {
                            var verificationCode = prompt('Please input verification code received on your email ' ,'');
                            var newPassword = prompt('Enter new password ' ,'');
                            cognitoUser.confirmPassword(verificationCode, newPassword, this);
                        }
                    });

    };

    methods.forgotPassword = forgotPassword;

    window.getCurrent = getCurrent;