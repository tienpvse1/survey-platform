import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Request } from 'express';
import { sql } from 'kysely';
import { User } from 'kysely-codegen';
import { env } from 'process';
import { InjectRepository, Repository } from '../database/database.module';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository() private readonly repository: Repository,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    await this.compare(password, user.password);
    const accessToken = await this.signToken(user);
    const refreshToken = await this.signToken(
      user,
      env.REFRESH_TOKEN_EXPIRATION
    );
    return { accessToken, refreshToken, user };
  }

  async findUserById(id: string) {
    const [user, err] = await this.repository
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
      .try();
    if (err) throw new NotFoundException(`user with id ${id} not found`);
    return user;
  }

  async refreshToken(refreshToken: string) {
    const decodedPayload = await this.verifyToken(refreshToken);
    const newAccessToken = await this.signToken(decodedPayload);
    return { accessToken: newAccessToken };
  }

  async register(input: RegisterInput) {
    const { customData, ...registerInput } = input;
    registerInput.password = await this.hashPassword(registerInput.password);
    const [user, error] = await this.repository
      .insertInto('user')
      .values({ ...registerInput, customData: sql`${customData}::jsonb` })
      .returningAll()
      .executeTakeFirst()
      .try();
    if (error) throw new BadRequestException('cannot register');
    delete user.password;
    return user;
  }

  async signToken(
    payload: Awaited<ReturnType<typeof this.findUserByEmail>> | User,
    expiresIn = env.ACCESS_TOKEN_EXPIRATION
  ) {
    delete payload.password;
    const [token, error] = await this.jwt
      .signAsync(payload, { expiresIn })
      .try();
    if (error) throw new InternalServerErrorException(error.message);
    return token;
  }

  private async verifyToken(token: string): Promise<Request['user']> {
    const [decodedPayload, error] = await this.jwt.verifyAsync(token).try();
    if (error)
      throw new InternalServerErrorException(
        `cannot verify token, message: \n ${error.message}`
      );
    return decodedPayload;
  }

  private async findUserByEmail(email: string) {
    const [user, error] = await this.repository
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow()
      .try();
    if (error)
      throw new NotFoundException(`user with email ${email} not found`);
    return user;
  }

  private async compare(password: string, hash: string) {
    const isValid = await compare(password, hash);
    if (!isValid) throw new UnauthorizedException();
  }

  private async hashPassword(password: string) {
    const [hashedPassword, err] = await hash(password, 10).try();
    if (err) throw new InternalServerErrorException('cannot hash the password');
    return hashedPassword;
  }
}
