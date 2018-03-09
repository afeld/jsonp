data "aws_cloudformation_stack" "serverless" {
  name = "${var.cloudformation_stack}"
}
