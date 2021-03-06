const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token} = require('./config.json');
const { measureMemory } = require('vm');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();


	if(commandName == "criarfarm"){
		let category = message.guild.channels.cache.find( cat => cat.id == '832030677645525013');

		if(args.length != 1 && message.mentions.users.size != 1) return;

		let member = message.mentions.users.first();
		
		let name = "";

		
		message.guild.channels.create(message.guild.member(member.id).nickname, "text")
			.then(channel => {
				channel.setParent(category.id);
				channel.send("**Chat de farm do <@!" + member.id + ">\nTodas as informações e prints sobre o farm do mesmo devem ser postadas aqui.**")
			}).catch(console.error);

		message.delete();

		return;

	
	}


	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		//MENSAGEM REPLY DMreturn message.reply('I can\'t execute that command inside DMs!');
		return;
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
		console.log(authorPerms)
	}

	if (command.args && !args.length) {
		let reply = `Você não informou todos os argumentos necessários, ${message.author}!`;

		if (command.usage) {
			reply += `\nO modo correto de uso é: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`espere ${timeLeft.toFixed(1)} segundos antes de usar o comando \`${command.name}\`.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('erro ao executar comando!');
	}
});

client.login(token);