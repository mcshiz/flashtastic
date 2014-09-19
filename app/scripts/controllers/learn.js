'use strict';

flashtasticApp.controller('LearnCtrl', function ($scope, localStorageService ) {
		$scope.pageClass = 'page-learn';
		$scope.setFilter = { term: '' };
		var cardsInStore = localStorageService.get('cards');
		$scope.cards = cardsInStore || [];
		$scope.$watch('cards', function () {
			localStorageService.add('cards', JSON.stringify($scope.cards));
		}, true);
		$scope.setMain = function (index) {
			$scope.question = $scope.cards[index].question;
		};
	});
