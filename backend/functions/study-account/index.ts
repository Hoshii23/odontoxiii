import { createHandler } from '../shared/handler.mjs';
Deno.serve(createHandler({env: (key: string) => Deno.env.get(key), kind: 'account'}));
