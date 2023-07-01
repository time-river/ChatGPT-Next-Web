#!/bin/bash

# client-only exporting script

export BUILD_MODE="export"
export BUILD_APP=false
#export BASE_URL=
#export DEFAULT_API_HOST="/api/openai/"

yarn export
