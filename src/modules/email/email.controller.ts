import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Get('group-request') 
        async sendGroupRequest() {
            return await this.emailService.sendGroupRequest('onahkingsleyijuo@gmail.com');
        }
    
}
