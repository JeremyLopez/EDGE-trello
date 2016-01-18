var app = angular.module('EDGE-Trello', ['trello', 'ui.router']);

app.config([
	'TrelloApiProvider', 
	'$stateProvider',
	'$urlRouterProvider',
	function(TrelloApiProvider, $stateProvider, $urlRouterProvider) {
		
		TrelloApiProvider.init({
			key: '87b220f4687be5f86544b866eef24b3e',
			secret: 'd6973d41ea27349ff6196e4d93d6858de70a68884e95aa455fe9acfc0163c71b',
			scopes: {read: true, write: true, account: true},
			AppName: 'Angular-Trello Test'
		}),
		
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		
		.state('diseases', {
			url: '/diseases/{id}',
			templateUrl: '/diseases.html',
			controller: 'DiseasesCtrl'
		});

		$urlRouterProvider.otherwise('home');	
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'TrelloApi',
	'diseases',
	function($scope, TrelloApi, diseases){

		$scope.board = [];
		
		$scope.diseases = diseases.diseases;

		$scope.login = function () {
				TrelloApi.Authenticate().then(function(){
						$scope.getBoard();
				}, function(){
						console.log('no');
				});
		};

		$scope.getBoard = function () {
				TrelloApi.Rest('GET', '/boards/5617b62d17282f37686b1542/checklists')
					.then(function(res){

						checklists = [];

						for ( x=0; x < res.length; x++ ) {
							if ( res[x].name != "FFPE" && res[x].name != "Frozen" ) {
								checklists.push(res[x]);
							}
						}

						$scope.boards = checklists;
						console.log(res);

				}, function(err){
						console.log(err);
				});
		};

	//	$scope.getBoards = function() {
	//			TrelloApi.boards($scope.boards, {}).then(function(res) {
	//					console.log(res);
	//			}, function(err) {
	//					console.log(err);
	//			});
	//	};

		$scope.diseases = [
			'Ovarian',
			'Pancreatic',
			'Liver'
		];
	}
]);

app.controller('DiseasesCtrl', [
	'$scope',
	'$stateParams',
	'diseases',
	function($scope, $stateParams, diseases){
		
	}
])

app.factory('diseases', [
	function(){
		var o = {
			diseases: []
		};
		return o;
	}
]);