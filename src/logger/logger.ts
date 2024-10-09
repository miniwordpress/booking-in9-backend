import { LoggerService } from '@nestjs/common'

export class Logger implements LoggerService {
  log(message: string) {
    this.writeToFile('[Info] ' + message)
  }

  error(message: string, trace: string) {
    this.writeToFile('[Error] ' + message)
    this.writeToFile('[Error] Stack Trace: ' + trace)
  }

  warn(message: string) {
    this.writeToFile('[Warning] ' + message)
  }

  debug(message: string) {
    this.writeToFile('[Debug] ' + message)
  }

  private writeToFile(message: string) {
    // Implement the logic to write logs to a file here.
    console.log(message) // For demonstration purposes, we'll just log to the console.
  }
}