'use strict';

/*
################ known issues ###############

*/

var flashtasticApp = angular.module('flashtasticApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.sortable',
    'LocalStorageModule',
    'ui.unique',
    'firebase',
  ]);
flashtasticApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('flash-ls');
}]);


flashtasticApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/create', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/learn', {
      templateUrl: 'views/learn.html',
      controller: 'LearnCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// services =======================


flashtasticApp.factory('retrieveCards', ['$firebase', function() {


/* 
this service is responsible for initially building a users set of cards
this can be through localStorageService or through a database.

right now it is just set to a static array

future plans to build it to retrieve all cards in localStorageService
*/

// var cardsInStorage = [];
//var cardsInStore = localStorageService.get('cards');
//return function(cardsInStorage) {
// var cardsInStorage = localStorageService.get('cards');
// cardsInStorage = cardsInStore || [];
    // $scope.$watch('cards', function () {
    //   localStorageService.add('cards', JSON.stringify($scope.cards));
    // }, true);

     var cardsInStorage = [
          {
          question: '1 + 1',
          answer: '2',
          setName: 'Math'
          },
          {
          question: '3 * 3',
          answer: '9',
          setName: 'Math'
          },
          {
          question: '11 + 11',
          answer: '22',
          setName: 'Math'
          },
          {
          question: 'Is pluto a planet',
          answer: 'maybe',
          setName: 'science'
          },
          {
          question: 'Study of Rocks',
          answer: 'Geology ',
          setName: 'science'
          },
          {
          question: 'Largest particle collider',
          answer: 'LHC',
          setName: 'science'
          },
          {
          question: 'Electrons are smaller than atoms: T or F',
          answer: 'T',
          setName: 'science'
          },
    ];
  return cardsInStorage;

 }]);


// controllers =======================

flashtasticApp.controller('DeckList',[
  '$scope', 
  'retrieveCards',
  '$firebase',  
  function ($scope, retrieveCards, $firebase) {



  var decksRef = new Firebase("https://flashtastic.firebaseio.com/username/decks/");
  var sync = $firebase(decksRef);
  $scope.data = sync.$asObject();

  
    // console.log(decksRef.child('0001').child('question'));

  // Attach an asynchronous callback to read the data at our posts reference
  decksRef.on('value', function (decksSnapshot) {

    $scope.decks = decksSnapshot.val();
    var nc = 0;
    var i = "";
    for (i in $scope.decks) nc++;


  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

/*
var tempDeck contains an array of objects, each object is a card beloning
to the set selected on the main page.

next step is to show the matching cards on the main stage after a deck is selected.
create LearnCtrl 
  this controller will be responsible for loading the selected deck into the 
  main stage.
  first step is to grab first object in tempDeck array and show the question
  on the main stage.

  duties of LearnCtrl
    Load cards onto main stage
    Show next/prev card on command (always show question after seeking cards!)

should I use a different controller(or service) for the flip Card button?
  because I will have to flip the card(maybe) on the create and edit cards page.
*/

  this.loadDeck = function(deckName) {
    var myDeckRef = new Firebase("https://flashtastic.firebaseio.com/username/decks/"+deckName);
    $scope.thisDeck = deckName;
    myDeckRef.on('value', function (myDeckSnapshot) {
    $scope.myDeck = myDeckSnapshot.val();
      var cardsInDeck = [];
      myDeckSnapshot.forEach(function(cardsSnapshot){
          cardsInDeck.push(cardsSnapshot.val());
        });
        $scope.currentDeck = cardsInDeck;
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
  }; //end of loadDeck function



/*
NavCtrl should be responsible for changing the active states of buttons on click.
should also be in charge of hiding/showing screens based on where navigation is.


could change loadDeck function to use this to show/hide instead of doing it there.

it would look something like this.navSelect(2)
and that would change navSelect to 2 thus changing the active class on the navigation
and hiding the pick deck screen

*/

  this.nav = 1;
  $scope.stageCard = 0;


  this.navSelect = function(value) {
    setStage();
    this.nav = value;
    $scope.stageCard = 0;
    if (this.nav == 3) {
      $scope.newDeckName = "";
      $scope.currentDeck = "";
      $('#name-deck-modal').modal('show');
    };
    if (this.nav == 2 && !$scope.currentDeck ) {
      this.navSelect(1);
    };
    //if select login, show login form and redirect back to deck list screen
    if (this.nav === 4){
       $('#login-modal').modal('show');
       this.navSelect(1);
    };
    
  }; //end navSelect Function

  this.selectedNav = function(value) {
    return this.nav === value;
  };

  $scope.changeCard = function(value) {
    setStage();
    $scope.stageCard = value; 
  };


  $scope.flip = function(){
      $('.card').toggleClass('flipped');
      $('.stage-question, .stage-answer').delay(650).toggle();
  };


  var setStage = function() {
    if($('div.card').hasClass('flipped')) {
      $scope.flip();
    } else {
   return false;
    }
  }; //end setStage func.

  $scope.seek = function(value) {
    setStage();
    if (($scope.stageCard + value) == $scope.currentDeck.length) {
      $scope.stageCard = 0;
    } else if (($scope.stageCard + value) == -1) {
      $scope.stageCard = $scope.currentDeck.length -1
    } else {
      $scope.stageCard = $scope.stageCard + value;
    }
  }; // end seek func.


  this.removeDeck = function(deckName){
    var removeDeckRef = new Firebase("https://flashtastic.firebaseio.com/username/decks/"+deckName);
    removeDeckRef.remove();
  }
/*
trying to figure out how to save a new card set.
nsn (new save name) has to be stored some where so 
every new card (created in this session) can access and use it.

create a temp. object something like
newCard.setname = nsn,
newCard.question = {{question}},
newCard.answer = {{answer}},

all new cards in this session use this base object.
this base object is created when save(modal save) button is clicked.

when the card-save button is clicked this temp object is passed to cardsInStorage
and a new temp object is initialized (set newCard.question to "" etc...)

newcard.prototype blah blah blah



*/
  $scope.editCard = function(card){
    $scope.myEditCard = (parseInt(card)+1);
    var edit = new Firebase("https://flashtastic.firebaseio.com/username/decks/"+$scope.thisDeck+"/"+$scope.myEditCard);
    edit.on('value', function (myEditSnapshot) {
    $scope.myEdit = myEditSnapshot.val();
      $scope.newQuestion = $scope.myEdit.question;
      $scope.newAnswer = $scope.myEdit.answer;
      $scope.show=true;
  });
}
  $scope.saveEditCard = function(newQuestion, newAnswer) {
      console.log($scope.thisDeck);
    
    if (!$scope.thisDeck){
      $scope.error = "Please enter a nave for this deck of cards"
      $('.error-modal').show();
      return false;
    };
    var edit = new Firebase("https://flashtastic.firebaseio.com/username/decks/"+$scope.thisDeck);
    edit.child($scope.myEditCard).set({question: newQuestion, answer: newAnswer});
    setStage();
  }




  this.cancel = function(){
    setStage();
    $scope.newQuestion = "";
    $scope.newAnswer = "";
    $scope.show=false;
  }


  var cardCount = 1;
  $scope.saveNewCard = function(newDeckName, question, answer){

    var addDeck = new Firebase("https://flashtastic.firebaseio.com/username/decks/"+newDeckName);
    
    if (question == "" || answer == "") {
      $scope.flip();
      return;
    } else {
      addDeck.child(cardCount).set({
          question: question,
          answer: answer
      });
      cardCount++;
      $scope.newQuestion = "";
      $scope.newAnswer = "";
      setStage();
    }
  };





}]); // end of DeckList Controller


/*
This controller will be responsible for things that go on while creating a new set
  when create deck screen comes up
    modal pops up asking what to name the deck - becomes setName
      hitting save on the modal will pass that information to loadDeck
      loadDeck will take care of updating the cardList as each card is pushed to cardsInStorage.
    main stages get set (clear text boxes, question shows, answer hides)
    textbox on card has placeholder text "Enter your question here then flip the card and enter the answer"
    enter question, flip card, enter answer ** HIT SAVE **
    Hitting save will push that information to cardsInStorage.
    Hitting save will also set the main stage (clear text boxes, question shows, answer hides)
*/

flashtasticApp.controller('createCtrl',[
  '$scope', 
  'retrieveCards',  
  function ($scope, retrieveCards) {



  }]); // end of createCtrl





flashtasticApp.controller('HomeCtrl',['$scope', 'retrieveCards', function ($scope, retrieveCards) {
    $scope.pageClass = 'page-home';
    $scope.setFilter = { term: '' };
    $scope.cards = retrieveCards;
}]);





