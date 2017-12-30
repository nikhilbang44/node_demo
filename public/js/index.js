var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var template = $('#message-template').html();
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var html = Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var html = Mustache.render(template,{
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

socket.emit('createMessage', {
  from: 'kapil',
  text: 'Hi'
}, function (data) {
  console.log('Got it', data);
});

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();
	socket.emit('createMessage',{
		from: 'User',
		text: jQuery('#message').val()
	}, function () {

	})
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});
