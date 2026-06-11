import { handleApiRequest } from '../../../shared/sbc-api.js';

export default {
  async fetch(request, env) {
    return handleApiRequest(request, env);
  },
};
