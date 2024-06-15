const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Upload } = require('@aws-sdk/lib-storage');

/**
 * Generates a signed URL for an S3 object.
 * @param {Object} s3Config - The S3 configuration object.
 * @param {string} bucket - The S3 bucket name.
 * @param {string} key - The S3 object key.
 * @param {number} expiresIn - The URL expiry time in seconds.
 * @returns {string} - The signed URL.
 */
const getObjectURL = async (s3Config, bucket, key, expiresIn) => {
    const s3 = new S3Client(s3Config);
    try {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        const url = await getSignedUrl(s3, command, {
            expiresIn: expiresIn // Configurable expiry time
        });
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Error generating signed URL');
    }
};

/**
 * Uploads a stream to S3.
 * @param {Object} s3Config - The S3 configuration object.
 * @param {string} bucket - The S3 bucket name.
 * @param {string} key - The S3 object key.
 * @param {Stream} stream - The data stream to upload.
 * @param {string} contentType - The MIME type of the content being uploaded.
 * @returns {Promise<void>}
 */
const uploadStreamToS3 = async (s3Config, bucket, key, stream, contentType) => {
    const s3 = new S3Client(s3Config);
    try {
        const parallelUploads3 = new Upload({
            client: s3,
            params: {
                Bucket: bucket,
                Key: key,
                Body: stream,
                ContentType: contentType // Set the ContentType dynamically
            },
            queueSize: 4, // optional concurrency configuration
            partSize: 1024 * 1024 * 5, // optional part size, default is 5MB
            leavePartsOnError: false // optional, default is false
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {
           // console.log(progress);
        });

        await parallelUploads3.done();
        return { success: true };
    } catch (error) {
        console.error('Error uploading stream to S3:', error);
        throw new Error('Error uploading stream to S3');
    }
};


/**
 * Uploads a stream to S3 and generates a signed URL.
 * @param {Object} s3Config - The S3 configuration object.
 * @param {string} bucket - The S3 bucket name.
 * @param {string} key - The S3 object key.
 * @param {Stream} stream - The data stream to upload.
 * @param {number} expiresIn - The URL expiry time in seconds.
 * @returns {Object} - Object containing success status and signed URL.
 */
const getURLAfterUploadToS3 = async (s3Config, bucket, key, stream, expiresIn, contentType) => {
    try {
        await uploadStreamToS3(s3Config, bucket, key, stream, contentType);
        const signedURL = await getObjectURL(s3Config, bucket, key, expiresIn);
        return { success: true, signedURL };
    } catch (error) {
        console.error('Error in getURLAfterUploadToS3:', error);
        throw error;
    }
};

module.exports = { uploadStreamToS3, getObjectURL, getURLAfterUploadToS3 };
