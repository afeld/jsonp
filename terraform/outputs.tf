output "instance_dns" {
  value = "${aws_instance.nginx.public_dns}"
}
