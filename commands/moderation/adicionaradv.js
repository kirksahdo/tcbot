const { adv_chat_id, adm_id, adv_group_1, adv_group_2, prefix} = require('./../../config.json');

const Discord = require('discord.js')

module.exports = {
	name: 'adicionaradv',
	description: 'Adicionar advertência a alguém.',
	guildOnly: true,
	execute(message, args) {
		if(!message.member.roles.cache.some(role => role.id == adm_id)) return;
		if(args.length == 0 || message.mentions.users.size != 1){
            //message.reply('modo de uso correto: `' + prefix +  'adicionaradv <@user> <motivo>`');
            return;
        }

        if(args.length <= 1){
            //message.reply('você deve informar o motivo da advertência.');
            return;
        }

        const userPunned = message.mentions.users.first();
        const reason = message.content.slice(prefix.length + this.name.length + args[0].length + 2);
        var qtdAdv = 0;
        const member = message.guild.member(userPunned);
        if( member.roles.cache.some(role => role.name === "<<< 🚫 | 1º Adv >>>")){
            qtdAdv = 1;
            const oldRole = message.guild.roles.cache.find(role => role.name === "<<< 🚫 | 1º Adv >>>")
            const newRole = message.guild.roles.cache.find(role => role.name === "<<< 🚫 | 2º Adv >>>")
            member.roles.remove(oldRole);
            member.roles.add(newRole);
            
        }else if(member.roles.cache.some(role => role.name === "<<< 🚫 | 2º Adv >>>")){
            qtdAdv = 2;
            member.roles.cache.forEach( (role) => {
                member.roles.remove(role);
            })
        }
        else{
            const newRole = message.guild.roles.cache.find(role => role.name === "<<< 🚫 | 1º Adv >>>")
            member.roles.add(newRole);
        }


        qtdAdv++;


        var exampleEmbed;

        if(qtdAdv == 3){
            exampleEmbed = new Discord.MessageEmbed()
            .setColor('#8b008b')
            .setTitle(':no_entry:  Novo banimento registrado :no_entry:')
            .addFields(
                { name: 'Usuário:', value: userPunned },
                { name: 'Advertido por:', value: message.member, inline: true  },
                { name: 'Advertência:', value: qtdAdv + '/3', inline: true },
                { name: 'Motivo', value: reason},
            )
            .setTimestamp()
            .setFooter('Atenciosamente, ' + message.guild.name, message.guild.iconURL());
        }else{
            exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(':no_entry:  Nova advertência registrada  :no_entry:')
            .addFields(
                { name: 'Usuário:', value: userPunned },
                { name: 'Advertido por:', value: message.member, inline: true  },
                { name: 'Advertência:', value: qtdAdv + '/3', inline: true },
                { name: 'Motivo', value: reason},
            )
            .setTimestamp()
            .setFooter('Atenciosamente, ' + message.guild.name, message.guild.iconURL());
        }

        

        const channel = message.guild.channels.cache.find(channel => channel.id == adv_chat_id);
        channel.send(exampleEmbed);
        //message.reply("advertência aplicada com sucesso!");
        message.channel
            message.delete();
	},
};