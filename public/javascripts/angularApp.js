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
			templateUrl: '/javascripts/home/_home.html',
			controller: 'MainCtrl',
			resolve: {
				diseasePromise: ['diseases', function(diseases){
					return diseases.getAll();
				}]
			}
		})
		
		.state('disease', {
			url: '/diseases',
			templateUrl: '/javascripts/home/_diseases.html',
			controller: 'MainCtrl'
		})
		
		.state('diseases', {
			url: '/diseases/{id}',
			templateUrl: '/javascripts/home/_diseases.html',
			controller: 'MainCtrl'
		});

		$urlRouterProvider.otherwise('home');	
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'TrelloApi',
	'diseases',
	function($scope, TrelloApi, diseases){
		
		$scope.diseases = diseases.diseases;

		$scope.login = function () {
				TrelloApi.Authenticate().then(function(){
						$scope.getBoard();
						$scope.getComplete();
				}, function(){
						console.log('no');
				});
		};
		
//		$scope.show = 
		
		$scope.removeDisease = function(disease) {
			console.log(disease);
//			debugger;
			diseases.destroy(disease);
//			diseases.(disease);
		}
		
		$scope.postToDatabase = function() {
			
			var input = window.prompt("Please enter the password");
			
			if ( input == "pepper77" ) {
				
				var totalData = [];
				var boards = $scope.boards;
				var completed = $scope.completed;

				// Combine completed and boards
				for ( i=0; i < boards.length; i++ ) {
					totalData.push(boards[i]);
				}

				for ( i=0; i < totalData.length; i++ ) {
					totalData[i][1].push(["Completed", completed[i][1]]);
				}

				$scope.totalData = totalData;

				for ( j=0; j < totalData.length; j++ ) {
	//				console.log(totalData[j]);
					
					diseases.create({
						name:     totalData[j][0],
						received: totalData[j][1][1][1],
						smashed:  totalData[j][1][2][1],
						chipped:  totalData[j][1][0][1],
						complete: totalData[j][1][3][1]
					});
				}
			} else {
				alert("Sorry that is incorrect")
			}
		};

		$scope.getBoard = function () {
				TrelloApi.Rest('GET',
											 '/boards/5617b62d17282f37686b1542/checklists')
				.then(function(res){
					
					var test = [];
					var checklists = [];
					var checklistData = {};
					var newArray = [];
					var finalData = {}
					var names = [
						{"56536a9a07744911b2745928": "Liver",
						"568d2c55e72cdb9b54523505": "Cell Lines",
						"56532fc900b19e6560d5f629": "Ovarian",
						"56536aa2a71809d4b18a7ea3": 'Pancreatic'}
					]
					
					// Remove extraneous cards
					for ( x=0; x < res.length; x++ ) {
						if ( res[x].name != "FFPE" && res[x].name != "Frozen" ) {
							checklists.push(res[x]);
						}
					}
					
					// Generate stats
					for ( x=0; x < checklists.length; x++ ) {
						var ids = [];
						var test = [];
						var currCard = checklists[x].idCard;
						var currCardName = checklists[x].name;
						var currCardLength = checklists[x].checkItems.length;

						// Generate array of all keys
						for ( key in checklistData ) {
							ids.push( key );
						}

						// Determine if card in array, if there, skip, if not, add
						if ( ids.indexOf( currCard ) == -1 ) {
							checklistData[ currCard ] = {}
							checklistData[ currCard ][ currCardName ] = currCardLength;

						} else {
							checklistData[ currCard ][ currCardName ] = currCardLength;
						}
					}
					
					// Replace id with tissue type
					for ( key in checklistData ) {
						finalData[names[0][key]] = checklistData[key];
					}	
					
					
					// Add tissue type to array
					for (var key1 in finalData) {
						if ( key1 != "Cell Lines" ) {
							test.push([key1, []]);
						}
					}
					
					// Add stats to tissue type
					for ( var i=0; i < test.length; i++ ) {
						for ( var key in finalData[test[i][0]] ) {
							test[i][1].push([key, finalData[test[i][0]][key]]);
						}
					test[i][1].sort(); // ensure lists in same order
					}
					
					// Generate cell line array
					for (var key in finalData["Cell Lines"]) {
						newArray.push([key, finalData["Cell Lines"][key]])
					}
					
					// Return variables for view
					$scope.cell_lines = newArray.sort(); // alphabetize cell lines
					$scope.boards = test.sort(); // alphabetize tissue type
					
					
				}, function(err){
						console.log(err);
				});
		};
		
		$scope.getComplete = function() {
			TrelloApi.Rest('GET', '/boards/5617b62d17282f37686b1542/cards')
				.then(function(res){
			
					var cardData = [];
					var cards = [];
					var lists = res;
				
					// Generate array with cards
					for (x=0; x < lists.length; x++) {
						var card = lists[x];
						cards.push(card);
					}
				
					// Remove extraneous and create new arr with name and #
					for ( i=0; i < cards.length; i++ ) {
						if ( cards[i].name != "RNA-Seq : Expression Analysis" &&
							 	 cards[i].name != "ChIP-Seg sequencing facility" &&
							 	 cards[i].name != "Cell Lines" ) {
							cardData.push([cards[i].name, cards[i]
														 								.checkItemStates.length]);
						}
					}
				
					$scope.completed = cardData.sort();
				});
		};
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
	'$http',
	function($http){
		
		var o = {
			diseases: []
		};
		
		o.show = function(disease) {
			return $http.get('/diseases/', {id : disease._id})
				.success(function(data) {
					console.log(disease.name);
			});
		};
		
		o.create = function(diseases) {
			return $http.post('/diseases', diseases).success(function(data){
				o.diseases.push(data);
				console.log(data);
			});
		};
		
		o.getAll = function() {
			return $http.get('/diseases').success(function(data){
				angular.copy(data, o.diseases);
//				console.log(data);
			});
		};
		
		o.destroy = function(disease) {
			return $http.delete('diseases/' + disease._id).success(function(data){
				console.log("Disease " + disease.name + " has been removed!");
				o.getAll();
			});
		};
		
		return o;
	}
]);
