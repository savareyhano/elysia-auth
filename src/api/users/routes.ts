import { Elysia } from 'elysia';

const routes = (handler: any, validator: any) =>
  new Elysia().post(
    '/users',
    ({ body, set }) => handler.postUserHandler(body, set),
    {
      body: validator.postUserPayloadSchema,
    }
  );

export default routes;
