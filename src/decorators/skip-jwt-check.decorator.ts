import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_CHECK = 'skipJwtCheck';
export const SkipJwtCheck = () => SetMetadata(SKIP_JWT_CHECK, true);
