# Lambda function 
This is a Terramore template to create a lambda function, the lambda function goal is to save the draws into s3 bucket and make available through presigned URL in order to load in JOSM the geojson files.


### Execute

```sh
cd lambda/
terraform init
terraform plan
terraform apply
# terraform destroy
```

The output will be the API-Getway url
