import { Injectable } from '@nestjs/common';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotService } from './bot.service';

@Update()
@Injectable()
export class BotUpdate {
    private readonly adminId = 6751897146;

    constructor(private readonly botService: BotService) { }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply('Welcome to my BOT!\nSend a math expression like 2+2');
    }

    @On('text')
    async onText(@Ctx() ctx: Context) {
        if (!ctx.message || !('text' in ctx.message) || !ctx.from) return;

        const text = ctx.message.text.trim();
        const userId = ctx.from.id;

        // Калькулятор
        if (/^[\d\s\+\-\*\/\.\(\)]+$/.test(text)) {
            try {
                const cleanExpr = text.replace(/\s+/g, '');
                const result = Function(`"use strict"; return (${cleanExpr})`)();
                await ctx.reply(`Result: ${result}`);
            } catch {
                await ctx.reply('❌ Error while calculating expression.');
            }
        }

        // Отправка админу
        if (userId === this.adminId) {
            await ctx.telegram.sendMessage(
                this.adminId,
                `${ctx.from.first_name}-dan kelgan xabar:\n${text}`
            );
        }
    }

    @On('photo')
    async onPhoto(@Ctx() ctx: Context) {
        if (!ctx.from || !ctx.message || !('photo' in ctx.message)) return;

        const userId = ctx.from.id;
        const photos = (ctx.message as Message.PhotoMessage).photo;

        if (userId === this.adminId && photos?.length) {
            const largestPhoto = photos.at(-1);
            if (!largestPhoto) return;

            await ctx.telegram.sendPhoto(this.adminId, largestPhoto.file_id, {
                caption: `${ctx.from.first_name}-dan kelgan photo`,
            });
        }
    }
}
