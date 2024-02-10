import { Injectable, NestMiddleware } from "@nestjs/common";
import * as csurf from 'csurf'

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    private csrfProtection = csurf({cookie: true})

    use(req: any, res: any, next: (error?: any) => void) {
        return this.csrfProtection(req, res, next);
    }
}