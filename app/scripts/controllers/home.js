'use strict';

flashtasticApp.controller('HomeCtrl', function ($scope, localStorageService ) {
		$scope.pageClass = 'page-home';
		$scope.setFilter = { term: '' };
		var cardsInStore = localStorageService.get('cards');
		$scope.cards = cardsInStore || [];
		$scope.$watch('cards', function () {
			localStorageService.add('cards', JSON.stringify($scope.cards));
		}, true);

	});

flashtasticApp.controller('NavCtrl', function(){
	this.nav = 1;
	this.navSelect = function(value){
		this.nav = value;
	};
	this.selectedNav = function(value){
		return this.nav === value;
	}
});
