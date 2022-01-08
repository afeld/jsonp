terraform {
  required_version = ">= 0.13, < 1.0"

  backend "remote" {
    organization = "jsonp"

    workspaces {
      name = "prod"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

