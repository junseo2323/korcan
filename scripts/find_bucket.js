
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function run() {
    try {
        const data = await client.send(new ListBucketsCommand({}));
        console.log('Buckets:', data.Buckets.map(b => b.Name).join(', '));
    } catch (err) {
        console.error('Error', err);
    }
}

run();
