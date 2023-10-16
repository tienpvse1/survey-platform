import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User as UserEntity } from 'kysely-codegen';

export const User = createParamDecorator(
  (key: keyof UserEntity, context: ExecutionContext) => {
    const request: Request = getGraphqlContext(context).req;

    const { user } = request;
    return key ? user[key] : user;
  }
);

function getGraphqlContext(context: ExecutionContext) {
  return GqlExecutionContext.create(context).getContext();
}
