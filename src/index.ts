import app from './app';
import { modulesInit } from './modules/modules.init';

(async () => {
  new app();
  await modulesInit();
})();
