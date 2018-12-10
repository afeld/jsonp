output "public_url" {
  value = "https://${cloudflare_record.main.hostname}"
}
