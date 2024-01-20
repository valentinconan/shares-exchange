import { SetMetadata } from '@nestjs/common';

export const SkipJwt = (...args: string[]) => SetMetadata('skip-jwt', args);
