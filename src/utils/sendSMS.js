const dotenv = require('dotenv');
const { Vonage } = require('@vonage/server-sdk');

module.exports = {
    notifyRelatives
}

async function notifyRelatives(contactNo, content) {
    try {
        const accountSid = 'AC418a4c1185faf2bdbbfbd4234176bcb9';
        const authToken = '1f996bd1c150649b0ef600ff06a887a6';
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                body:content,
                from: '+12526594619',
                to: '+923352288767'
            })
            .then(message => console.log(message.sid))
        console.log(content);
    }

    catch (err) {
        console.log(err);
    }
}
