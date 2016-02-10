var expect    = require("chai").expect;
var Facebook = require("../facebook");

describe("Facebook Api", function() {

    var facebook = new Facebook("1707859876137335", "https://www.facebook.com/connect/login_success.html", "bfc74d90801f5ca51febb8c47d4f146b");

    it("getAccessToken", function() {

        var observable = facebook.getAccessToken("code");

        // expect(redHex).to.equal("ff0000");
        // expect(greenHex).to.equal("00ff00");
        // expect(blueHex).to.equal("0000ff");

    });

});
