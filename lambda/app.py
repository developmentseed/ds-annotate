import boto3
from datetime import datetime
import os

def lambda_handler(event, context):
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d_%H-%M-%S")
    s3 = boto3.resource("s3")
    bucket = os.environ['S3_BUCKET']
    key = f"geojson/{date_time}.json"
    s3object = s3.Object(bucket, key)
    s3object.put(Body=(bytes(event["body"].encode("UTF-8"))))
    url = boto3.client("s3").generate_presigned_url(
        ClientMethod="get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=60
    )
    return {"statusCode": 200, "body": url}
