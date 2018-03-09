data "aws_cloudformation_stack" "serverless" {
  name = "${var.cloudformation_stack}"
}

locals {
  endpoint_url = "${data.aws_cloudformation_stack.serverless.outputs["ServiceEndpoint"]}/"
}
