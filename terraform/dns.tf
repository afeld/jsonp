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
