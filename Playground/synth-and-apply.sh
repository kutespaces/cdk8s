#!/usr/bin/env bash
set -euo pipefail
[[ -n "${TRACE:-}" ]] && set -x
DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

main() {
  npm run synth
  kubectl apply --namespace playground --all --prune -f "$DIR"/dist/playground.k8s.yaml
}

main "$@"
