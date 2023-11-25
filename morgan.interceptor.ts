import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as morgan from "morgan";
import { Logger } from "@nestjs/common";

@Injectable()
export class MorganInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl: url, ip } = request;
    const userAgent = request.get("Users-agent") || "";

    const stream = {
      write: (message: string) => {
        this.logger.log(message.trim());
      },
    };

    morgan.token("message", () => {
      const status = context.switchToHttp().getResponse().statusCode;
      const contentLength = context
        .switchToHttp()
        .getResponse()
        .get("content-length");
      return `method=${method} url=${url} status=${status} content-length=${contentLength} Users-agent=${userAgent} ip=${ip}`;
    });

    const middleware = morgan(":message", { stream });

    return new Observable((observer) => {
      middleware(request, context.switchToHttp().getResponse(), (err) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(undefined);
          observer.complete();
        }
      });
    }).pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        if (statusCode >= 500) {
          this.logger.error(
            `${method} ${url} ${statusCode} ${userAgent} ${ip}`
          );
        } else if (statusCode >= 400) {
          this.logger.warn(`${method} ${url} ${statusCode} ${userAgent} ${ip}`);
        } else {
          this.logger.log(`${method} ${url} ${statusCode} ${userAgent} ${ip}`);
        }
      })
    );
  }
}
