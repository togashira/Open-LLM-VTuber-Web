#!/bin/bash

# Usage: ./deploy-s3.sh <s3-bucket-name> <cloudfront-distribution-id>

S3_BUCKET=$1
CLOUDFRONT_DIST_ID=$2

if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DIST_ID" ]; then
  echo "Usage: $0 <s3-bucket-name> <cloudfront-distribution-id>"
  exit 1
fi

echo "Syncing dist/web to s3://$S3_BUCKET ..."
aws s3 sync dist/web s3://$S3_BUCKET --delete

echo "Creating CloudFront invalidation for distribution $CLOUDFRONT_DIST_ID ..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"

echo "Deployment complete."
