import { Injectable } from "@nestjs/common";
import { Context, Markup } from 'telegraf'

@Injectable()
export class BotService {
    async onStart(ctx: Context) {
        try {
            ctx.reply('Welcome to my BOT', Markup.keyboard([
                ["Help", "Settings", "Menu"]
            ])
                .resize()
                .oneTime()
            );
        } catch (error) {
            console.log(error)
        }
    }
}