variable "public_key_path" {
  default = "~/.ssh/id_rsa.pub"
}

variable "proxy_pass" {
  type = "string"
  description = "The URL of the Lambda function"
}
