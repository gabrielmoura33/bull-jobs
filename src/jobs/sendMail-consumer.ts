import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/create-user/create-user-dto';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}
  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Equipe Code/Drops <codedrops@codedrops.com.br>',
      subject: 'Seja bem vindo(a)',
      text: `Olá ${data.name}, seu cadastro foi realizado com scesso. Seja bem vindo(a)!`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(`On active ${job.name}`);
  }
}

export { SendMailConsumer };
