provider "cloudflare" {
  account_id = var.cloudflare_account_id
  api_token  = var.cloudflare_token
}

data "cloudflare_zone" "main" {
  name = var.cloudflare_domain
}

resource "cloudflare_record" "main" {
  zone_id = data.cloudflare_zone.main.zone_id
  name    = var.cloudflare_subdomain
  proxied = true

  // this is an arbitrary value, since all requests will be captured by the worker anyway
  value = "52.15.126.6"
  type  = "A"
}

locals {
  url_pattern = "${var.cloudflare_subdomain}.${var.cloudflare_domain}/*"
}

resource "cloudflare_rate_limit" "main" {
  zone_id = data.cloudflare_zone.main.zone_id

  # https://support.cloudflare.com/hc/en-us/articles/115001635128#4gd3s4xzV2xOE4CUbRIEAo
  threshold = 30
  period    = 60

  match {
    request {
      url_pattern = local.url_pattern
    }
  }

  action {
    # https://support.cloudflare.com/hc/en-us/articles/115001635128#4gd3s4xzV2xOE4CUbRIEAo
    mode    = "ban"
    timeout = 60
  }
}
