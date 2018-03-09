variable "public_key_path" {
  default = "~/.ssh/id_rsa.pub"
}

variable "proxy_pass" {
  type = "string"
  description = "The URL of the Lambda function"
}

variable "cloudflare_email" {
  type = "string"
}

variable "cloudflare_token" {
  type = "string"
}

variable "cloudflare_domain" {
  default = "afeld.me"
}

variable "cloudflare_subdomain" {
  default = "jsonp"
}
