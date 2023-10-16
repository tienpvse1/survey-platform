import { BadRequestException } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';
import { GraphQLScalarType, StringValueNode } from 'graphql';

function emailValidator(email: unknown) {
  const isValidEmail = isEmail(email);
  if (typeof email !== 'string' || !isValidEmail)
    throw new BadRequestException('invalid email format');
  return email;
}

function uuidValidator(uuid: unknown) {
  const isValidUuidV4 = isUUID(uuid, '4');
  if (typeof uuid !== 'string' || !isValidUuidV4)
    throw new BadRequestException('invalid uuid v4 format');
  return uuid;
}

export const Email = new GraphQLScalarType<string, string>({
  name: 'Email',
  description: 'email',
  serialize: emailValidator,
  parseValue: emailValidator,
  parseLiteral: ({ value }: StringValueNode) => emailValidator(value),
});

export const JSONType = new GraphQLScalarType<unknown, unknown>({
  name: 'JSONType',
  description: 'json',
  serialize: (val) => val,
  parseValue: (val) => val,
});
export const UUID = new GraphQLScalarType<string, string>({
  name: 'UUID',
  description: 'uuid v4 format',
  serialize: uuidValidator,
  parseValue: uuidValidator,
  parseLiteral: ({ value }: StringValueNode) => uuidValidator(value),
});
