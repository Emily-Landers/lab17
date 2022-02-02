let AWS = require('aws-sdk');

let S3 = new AWS.S3();

exports.handler = async (event) => {
    console.log(event.Records[0].s3.object);
    let manifest = await S3.getObject({ Bucket: 'jk-test-images', Key: 'images.json' }).promise();
    
    console.log(manifest);
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify({message: 'testing s3 put'}),
    };
    return response;
};