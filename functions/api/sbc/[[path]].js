import { handleApiRequest } from '../../../shared/sbc-api.js';

export async function onRequest(context) {
  return handleApiRequest(context.request, context.env);
}
