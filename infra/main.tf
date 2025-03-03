provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID"
  default     = ""  # Default can be empty if you want to set it via environment variable
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  default     = ""  # Default can be empty if you want to set it via environment variable
}

resource "aws_instance" "backend" {
  ami           = "ami-05b10e08d247fb927"  # Replace with your desired AMI ID
  instance_type = "t2.micro"
  key_name      = "Petersomond"
  security_groups = ["backend-security-group"]
  tags = {
    Name = "BackendInstance"
  }
}
data "aws_security_group" "existing_backend_sg" {
  filter {
    name   = "group-name"
    values = ["backend-security-group"]
  }
  vpc_id = "vpc-0a39ca2f70436f917"
}

resource "aws_security_group" "backend_sg" {
  count = length(data.aws_security_group.existing_backend_sg.ids) == 0 ? 1 : 0

  name        = "backend-security-group"
  description = "Security group for backend servers"
  vpc_id      = "vpc-0a39ca2f70436f917"

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
resource "aws_security_group" "backend_sg" {
  name        = "backend-security-group"
  description = "Allow inbound traffic for backend"
  ingress {
    from_port   = 3000
    to_port     = 3000
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

# Check if S3 Bucket already exists
data "aws_s3_bucket" "existing_bucket" {
  bucket = "petersemployeemgmtsystem-s3"
}

# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  count = length(data.aws_s3_bucket.existing_bucket.id) == 0 ? 1 : 0

  bucket = "petersemployeemgmtsystem-s3"
}

# Example Bucket Policy
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

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

# RDS for Database
resource "aws_db_instance" "default" {
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "petersemployeemgmtsystemdb"
  username             = "Petersomond"
  password             = "MONDAYtwo12"
  publicly_accessible  = true
  skip_final_snapshot  = true
}

# CloudFront Distribution for S3
resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
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

# Route 53 Domain
resource "aws_route53_zone" "main" {
  name = "petersomond.com"
}

resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.microfinancebank"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.frontend_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}