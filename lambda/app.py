import json
import os
from datetime import datetime
import boto3

def lambda_handler(event, context):
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d_%H-%M-%S")
    s3 = boto3.client("s3")
    bucket = os.environ["S3_BUCKET"]
    obj = json.loads(event["body"])
    key = obj.get("filename", f"{date_time}")
    s3.put_object(
        Body=(bytes(json.dumps(obj["data"]).encode("UTF-8"))), Bucket=bucket, Key=key
    )
    # Generate the presigned URL
    presigned_url = s3.generate_presigned_url(
        "get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=3600
    )
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"url": presigned_url}),
    }
