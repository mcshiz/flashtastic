'use strict';

flashtasticApp.controller('NavCtrl', function(){
	this.nav = 1;
	this.navSelect = function(value){
		this.nav = value;
	};
	this.selectedNav = function(value){
		return this.nav === value;
	}
});
flashtasticApp.controller('MainCtrl', function ($scope, localStorageService ) {
		$scope.pageClass = 'page-create';
		$scope.setFilter = { term: '' };
		var cardsInStore = localStorageService.get('cards');
		$scope.cards = cardsInStore || [];
		$scope.$watch('cards', function () {
			localStorageService.add('cards', JSON.stringify($scope.cards));
		}, true);
    //$scope.cards = [{question:'hello world', answer: 'earth'}, {question:'goodbye world', answer:'mars'}];
		$scope.addCard = function () {
			if ($scope.index === '' || $scope.index === undefined ) {
				$scope.cards.push({
					question: $scope.question,
					answer: $scope.answer,
					setName: $scope.setName
				});
			} else {
				var index = $scope.index;
				$scope.set[index].question = $scope.question;
				$scope.set[index].answer = $scope.answer;
			}
			$scope.question = '';
			$scope.answer = '';
			$scope.index = '';
    };
    $scope.setFunc = function (card) {
    	$scope.setName = $scope.set[0].setName;
    	console.log(card);
    	console.log($scope.set);
    };
    $scope.removeCard = function (index) {
			$scope.cards.splice(index, 1);
		};
		$scope.logIt = function () {
			console.log($scope.setFilter.term);
		};
		$scope.searchFilter = function (card) {
			var keyword = new RegExp('^' + $scope.setFilter.term + '$', 'i');
			return !$scope.setFilter.term || keyword.test(card.setName);
		};
		$scope.editCard = function (index) {
			$scope.question = $scope.set[index].question;
			$scope.answer = $scope.set[index].answer;
			$scope.setName = $scope.set[index].setName;
			$scope.index = index;
			var addBtn = document.getElementById('addBtn');
			addBtn.value='Edit';
		};
	});
