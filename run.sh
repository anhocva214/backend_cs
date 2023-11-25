git restore .

git pull origin development

docker stop mb-backend-cs

docker build -t csbackend .

docker rm mb-backend-cs

docker run -d --name mb-backend-cs -p 6868:6868 csbackend