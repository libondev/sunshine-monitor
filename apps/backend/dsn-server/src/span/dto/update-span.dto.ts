import { PartialType } from '@nestjs/mapped-types'

import { CreateSpanDto } from './create-span.dto'

export class UpdateSpanDto extends PartialType(CreateSpanDto) {}
