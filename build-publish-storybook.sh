#!/bin/bash

# VARS
RELEASE_VERSION=$1 # nextRelease.version set by semantic-release
BUCKET=$2 # S3_BUCKET set in pipeline: storybook.swipejobs.com
MODULE=$3 # REPO_NAME set in pipeline

[ -z "${RELEASE_VERSION}" ] && echo "ERROR: RELEASE_VERSION cannot be Empty - check semantic-release log in pipeline" && exit 1 || echo "RELEASE_VERSION: ${RELEASE_VERSION}"
[ -z "${BUCKET}" ] && echo "ERROR: BUCKET cannot be Empty" && exit 1 || echo "BUCKET: ${BUCKET}"
[ -z "${MODULE}" ] && echo "ERROR: MODULE cannot be Empty" && exit 1 || echo "MODULE: ${MODULE}"

aws s3 cp --recursive storybook-static/ "s3://${BUCKET}/${MODULE}/${RELEASE_VERSION}" &&
aws s3 cp --recursive storybook-static/ "s3://${BUCKET}/${MODULE}/"
