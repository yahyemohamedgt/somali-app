#!/bin/bash
# Build and push the FastAPI backend to ECR.
# Run from the infrastructure/ directory after `terraform apply`.
set -euo pipefail

REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REPO_URL=$(terraform output -raw ecr_repository_url)

echo "Building image..."
docker build --platform linux/amd64 -t somali-app-backend ../backend

echo "Logging into ECR..."
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo "Pushing to $REPO_URL..."
docker tag somali-app-backend:latest "$REPO_URL:latest"
docker push "$REPO_URL:latest"

echo "Done. EC2 will pull and start the container automatically."
echo "Backend will be live at: http://$(terraform output -raw ec2_public_ip):8000"
