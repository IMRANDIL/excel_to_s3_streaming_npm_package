## AWS S3 Stream Uploader

### Overview
This package provides a convenient way to upload data streams, such as files, to Amazon S3 (Simple Storage Service) and generate signed URLs for accessing the uploaded content. It's particularly useful for scenarios where you need to upload large files or streams to S3 and share them securely with others.

### Installation
You can install this package via npm:

```bash
npm install @imrandil/aws-s3-stream-uploader
```

### Usage
To use this package, follow these simple steps:

1. **Import the package**:
```javascript
const { uploadStreamToS3, getObjectURL, getURLAfterUploadToS3 } = require('@imrandil/aws-s3-stream-uploader');
```

2. **Configure your AWS S3 credentials**:
```javascript
const s3Config = {
    region: 'your-region',
    credentials: {
        accessKeyId: 'your-access-key-id',
        secretAccessKey: 'your-secret-access-key'
    }
};
```

3. **Upload a stream to S3**:
```javascript
const stream = /* Your data stream */;
const bucket = 'your-bucket-name';
const key = 'your-file-key';
const expiresIn = 900; // Expiry time in seconds
const contentType = 'application/pdf'; // Set the content type dynamically
try {
    await uploadStreamToS3(s3Config, bucket, key, stream, contentType);
    console.log('Stream uploaded successfully');
} catch (error) {
    console.error('Error uploading stream to S3:', error);
}
```

4. **Generate a signed URL for the uploaded content**:
```javascript
const signedURL = await getObjectURL(s3Config, bucket, key, expiresIn);
console.log('Signed URL:', signedURL);
```

5. **Or, combine both steps to get the signed URL after uploading**:
```javascript
try {
    const contentType = 'application/pdf'; // Set the content type dynamically
    const { success, signedURL } = await getURLAfterUploadToS3(s3Config, bucket, key, stream, expiresIn, contentType);
    console.log('Signed URL:', signedURL);
} catch (error) {
    console.error('Error in getURLAfterUploadToS3:', error);
}
```

### API Reference
#### `uploadStreamToS3(s3Config, bucket, key, stream, contentType)`
Uploads a stream to the specified S3 bucket.

- `s3Config`: The S3 configuration object containing region and credentials.
- `bucket`: The name of the S3 bucket.
- `key`: The key (path) under which to store the data in the bucket.
- `stream`: The data stream to upload.
- `contentType`: The MIME type of the content being uploaded.

#### `getObjectURL(s3Config, bucket, key, expiresIn)`
Generates a signed URL for accessing the specified object in the S3 bucket.

- `s3Config`: The S3 configuration object containing region and credentials.
- `bucket`: The name of the S3 bucket.
- `key`: The key (path) of the object in the bucket.
- `expiresIn`: The expiry time for the signed URL in seconds.

#### `getURLAfterUploadToS3(s3Config, bucket, key, stream, expiresIn, contentType)`
Uploads a stream to S3 and generates a signed URL for accessing the uploaded content.

- `s3Config`: The S3 configuration object containing region and credentials.
- `bucket`: The name of the S3 bucket.
- `key`: The key (path) under which to store the data in the bucket.
- `stream`: The data stream to upload.
- `expiresIn`: The expiry time for the signed URL in seconds.
- `contentType`: The MIME type of the content being uploaded.

### Notes
- This package leverages the official AWS SDK for JavaScript to interact with S3.
- Ensure that your AWS credentials have sufficient permissions to perform the necessary operations on S3.

### Feedback
If you have any feedback or suggestions for improvements, feel free to open an issue on the GitHub repository. Your input is highly appreciated!

### License
This package is licensed under the MIT License. See the [LICENSE](https://github.com/example/example/blob/main/LICENSE) file for details.
