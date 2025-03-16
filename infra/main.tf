provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID"
  type        = string
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  default     = ""
}

resource "aws_instance" "backend" {
  ami           = "ami-05b10e08d247fb927"
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
  name        = "backend-security-group"
  description = "Allow inbound traffic for backend"
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

data "aws_s3_bucket" "existing_bucket" {
  bucket = "petersemployeemgmtsystem-s3"
}

resource "aws_s3_bucket" "frontend" {
  count = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
  bucket = "petersemployeemgmtsystem-s3"
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  count = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
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

resource "aws_cloudfront_distribution" "frontend_distribution" {
  count = data.aws_s3_bucket.existing_bucket.id == "" ? 1 : 0
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

resource "aws_route53_zone" "main" {
  name = "petersomond.com"
}

resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.microfinancebank"
  type    = "A"
  alias {
    name                   = "d1cwxgt8mqb5i4.cloudfront.net"
    zone_id                = "E3ANECV25Q3IKZ"
    evaluate_target_health = false
  }
}

/*
The provided Terraform configuration defines the infrastructure setup for an AWS environment. It begins with the AWS provider configuration, specifying the region as "us-east-1" and using access and secret keys stored in variables for authentication. These variables, `aws_access_key_id` and `aws_secret_access_key`, are defined with descriptions and types to ensure they are correctly populated.

Next, the configuration defines an EC2 instance resource named "backend". This instance uses a specific Amazon Machine Image (AMI) and is of type "t2.micro". It is associated with a security group named "backend-security-group" and tagged with the name "BackendInstance". The security group is either created or referenced based on its existence in the specified VPC.

The configuration also includes a data source to check for an existing S3 bucket named "petersemployeemgmtsystem-s3". If the bucket does not exist, a new S3 bucket resource is created. Additionally, a bucket policy is applied to allow public read access to the objects within the bucket.

A CloudFront distribution is defined to serve the content from the S3 bucket. The distribution is configured with various settings, including allowed methods, cache behaviors, and viewer protocol policies. It uses the default CloudFront certificate for HTTPS.

Finally, the configuration sets up a Route 53 hosted zone for the domain "petersomond.com" and creates a DNS record to point to the CloudFront distribution. This ensures that the domain "www.microfinancebank" resolves to the CloudFront distribution, enabling users to access the React app hosted in the S3 bucket through the specified domain.
*/