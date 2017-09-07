# Setup


Clone the repo, enter the directory, clone the sample .env, requires an S3 bucket with an IAM user that has write permissions to the bucket, and the url of your bucket

```
docker build -t povray .

docker run --name stl2image --rm -p 80:80 -d --env-file ./.env povray
```

