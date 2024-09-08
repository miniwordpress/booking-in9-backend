import { Controller, Get } from '@nestjs/common'
import { HealthCheckService, HttpHealthIndicator,HealthCheck } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.http.pingCheck('nestjs', 'https://nestjs.com'),
    ])
  }
}