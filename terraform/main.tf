terraform {
  backend "remote" {
    organization = "jsonp"

    workspaces {
      name = "prod"
    }
  }
}
