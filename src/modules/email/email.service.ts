import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

dotenv.config()

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

@Injectable()
export class EmailService {
  private async generateHTML(templatePath: string, replacements: Record<string, string>): Promise<string> {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(replacements);
  }

  async sendEmail(to: string, subject: string, templatePath: string, text: string, replacements: Record<string, string>) {
    try {
      const html = await this.generateHTML(templatePath, replacements);
      const mailOptions = {
        from: process.env.NO_REPLY,
        to,
        subject,
        text,
        html,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  public async sendGroupRequest(email: string) {
    try {
      const mailOptions = {
        from: process.env.NO_REPLY,
        subject: `Group Request`,
        text: `Accept invitation to be added to a group on tudu.`,
        to: email
      };
      await transporter.sendMail(mailOptions);
      return {success: true, message: true}
    } catch (error) {
      console.log(error);
    }
  }
}
