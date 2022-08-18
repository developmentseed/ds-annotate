import boto3
from datetime import datetime
import os
import json


def lambda_handler(event, context):
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d_%H-%M-%S")
    s3 = boto3.resource("s3")
    bucket = os.environ["S3_BUCKET"]
    key = f"ds-annotate/geojson/{date_time}.geojson"
    s3object = s3.Object(bucket, key)
    s3object.put(Body=(bytes(event["body"].encode("UTF-8"))), ACL="public-read")
    url = f"https://{bucket}.s3.amazonaws.com/{key}"
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"url": url}),
    }
