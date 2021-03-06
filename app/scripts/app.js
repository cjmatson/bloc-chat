// Establishes BlocChat application module
var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', 'ui.bootstrap', 'ngCookies']);
// Configuration for BlocChat's home state
blocChat.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode({ enabled: true, requireBase: false });
	$stateProvider.state('home', {
		url: '/',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html'
	});
}])
//As soon as a user enters BlocChat, a modal will appear 
blocChat.run(['$modal', '$cookies', function ($modal, $cookies) {
	if (!$cookies.currentUser || $cookies.currentUser === "") {
		$modal.open({
			replace: true,
			controller: 'ModalCurrentUser.controller',
			templateUrl: '/templates/modalcurrentuser.html',
			windowClass: 'modal fade in',
			backdrop: 'static'
		})
	}
}])
// Modal controller prompting user to enter username before entering BlocChat
blocChat.controller('ModalCurrentUser.controller', ['$scope', '$modalInstance', '$cookies', function ($scope, $modalInstance, $cookies) {
	$scope.currentUser = {};
	$scope.enterUsernameButton = function () {
		if (!$scope.currentUser.name) {
			alert("Invalid username. Please enter a valid username.");
		}
		else {
			$cookies.put("currentUser", $scope.currentUser.name);
			$modalInstance.close();
		}
	}
}])
//Controller for the home page. The 'create room' button will prompt a modal when clicked
blocChat.controller('Home.controller', ['$scope', 'Room', 'Message', '$modal', '$cookies', function ($scope, Room, Message, $modal, $cookies) {
	$scope.rooms = Room.all;
	$scope.open = function (size) {
		var modalInstance = $modal.open({
		size: size,
		scope: $scope,
		replace: true,
		controller: 'ModalContent.controller',
		templateUrl: '/templates/modalcontent.html',
		windowClass: 'modal fade in',
		backdrop: 'static'
		});
	}
	//Selecting a chat room listed on the left side of the application
	$scope.activeChatRoom = false;
	$scope.selectChatRoom = function (room) {
		$scope.selectedChatRoom = room;
		$scope.activeChatRoom = true;
		$scope.messages = Room.messages($scope.selectedChatRoom.$id);
	}
	//Sending and displaying chat room messages
	$scope.sendMessage = function () {
		var time = new Date();
		var currentTime = time.toLocaleString()
		if ($scope.newMessage) {
			$scope.message = {username: $cookies.get("currentUser"), sentAt: currentTime, roomId: $scope.selectedChatRoom.$id, content: $scope.newMessage};
			Message.send($scope.message);
			$scope.newMessage = "";
		}
		else {
			alert("Invalid message. Please re-enter a valid message.")
		}
	}
}])
//Modal controller prompting user to enter a chat room name when it clicks on the 'create room' button
blocChat.controller('ModalContent.controller', ['$scope', 'Room', '$modalInstance', function ($scope, Room, $modalInstance) {
	$scope.room = {};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}
	$scope.createRoom = function () {
		if ($scope.room.name) {
		Room.create($scope.room);
		$modalInstance.close();
		$scope.room.name = "";
		}
		else {
			alert("Invalid room name. Please re-enter room name.")
		}
	}
}])
//Service syncing rooms' data to Firebase
blocChat.factory('Room', ['$firebaseArray', function ($firebaseArray) {
	var ref = new Firebase ("https://screaming-wind-7497.firebaseio.com/");
	var rooms = $firebaseArray(ref.child('rooms'));
	return {
		all: rooms,
		create: function (newRoom) {
			rooms.$add(newRoom);
		},
		messages: function (roomId) {
			var messagesRef = new Firebase ("https://screaming-wind-7497.firebaseio.com/messages")
			return $firebaseArray(messagesRef.orderByChild('roomId').equalTo(roomId));
		}
	}	
}])
//Service syncing messages' data to Firebase
blocChat.factory('Message', ['$firebaseArray', function ($firebaseArray) {
	var ref = new Firebase ("https://screaming-wind-7497.firebaseio.com");
	var messages = $firebaseArray(ref.child('messages'));
	return {
		send: function (newMessage) {
			messages.$add(newMessage);
		}
	}
}])

