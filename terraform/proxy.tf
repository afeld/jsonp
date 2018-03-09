data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "main" {
  key_name_prefix = "jsonp"
  public_key = "${file("${var.public_key_path}")}"
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
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

data "template_file" "nginx_config" {
  template = "${file("${path.module}/../nginx/nginx.conf")}"

  vars {
    proxy_pass = "${local.endpoint_url}"
  }
}

locals {
  ssh_user = "ubuntu"
}

resource "aws_instance" "nginx" {
  ami = "${data.aws_ami.ubuntu.id}"
  instance_type = "t2.micro"
  key_name = "${aws_key_pair.main.key_name}"
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
      "sudo apt-get update -y",
      "sudo apt-get install -y nginx",
      "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf",
      "sudo systemctl reload nginx"
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}
