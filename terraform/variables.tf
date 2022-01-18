variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_domain" {
  default = "afeld.me"
}

variable "cloudflare_subdomain" {
  default = "jsonp"
}

