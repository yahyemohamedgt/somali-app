resource "aws_iam_role" "ec2" {
  name = "${var.app_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.app_name}-ec2-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  key_name               = var.key_name
  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user

    aws ecr get-login-password --region us-east-1 | \
      docker login --username AWS --password-stdin ${aws_ecr_repository.backend.repository_url}

    # Retry until image is pushed
    for i in $(seq 1 30); do
      docker pull ${aws_ecr_repository.backend.repository_url}:latest && break
      echo "Attempt $i: image not ready, retrying in 10s..."
      sleep 10
    done

    docker run -d \
      --name backend \
      --restart always \
      -p 8000:8000 \
      -e DATABASE_URL="postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:5432/${var.db_name}" \
      ${aws_ecr_repository.backend.repository_url}:latest

    # Wait for container to be ready then seed the database
    until docker exec backend python -c "import psycopg2" 2>/dev/null; do sleep 2; done
    docker exec backend python seed.py
  EOF

  tags = {
    Name = "${var.app_name}-ec2"
  }
}
