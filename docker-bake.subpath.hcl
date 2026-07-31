variable "IMAGE_NAME" {
  default = "ghcr.io/23fo/outline"
}

variable "IMAGE_TAG" {
  default = "latest"
}

variable "GIT_SHA" {
  default = ""
}

target "base" {
  context    = "."
  dockerfile = "Dockerfile.base"
  platforms  = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=gha,scope=outline-subpath-base"]
  cache-to   = ["type=gha,mode=max,scope=outline-subpath-base"]
}

target "image" {
  context    = "."
  dockerfile = "Dockerfile"
  contexts = {
    "outline-base" = "target:base"
  }
  args = {
    BASE_IMAGE = "outline-base"
  }
  platforms = ["linux/amd64", "linux/arm64"]
  tags      = ["${IMAGE_NAME}:${IMAGE_TAG}"]
  labels = {
    "org.opencontainers.image.source"   = "https://github.com/23fo/outline"
    "org.opencontainers.image.version"  = IMAGE_TAG
    "org.opencontainers.image.revision" = GIT_SHA
  }
  output     = ["type=registry"]
  cache-from = ["type=gha,scope=outline-subpath"]
  cache-to   = ["type=gha,mode=max,scope=outline-subpath"]
}
