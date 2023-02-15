#!/bin/bash

# this runs at Codespace creation - not part of pre-build
node /workspaces/cdk8s/.kutespaces/cli/register.js
node /workspaces/cdk8s/.kutespaces/cli/event.mjs --name space:create

node /workspaces/cdk8s/.kutespaces/cli/event.mjs --name space:create-done
