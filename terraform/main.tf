terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

# --- 1. Key Pair ---
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "server-key"       # Configurable
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/../server-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

# --- 2. Security Group ---
resource "aws_security_group" "web_sg" {
  name        = "korcan-web-sg"
  description = "Allow SSH, HTTP, HTTPS inbound traffic"

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
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

# --- 3. AMI (Ubuntu 22.04 LTS) ---
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# --- 4. EC2 Instance ---
resource "aws_instance" "web_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small"
  key_name      = aws_key_pair.kp.key_name

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "KoCan-Nextjs-Server"
  }
}

# --- 5. S3 Bucket for Uploads ---
resource "aws_s3_bucket" "uploads" {
  bucket_prefix = "korcan-uploads-"
  
  tags = {
    Name = "KorCan Uploads"
  }
}

resource "aws_s3_bucket_public_access_block" "uploads_public" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "uploads_policy" {
  bucket = aws_s3_bucket.uploads.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.uploads.arn}/*"
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.uploads_public]
}

output "s3_bucket_name" {
  value = aws_s3_bucket.uploads.bucket
}

# --- 6. RDS Security Group ---
resource "aws_security_group" "rds_sg" {
  name        = "korcan-rds-sg"
  description = "Allow PostgreSQL inbound traffic"

  ingress {
    description = "PostgreSQL from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allowing public access for dev/migration convenience
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 7. Random Password for DB ---
resource "random_password" "db_password" {
  length           = 16
  special          = false # Simpler for connection strings
}

# --- 8. RDS Instance ---
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  db_name              = "korcandb"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t3.micro"
  username             = "postgres"
  password             = random_password.db_password.result
  parameter_group_name = "default.postgres16"
  skip_final_snapshot  = true
  publicly_accessible  = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name = "KorCan-RDS"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}
