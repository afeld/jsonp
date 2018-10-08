data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "main" {
  key_name_prefix = "jsonp"
  public_key      = "${file("${var.public_key_path}")}"
}

resource "aws_security_group" "allow_all" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "template_file" "nginx_config" {
  template = "${file("${path.module}/../nginx/nginx.conf")}"

  vars {
    real_ips_from = "${join("\n  ", formatlist("set_real_ip_from %s;", concat(local.cloudflare_ipv4_cidrs, local.cloudflare_ipv6_cidrs)))}"
    proxy_pass    = "${local.endpoint_url}"
  }
}

locals {
  ssh_user = "ubuntu"
}

resource "aws_instance" "nginx" {
  ami                    = "${data.aws_ami.ubuntu.id}"
  instance_type          = "t2.micro"
  key_name               = "${aws_key_pair.main.key_name}"
  vpc_security_group_ids = ["${aws_security_group.allow_all.id}"]

  connection {
    user = "${local.ssh_user}"
  }

  provisioner "file" {
    content = "${data.template_file.nginx_config.rendered}"

    # default user doesn't have permissions to write to the actual destination
    destination = "/tmp/nginx.conf"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -yq",

      // https://askubuntu.com/a/147079/501568
      "sudo DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\" dist-upgrade",

      // an update needs to be done again for the nginx package to be available...sometimes
      "sudo apt-get update -yq",

      "sudo apt-get install -yq nginx unattended-upgrades",
      "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf",
      "sudo systemctl reload nginx",
    ]
  }

  lifecycle {
    create_before_destroy = true

    // don't recreate when AMI gets updated
    // https://github.com/hashicorp/terraform/issues/1678#issuecomment-336212832
    ignore_changes = ["ami"]
  }
}

# use an Elastic IP so that the instance can be recreated without needing to update DNS
resource "aws_eip" "proxy" {
  instance = "${aws_instance.nginx.id}"
}
