module.exports = {
	name: 'limpar',
	description: 'Limpar até 99 mensagens de um canal.',
    permissions: 'ADMINISTRATOR',
	execute(message, args) {

		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('esse não parece ser um valor válido.');
		} else if (amount <= 1 || amount > 100) {
			return message.reply('você deve informar um valor entre 1 e 99.');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('parece que ocorreu um erro ao limpar o chat!');
		});
	},
};