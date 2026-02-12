
const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const REGION = process.env.AWS_DEFAULT_REGION || 'ap-northeast-2';
const client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = 'korcan-uploads-production-' + Math.random().toString(36).substring(2, 8);

async function run() {
    try {
        console.log(`Creating bucket: ${BUCKET_NAME}`);
        await client.send(new CreateBucketCommand({
            Bucket: BUCKET_NAME,
            CreateBucketConfiguration: {
                LocationConstraint: REGION,
            },
        }));
        console.log('Bucket created successfully.');

        // Remove Public Access Block (to allow public policies)
        console.log('Disabling Block Public Access...');
        await client.send(new PutPublicAccessBlockCommand({
            Bucket: BUCKET_NAME,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false,
                RestrictPublicBuckets: false
            }
        }));

        // Add Bucket Policy for public read
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
                }
            ]
        };

        console.log('Setting Bucket Policy...');
        await client.send(new PutBucketPolicyCommand({
            Bucket: BUCKET_NAME,
            Policy: JSON.stringify(policy)
        }));

        // Configure CORS
        console.log('Configuring CORS...');
        await client.send(new PutBucketCorsCommand({
            Bucket: BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedOrigins: ['*'], // For production, restrict to domain later
                        ExposeHeaders: []
                    }
                ]
            }
        }));
        console.log('CORS configured.');

        console.log(`SUCCESS: BUCKET_NAME=${BUCKET_NAME}`);

    } catch (err) {
        console.error('Error', err);
    }
}

run();
