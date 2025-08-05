import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const pathFinderMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const filePath: string = await next();
  return `http://localhost:3000/${filePath}`;
};
