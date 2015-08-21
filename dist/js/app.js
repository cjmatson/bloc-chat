var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', 'ui.bootstrap']);
blocChat.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode({ enabled: true, requireBase: false });
	$stateProvider.state('home', {
		url: '/',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html'
	});
}])
blocChat.controller('Home.controller', ['$scope', 'Room', '$modal', function($scope, Room, $modal) {
	$scope.rooms = Room.all;
	$scope.open = function(size) {
		var modalInstance = $modal.open({
		size: size,
		scope: $scope,
		replace: true,
		controller: 'ModalContent.controller',
		templateUrl: '/templates/modalcontent.html',
		windowClass: 'modal fade in'
		});
	}
	$scope.activeChatRoom = false;
	$scope.selectChatRoom = function(room, id) {
		$scope.selectedChatRoom = room.name;
		$scope.activeChatRoom = true;
		$scope.messages = Room.messages(id);
	}
}])

blocChat.controller('ModalContent.controller', ['$scope', 'Room', '$modalInstance', function($scope, Room, $modalInstance) {
	$scope.room = {};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
	$scope.createRoom = function() {
		if ($scope.room.name) {
		Room.create($scope.room);
		$modalInstance.close();
		}
	}
}])

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray) {
	var ref = new Firebase ("https://screaming-wind-7497.firebaseio.com/");
	var rooms = $firebaseArray(ref.child('rooms'));
	return {
		all: rooms,
		create: function(newRoom) {
			rooms.$add(newRoom);
		},
		messages: function(roomId) {
			var messagesRef = new Firebase ("https://screaming-wind-7497.firebaseio.com/messages")
			return $firebaseArray(messagesRef.orderByChild('roomId').equalTo(roomId));
		}
	}	
}])

