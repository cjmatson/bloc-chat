var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', 'ui.bootstrap', 'ngCookies']);
blocChat.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode({ enabled: true, requireBase: false });
	$stateProvider.state('home', {
		url: '/',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html'
	});
}])

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

blocChat.controller('Home.controller', ['$scope', 'Room', '$modal', function ($scope, Room, $modal) {
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
	$scope.activeChatRoom = false;
	$scope.selectChatRoom = function (room, id) {
		$scope.selectedChatRoom = room.name;
		$scope.activeChatRoom = true;
		$scope.messages = Room.messages(id);
	}
}])

blocChat.controller('ModalContent.controller', ['$scope', 'Room', '$modalInstance', function ($scope, Room, $modalInstance) {
	$scope.room = {};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}
	$scope.createRoom = function () {
		if ($scope.room.name) {
		Room.create($scope.room);
		$modalInstance.close();
		}
	}
}])

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

