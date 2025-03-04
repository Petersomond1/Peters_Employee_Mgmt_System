provider "aws" {
  region = "us-east-1"
}

variable "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  default     = ""
}

# Fetch default VPC dynamically
data "aws_vpc" "default" {
  default = true
}

# Check for existing security group
data "aws_security_group" "existing_backend_sg" {
  filter {
    name   = "group-name"
    values = ["backend-security-group"]
  }
  vpc_id = data.aws_vpc.default.id
}

# Create security group only if it doesn’t exist
resource "aws_security_group" "backend_sg" {
  count       = length(data.aws_security_group.existing_backend_sg.id) == 0 ? 1 : 0
  name        = "backend-security-group"
  description = "Security group for backend servers"
  vpc_id      = data.aws_vpc.default.id

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

# Backend EC2 instance
resource "aws_instance" "backend" {
  ami           = "ami-05b10e08d247fb927"
  instance_type = "t2.micro"
  key_name      = "Petersomond"
  security_groups = ["backend-security-group"]

  tags = {
    Name = "BackendInstance"
  }
}

# Check if the S3 bucket exists
data "aws_s3_bucket" "existing_bucket" {
  bucket = "petersemployeemgmtsystem-s3"
}

# Create the S3 bucket only if it doesn't exist
resource "aws_s3_bucket" "frontend" {
  count  = length(data.aws_s3_bucket.existing_bucket.id) == 0 ? 1 : 0
  bucket = "petersemployeemgmtsystem-s3"
}

# Bucket policy for public read access
resource "aws_s3_bucket_policy" "frontend_policy" {
  count  = length(data.aws_s3_bucket.existing_bucket.id) == 0 ? 1 : 0
  bucket = aws_s3_bucket.frontend[0].id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = "s3:GetObject",
        Resource = "arn:aws:s3:::petersemployeemgmtsystem-s3/*"
      }
    ]
  })
}

# CloudFront Distribution for frontend
resource "aws_cloudfront_distribution" "frontend_distribution" {
  count = length(data.aws_s3_bucket.existing_bucket.id) == 0 ? 1 : 0

  origin {
    domain_name = aws_s3_bucket.frontend[0].bucket_regional_domain_name
    origin_id   = "S3-petersemployeemgmtsystem-s3"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for my React app"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-petersemployeemgmtsystem-s3"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Route53 domain setup
resource "aws_route53_zone" "main" {
  name = "petersomond.com"
}

# Route53 record pointing to CloudFront
resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.petersomond.com" # Updated from "www.microfinancebank"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend_distribution[0].domain_name
    zone_id                = aws_cloudfront_distribution.frontend_distribution[0].hosted_zone_id
    evaluate_target_health = false
  }
}
