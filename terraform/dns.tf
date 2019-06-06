provider "cloudflare" {
  version = "~> 1.15"

  email = var.cloudflare_email
  token = var.cloudflare_token
}

resource "cloudflare_record" "main" {
  domain  = var.cloudflare_domain
  name    = var.cloudflare_subdomain
  proxied = true

  // this is an arbitrary value, since all requests will be captured by the worker anyway
  value = "52.15.126.6"
  type  = "A"
}

resource "cloudflare_worker_script" "jsonp" {
  zone    = var.cloudflare_domain
  content = file("../dist/main.js")
}

locals {
  url_pattern = "${var.cloudflare_subdomain}.${var.cloudflare_domain}/*"
}

resource "cloudflare_worker_route" "jsonp" {
  zone    = var.cloudflare_domain
  pattern = local.url_pattern
  enabled = true

  depends_on = [cloudflare_worker_script.jsonp]
}

