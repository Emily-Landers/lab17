let AWS = require('aws-sdk');
let S3 = new AWS.S3();

exports.handler = async (event) => {
    
    let img = event.Records[0].s3.object;
    let bucketName = event.Records[0].s3.bucket.name;
    let imageName = img.key.split('/')[1].split('.')[0];
    let imageType = img.key.split('.')[1];
    let imageSize = img.size;
    
    console.log(bucketName, imageName, imageType, imageSize);
    
    const params = {
        Bucket: bucketName,
        Key: 'images.json',
    };
    
    try {
        const imageList = await S3.getObject(params).promise();
        console.log('This is the image list: ', imageList);
        let imageListData = JSON.parse(imageList.Body.toString());
        console.log('This is the image list data: ', imageListData);
        imageListData.push({
            name: imageName,
            type: imageType,
            size: imageSize
        });
        
        let imageListBody = JSON.stringify(imageListData);
        const newImageList = await S3.putObject({...params, Body: imageListBody, ContentType: 'application/json'});
        console.log('This is the new image list: ', newImageList);
        } catch(e) {
        console.log(e);
        const newList = {
            Bucket: bucketName,
            Key: 'images.json',
            Body: JSON.stringify([{ name: imageName, size: imageSize, type: imageType }]),
            ContentType: 'application/json',
        };

        console.log('Heres the list', newList);
        const list = await S3.putObject(newList).promise();
        console.log(`JSON file has been created: ${list}`);
    };
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('s3'),
    };
    return response;
};