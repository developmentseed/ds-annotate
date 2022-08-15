import boto3


def lambda_handler(event, context):
    result = "Sucesso"
    return {"statusCode": 200, "body": result}
