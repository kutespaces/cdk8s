import { AppsV1Api, CoreV1Api, NetworkingV1Api, KubeConfig } from '@kubernetes/client-node';

export function kubeconfig(): KubeConfig {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  return kc;
}

export function coreV1Api(): CoreV1Api {
  const kc = kubeconfig();
  return kc.makeApiClient(CoreV1Api);
}

export function appsV1Api(): AppsV1Api {
  const kc = kubeconfig();
  return kc.makeApiClient(AppsV1Api);
}

export function networkingV1Api(): NetworkingV1Api {
  const kc = kubeconfig();
  return kc.makeApiClient(NetworkingV1Api);
}
