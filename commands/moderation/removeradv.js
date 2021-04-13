const { adv_chat_id, adm_id, adv_group_1, adv_group_2, prefix} = require('./../../config.json');

const Discord = require('discord.js')

module.exports = {
	name: 'removeradv',
	description: 'Remover a(s) advertência(s) de alguém.',
	guildOnly: true,
	execute(message, args) {
        if(!message.member.roles.cache.some(role => role.id == adm_id)) return;
		if(args.length == 0 || message.mentions.users.size != 1){
            //message.reply('modo de uso correto: `' + prefix +  'removeradv <@user> <motivo>`');
            return;
        }
        
        if(args.length <= 1){
            //message.reply('você deve informar o motivo da remoção da(s) advertência(s).');
            return;
        }

        const userPunned = message.mentions.users.first();
        const reason = message.content.slice(prefix.length + this.name.length + args[0].length + 2);
        const member = message.guild.member(userPunned);
        var qtdAdv;
        if( member.roles.cache.some(role => role.name === "<<< 🚫 | 1º Adv >>>")){
            qtdAdv = 1;
            const oldRole = message.guild.roles.cache.find(role => role.name === "<<< 🚫 | 1º Adv >>>");
            member.roles.remove(oldRole);
            
        }else if(member.roles.cache.some(role => role.name === "<<< 🚫 | 2º Adv >>>")){
            qtdAdv = 2;
            const oldRole = message.guild.roles.cache.find(role => role.name === "<<< 🚫 | 2º Adv >>>");
            member.roles.remove(oldRole);
        }
        else{
            message.reply('este usuário não possui advertências!');
            return;
        }

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(':no_entry:  Advertências Removidas  :no_entry:')
            .addFields(
                { name: 'Usuário:', value: userPunned },
                { name: 'Removidas por:', value: message.member, inline: true  },
                { name: 'Advertências:', value: qtdAdv, inline: true},
                { name: 'Motivo', value: reason},
            )
            .setTimestamp()
            .setFooter('Atenciosamente, ' + message.guild.name, message.guild.iconURL());

        const channel = message.guild.channels.cache.find(channel => channel.id == adv_chat_id);
        channel.send(exampleEmbed);
        message.reply("advertência(s) removida(s) com sucesso!");
        message.channel
            message.delete();
	},
};