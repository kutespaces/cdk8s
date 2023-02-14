#!/usr/bin/env bash
set -euo pipefail
[[ -n "${TRACE:-}" ]] && set -x
DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

main() {
  echo "update-content start"
  echo "$(date +'%Y-%m-%d %H:%M:%S')    update-content start" >> "$HOME/status"

  echo 'Installing dependencies for Mission 1'
  cd 'Mission 1'
  npm ci
  cd -

  echo 'Installing dependencies for Mission 2'
  cd 'Mission 2'
  npm ci
  cd -

  echo "update-content complete"
  echo "$(date +'%Y-%m-%d %H:%M:%S')    update-content complete" >> "$HOME/status"
}

main "$@"
