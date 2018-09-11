provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}

resource "cloudflare_record" "main" {
  domain = "${var.cloudflare_domain}"
  name   = "${var.cloudflare_subdomain}"
  value  = "${aws_eip.proxy.public_ip}"
  type   = "A"
  proxied = true
}

# https://github.com/terraform-providers/terraform-provider-cloudflare/issues/6#issuecomment-313375481
data "http" "cloudflare_ipv4" {
  url = "https://www.cloudflare.com/ips-v4"
}
data "http" "cloudflare_ipv6" {
  url = "https://www.cloudflare.com/ips-v6"
}
locals {
  cloudflare_ipv4_cidrs = ["${split("\n",trimspace(data.http.cloudflare_ipv4.body))}"]
  cloudflare_ipv6_cidrs = ["${split("\n",trimspace(data.http.cloudflare_ipv6.body))}"]
}

resource "cloudflare_rate_limit" "ip" {
  zone = "${var.cloudflare_domain}"
  # https://support.cloudflare.com/hc/en-us/articles/235240767-Cloudflare-Rate-Limiting#components
  threshold = 20
  period = 60
  match {
    request {
      url_pattern = "${var.cloudflare_subdomain}.${var.cloudflare_domain}/*"
    }
  }
  action {
    mode = "ban"
    timeout = "${60 * 60}"
  }
}
