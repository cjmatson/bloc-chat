var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', 'ui.bootstrap']);
blocChat.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode({ enabled: true, requireBase: false });
	$stateProvider.state('home', {
		url: '/',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html'
	});
}])

blocChat.controller('Home.controller', ['$scope', 'Room', '$rootScope', '$modal', function($scope, Room, $rootScope, $modal) {
	$scope.animationsEnabled = true;
	$scope.toggleAnimations = function() {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	}
	$scope.open = function(size) {
		var modalInstance = $modal.open({
		animation: $scope.animationsEnabled,
		size: size,
		scope: $scope,
		replace: true,
		controller: 'ModalContent.controller',
		templateUrl: '/templates/modalcontent.html',
		windowClass: 'modal fade in'
		});
	}
}])

blocChat.controller('ModalContent.controller', ['$scope', 'Room', '$rootScope', '$modalInstance', function($scope, Room, $rootScope, $modalInstance) {
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
	$scope.createRoom = function() {
		if ($rootScope.room) {
			$rootScope.rooms.$add($rootScope.room);
			$modalInstance.close();
		}
	}
	$scope.returnRoom = function($event) {
		if($rootScope.room && $event.keyCode === 13) {
			$rootScope.rooms.$add($rootScope.room);
			$modalInstance.close();
		}
	}
}])

blocChat.factory('Room', ['$firebase', '$rootScope', function($firebase, $rootScope) {
	var ref = new Firebase ("https://screaming-wind-7497.firebaseio.com/");
	$rootScope.data = $firebase(ref);
	$rootScope.rooms = $rootScope.data.$asArray();
	$rootScope.room = {name: $rootScope.room};
	return {
		all: $rootScope.rooms
	}
}])

