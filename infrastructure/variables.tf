variable "app_name" {
  default = "somali-app"
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "somaliapp"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "somaliapp"
}
