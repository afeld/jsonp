provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}

resource "cloudflare_record" "main" {
  domain = "${var.cloudflare_domain}"
  name   = "${var.cloudflare_subdomain}"
  value  = "${aws_instance.nginx.public_dns}"
  type   = "CNAME"
  proxied = false
}
