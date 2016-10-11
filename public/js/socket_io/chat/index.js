
var socket = io('/chat-io')
var file_data 

$('#published_publish_multimedia_to_chat').change(function(e) {
	// SI se sube archivo, deshabiltar el boton de publicar, hasta terminada la subida
	console.log('Evento uploar file activado')
	var file = e.target.files[0]
	console.log('datos del archivo')

	console.log(file)
    
	var stream = ss.createStream()
 	
    // upload a file to the server. 
	ss(socket).emit('up_file_to_chat', stream, { name: file.name, size: file.size, type: file.type, date: file.lastModified })
    //ss(socket).emit('up_file', stream)
	//ss.createBlobReadStream(file).pipe(stream)

	var blobStream = ss.createBlobReadStream(file)
	var size = 0
	var progress_bar = document.createElement('strong')
	
	// progreso de carga en la subida el archivo
	blobStream.on('data', function(chunk) {
	  size += chunk.length

	  var charge = Math.floor(size / file.size * 100)
	 
	  console.log(charge + '%')

	  progress_bar.innerHTML = charge + '%'
	  $('#preview_box_to_chat').html(progress_bar)

	  // -> e.g. '42%' 
	  if(Math.floor(size / file.size * 100) === 100) {
	  	console.log('Carga COmpleta')
	    // Habilitar el boton de publicar
		console.log('Ubicacion del archivo')
		var new_path = '../../../../../news/' + file.name

	  	// Obteniendo datos del archivo subido
	  	file_data = file

	  	if(file_data.type === 'image/png' ||
	  	   file_data.type === 'image/jpeg' ||
	  	   file_data.type === 'image/gif') {
	  		// El archivo subido es image/png o image/jpg o image/gif

		  	// Pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
	  		var preview_file = document.createElement('img')
	  		var tag_type_file = document.createElement('div')

	  		preview_file.src = new_path
	  		preview_file.type = file_data.type
	  		preview_file.value = file_data.name
	  		preview_file.id = "published_publish_multimedia_chat_path"
	  		preview_file.width = 150

	  	} else if (file_data.type === 'video/mp4') {
	  		// El archivo subido es video/mp4

		  	// Pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
	  		var preview_file = document.createElement('video')
	  		//var preview_file_source = document.createElement('source')

	  		var tag_type_file = document.createElement('div')

	  		preview_file.src = new_path
	  		preview_file.type = file_data.type
	  		preview_file.value = file_data.name
	  		preview_file.id = "published_publish_multimedia_chat_path"
	  		preview_file.width = 300
	  		preview_file.controls = true

	  	} else if (file_data.type === 'audio/mp3') {
	  		// El archivo subido es audio/mp3

		  	// Pegando template de contendor de imagen - segun el file.type el tipo de contenerdor de multimedia
	  		var preview_file = document.createElement('audio')
	  		var tag_type_file = document.createElement('div')

	  		preview_file.src = new_path
	  		preview_file.type = file_data.type
	  		preview_file.value = file_data.name
	  		preview_file.id = "published_publish_multimedia_chat_path"
	  		preview_file.controls = true


	  	}

	  	$('#preview_box_to_chat').append(preview_file)
	  
	  }
	})
	 
	blobStream.pipe(stream)

	//console.log(blobStream.pipe(stream))
	//stream.pipe(ss.createWriteStream(filename))
})

$('#FormMsg').submit(function () {

	// Datos para enviar por publicación
	var $user_id = document.querySelector('#user_id').value
	var $user_full_name = document.querySelector('#user_full_name').value
	var $user_avatar = document.querySelector('#user_avatar').value
	var $message = document.querySelector('#txt_message').value
	var $message_multi_data = document.querySelector('#published_publish_multimedia_chat_path')
	
	var message_data = {
		user_id:  $user_id,
		user_full_name: $user_full_name,
		user_avatar: $user_avatar,
		message: $message,
		message_multi_data: {
			type: 'without_mutimedia'
		}
	}

	if($message_multi_data !== null) {
		console.log('Publicando con imagen')
		message_data.message_multi_data = {
			name: $message_multi_data.value,
			type: file_data.type,
			size: file_data.size,
			date: file_data.lastModified
		}

	    // Limpiar el preview de imagen
		document.querySelector('#preview_box_to_chat').innerHTML = ''
	}
	console.log('Mensaje antes de enviar')
	console.log(message_data)

	socket.emit('chat', message_data)

	document.querySelector('#txt_message').value = ''

	return false

})

socket.on('chat', function (content) {
	console.log('Mensaje')
	console.log(content)
	
	var template = ''

	if(content.message_multi_data.type === 'without_mutimedia') {
		console.log('El mensaje de chat NO tiene imagen')
		template = `<article style="border-top: 1px solid lightgray;">
						        <p>${content.user_id}</p>
						        <strong>${content.user_full_name}</strong>
						        <img src="${content.user_avatar}" width="50"/>
						        <p>${content.message_multi_data.type}</p>
						        <p>${content.message}</p>
						        <p>${content.dateCreateRoom}</p>
					      </article>`
	
	} else {
		
		console.log('El mensaje de chat tiene imagen')
		template = `<article style="border-top: 1px solid lightgray;">
						        <p>${content.user_id}</p>
						        <strong>${content.user_full_name}</strong>
						        <img src="${content.user_avatar}" width="50"/>
						        <div>
							        <img src="../../../../../${content.message_multi_data.path}" width="100"/>
							        <p>${content.message}</p>
						        </div>	
						        <p>${content.message_multi_data.type}</p>
						        <p>${content.dateCreateRoom}</p>
					      </article>`
		document.querySelector('#published_publish_multimedia_chat_path')			

	}	

	$('.ContentChat').append(template)
})

var Chatroom = document.querySelector('#chatRoom_id').value

socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this room
   socket.emit('Chatroom', Chatroom)
})
