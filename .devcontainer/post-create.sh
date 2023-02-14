#!/bin/bash

# this runs at Codespace creation - not part of pre-build
node /workspaces/k8s-lab-cdk8s/.kutespaces/cli/register.js
node /workspaces/k8s-lab-cdk8s/.kutespaces/cli/event.mjs --name space:create

node /workspaces/k8s-lab-cdk8s/.kutespaces/cli/event.mjs --name space:create-done
