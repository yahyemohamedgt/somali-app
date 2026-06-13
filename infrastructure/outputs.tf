output "ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "ec2_public_ip" {
  value       = aws_instance.app.public_ip
  description = "Backend API: http://<ip>:8000"
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "s3_bucket" {
  value = aws_s3_bucket.audio.bucket
}
