var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chatSchema = new Schema({
	users: [{
		user_id:        { type: String },
		counter:        { type: Number, default: 0 },
		status_read:    { type: Boolean, default: true }, // Defecto leido para renderear como blanco, sin leer
		status_connect: { type: Boolean }
	}],
	ultime_mesage: { // si el ultimo mensaje es mio, enteceder la palabra Tu:
		user_id:     { type: String },  // Validar efecto de pertenencia de mensaje
		message:     { type: String },
		date_send:   { type: String } 
	},
	chat_content_id: { type: String }
})

var chatRoom = mongoose.model('chatRoom', chatSchema)

module.exports = chatRoom
