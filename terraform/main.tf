terraform {
  required_version = ">= 0.12"
  backend "remote" {
    organization = "jsonp"

    workspaces {
      name = "prod"
    }
  }
}

