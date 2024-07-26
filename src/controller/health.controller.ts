import { Controller, Get } from '@nestjs/common'
import { HealthCheckService, HttpHealthIndicator, TerminusModule } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) { }

  @Get()
  async check() {
    return this.health.check([
      async () => this.http.pingCheck('nestjs', 'https://nestjs.com'),
    ])
  }
}