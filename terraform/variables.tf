variable "cloudformation_stack" {
  default = "jsonp-prod"
  description = "Should match `<service>-<stage>` in serverless.yml"
}

variable "public_key_path" {
  default = "~/.ssh/id_rsa.pub"
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
