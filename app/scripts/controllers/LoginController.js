app.controller('LoginController', [ '$rootScope', '$scope', '$location', 'Api', 'SessionManager', function($rootScope, $scope, $location, Api, SessionManager) {

    'use strict';

    $scope.loginWithFacebook = function () {

        if (!$scope.code) {

            showFacebookAuthenticationPopup();

        } else {

            loginInCoworkerServer();

        }

    };

    var loginInCoworkerServer = function () {

        Api.loginWithFacebook($scope.code, function success(user) {

            SessionManager.storeNewSession(user);

            $location.path('/users');

        }, function failure() {



        });

    }

    var showFacebookAuthenticationPopup = function () {

        //http://iamemmanouil.com/blog/electron-oauth-with-github/

        var BrowserWindow = require('electron').remote.BrowserWindow;

        var facebookWindow = new BrowserWindow({ "width": 1000, "height": 670, "show": false, "node-integration": false });

        facebookWindow.loadURL('https://www.facebook.com/dialog/oauth?client_id=1707859876137335&scope=email,public_profile,user_friends&redirect_uri=https://www.facebook.com/connect/login_success.html');
        facebookWindow.show();

        function handleCallback (url) {

            var raw_code = /code=([^&]*)/.exec(url) || null;
            var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                // Close the browser if code found or error
                facebookWindow.destroy();
            }

            // If there is a code, proceed to get token from github
            if (code) {

                $scope.code = code;
                loginInCoworkerServer();

            } else if (error) {
                alert('Oops! Something went wrong and we couldn\'t log you in using Github. Please try again.');
            }

        }

        // Handle the response from GitHub - See Update from 4/12/2015

        facebookWindow.webContents.on('will-navigate', function (event, url) {
            handleCallback(url);
        });

        facebookWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            handleCallback(newUrl);
        });

        facebookWindow.on('close', function() {
            facebookWindow = null;
        }, false);

    };

}]);
