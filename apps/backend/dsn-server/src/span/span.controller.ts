import { Body, Controller, Ip, Param, Post } from '@nestjs/common'

import { TrackingParams } from './dto'
import { SpanService } from './span.service'

@Controller('span')
export class SpanController {
  constructor(private readonly spanService: SpanService) {}

  @Post('tracking/:app_id')
  tracking(@Param('app_id') appId: string, @Body() params: TrackingParams, @Ip() clientIp: string) {
    return this.spanService.tracking(appId, params, clientIp)
  }
}
