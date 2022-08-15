
output "ds_annotate_lambda" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.ds_annotate_lambda.function_name
}
output "base_url" {
  description = "Base URL for API Gateway stage."
  value = aws_apigatewayv2_stage.lambda.invoke_url
}