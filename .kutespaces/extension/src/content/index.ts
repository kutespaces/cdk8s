import { Store } from "../model/store";
import { mount as mission1Mount } from './mission1';
import { mount as mission2Mount } from './mission2';

export function mountMissions(store: Store) {
  mission1Mount(store);
  mission2Mount(store);
}
