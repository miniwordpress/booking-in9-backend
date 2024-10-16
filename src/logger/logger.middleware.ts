import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
const KEY_MASKING = ['authorization', 'token', 'password']

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  private getRequestLog(requestId: string, req: Request) {
    const { method, originalUrl } = req
    if (!req.headers['accept-language']) { req.headers['accept-language'] = "th" }
    this.logger.log(`Request path: [${method} ${originalUrl}] Datetime: ${new Date().toLocaleString("en-GB")} [Request] Request ID: ${requestId}`)
    this.logger.log(`Headers: ${JSON.stringify(maskMultipleKeysInComplexObj(req.headers), null, 2)}`)
    this.logger.log(`Body: ${JSON.stringify(maskMultipleKeysInComplexObj(req.body), null, 2)}`)
  }

  private getResponseLog(requestId: string, res: Response) {
    const rawResponse = res.write
    const rawResponseEnd = res.end
    const chunkBuffers = []
    res.write = (...chunks) => {
      const resArgs = []
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i]
        if (!resArgs[i]) {
          res.once('drain', res.write)
          i--
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]))
      }
      return rawResponse.apply(res, resArgs)
    }
    res.end = (...chunk) => {
      const resArgs = []
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i]
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]))
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8')
      let tmpBody = null
      try {
        tmpBody = JSON.parse(body)
      } catch (e) {
        tmpBody = body || {}
      }
      const responseLog = {
        response: {
          headers: res.getHeaders(),
          statusCode: res.statusCode,
          body: tmpBody,
        },
      }
      this.logger.log(`[Response] Datetime: ${new Date().toLocaleString("en-GB")} Status: ${res.statusCode} Request ID: ${requestId}`)
      this.logger.log(`Data: ${JSON.stringify(maskMultipleKeysInComplexObj(tmpBody), null, 2)}`)
      rawResponseEnd.apply(res, resArgs)
      return responseLog as unknown as Response
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4()
    req['requestId'] = requestId
    this.getRequestLog(requestId, req)
    this.getResponseLog(requestId, res)
    if (next) {
      next()
    }
  }
}

function maskMultipleKeysInComplexObj(data: any): any {
  const newData = Array.isArray(data) ? [] : {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        newData[key] = maskMultipleKeysInComplexObj(data[key])
      } else {
        newData[key] = KEY_MASKING.some(item => key.toLowerCase().includes(item)) ? "[x]" : data[key]
      }
    }
  }
  return newData
}