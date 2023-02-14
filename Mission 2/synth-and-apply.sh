#!/usr/bin/env bash
set -euo pipefail
[[ -n "${TRACE:-}" ]] && set -x
DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

main() {
  npm run synth
  kubectl apply --namespace podinfo --all --prune -f "$DIR"/dist/podinfo.k8s.yaml
}

main "$@"
