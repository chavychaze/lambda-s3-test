'use strict';

const { db } = require('./db-connection');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports.readFile = text => {
  return getS3Object(process.env.BUCKET, process.env.OBJECTKEY)
    .then(data => readFile(data.Body, text))
    .then(
      db.query(
        `INSERT INTO ${process.env.TABLE} (Address, City, State, Zip)
            VALUES (${data.Bodyaddress}, ${data.Body.city}, ${data.Body.state}, ${data.Body.zip}) 
            ON DUBLICATE KEY UPDATE 
            Address = ${data.Body.address}, City = ${data.Body.city}, State = ${data.Body.state}, Zip = ${data.Body.zip}`,
      ),
    )
    .catch(err => {
      throw new Error(err);
    });
};

function getS3Object(bucket, key) {
  return S3.getObject({
    Bucket: bucket,
    Key: key,
    ResponseContentType: 'text/plain',
  })
    .promise() // exec()
    .then(file => {
      return file;
    })
    .catch(error => {
      // File not found
      throw new Error(error);
    });
}

function readFile(data, text) {
  if (data === undefined) {
    return text;
  }
  return data.toString('ascii') + '\n' + text;
}
