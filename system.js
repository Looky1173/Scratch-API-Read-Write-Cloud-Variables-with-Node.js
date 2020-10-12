/*
This is an example of how to read and write cloud variables in Scratch using Node.js.
You are free to use any of the following code with proper credit to the respective owners.
This Node.js scripts requires the "scratch-api", and the "node-fetch" packages.
*/

var Scratch = require('scratch-api');
const fetch = require('node-fetch');
Scratch.UserSession.create("Scratch_username", "Scratch_password", function (err, user) { //Enter your Scratch account credentials
    user.cloudSession(123456789, function (err, cloud) { //Replace the number with the project id of your desired project
        let code = ["", "", "", "", "", "", "", "", "", "", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", ".", " ", "_"]
        var encoded,
            idx,
            letter_num,
            value
        function decode(encoded) {
            letter_num = 0
            value = ""
            do {
                idx = encoded.charAt(letter_num) + encoded.charAt(letter_num + 1)
                letter_num = letter_num + 2
                if (Number(idx) < 1) { //evaluates it as a number rather than a string
                    break
                }
                value = value + code[Number(idx)]
            } while (Number(idx) >= 1)
            return value
        }
        function encode(val) {
            temp = "" //so it concatenates strings rather than adding numbers
            letter_num = 1
            for (letter_num = 0; letter_num < val.length; letter_num++) {
                temp += code.indexOf(val.charAt(letter_num))
            }
            temp += "00" //otherwise it would evaluate to 0
            return temp
        }
        
        var idle_counter = 0
        //Please note that the "☁" symbol is required in variable names!
        function timeout() {
        
        /*
        This is the code that my "☁ Live Message Counter" project (https://scratch.mit.edu/projects/419697811/) uses. Modify the code below to match your needs.
        Use cloud.get('☁ myVariable, value) to read the value of a cloud variable.
        Use cloud.set('☁ myVariable, value) to write a value to a cloud variable.
        Full documentation avaible here: https://github.com/trumank/scratch-api
        */
        
            setTimeout(function () {
                var cloud_check = cloud.get('☁ checkMessage')
                if (cloud_check > 0){
                    if (cloud_check == 1){
                        cloud.set('☁ checkMessage', 2)
                    } else if (cloud_check == 2){
                        idle_counter++
                        if (idle_counter > 5){
                            cloud.set('☁ checkMessage', 0)
                            idle_counter = 0
                        }
                    } else if (cloud_check == 3){
                        if (cloud.get('☁ message') != 0){
                            var username = decode(cloud.get('☁ message'))
                            fetch('https://api.scratch.mit.edu/users/' + username + '/messages/count')
                            .then(res => res.json())
                            .then(data => {
                                var message = ""
                                if (data.code == null) {
                                    message = encode("success." + data.count)
                                    console.log("SUCCESS - Successfully retrieved the message count (" + data.count + ") for the user " + username + "!")
                                } else {
                                    message = encode("error.user not found")
                                    console.log("ERROR - The user " + username + " could not be found!")
                                }
                                //console.log(data.code)
                                //console.log(data.count)
                                //console.log(message)
                                cloud.set('☁ message', message)
                                cloud.set('☁ checkMessage', 4)
                                idle_counter = 0
                            })
                        }
                    } else {
                        idle_counter++
                        if (idle_counter > 5){
                            cloud.set('☁ checkMessage', 0)
                            idle_counter = 0
                        }
                    }
                }
                timeout();
            }, 2000 ); //Time in milliseconds to check for an update, never go below 10 requests per second (100ms) as the Scratch API might block you.
        }
        timeout() //The timeout loop
    });
});
