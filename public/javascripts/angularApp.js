var app = angular.module('EDGE-Trello', ['trello', 'ui.router', 'googlechart']);

app.config([
	'TrelloApiProvider', 
	'$stateProvider',
	'$urlRouterProvider',
	function(TrelloApiProvider, $stateProvider, $urlRouterProvider) {
		
		var authenticationSuccess = function() { console.log("Successful authentication"); };
		var authenticationFailure = function() { console.log("Failed authentication"); };
		
		
		TrelloApiProvider.init({
			key: '87b220f4687be5f86544b866eef24b3e',
			type: "popup",
			name: "Getting Started Application",
			scope: {
				read: true,
				write: true },
			expiration: "never",
			authenticationSuccess,
			authenticationFailure
		});
		
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/javascripts/home/_home.html',
			controller: 'MainCtrl'
//			resolve: {
//				diseasePromise: ['diseases', function(diseases){
//					return diseases.getAll();
//				}]
			})
//		})
		
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
	'googleChartApiPromise',
	function($scope, TrelloApi, diseases, googleChartApiPromise){
		
		$scope.diseases = diseases.diseases;
		
		$scope.arrayToChart = function(arr) {
			
			for ( x=0; x < arr.length; x++ ) {
			
			}
		};
		
		$scope.login = function () {
				TrelloApi.Authenticate().then(function(){
						$scope.getBoard();
						$scope.getComplete();
//						setTimeout($scope.compareData(), 1000);
//						setTimeout($scope.chartMe(), 500);
				}, function(){
						console.log('no');
				});
		};
		
		$scope.removeDisease = function(disease) {
			diseases.destroy(disease);
		}
		
		$scope.compareData = function() {
//			console.log("here i am");
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
//			console.log(totalData);
			
//			for ( x=0; x < totalData.length; x++ ) {
//				var title = totalData[x][0]
//				$scope.title = totalData[x][1]
//			}
			
			$scope.liver = [
				{v: totalData[0][0]},
				{v: totalData[0][1][0][1]},
				{v: totalData[0][1][1][1]},
				{v: totalData[0][1][2][1]},
				{v: totalData[0][1][3][1]}
			];
			
			$scope.ovarian = [
				{v: totalData[1][0]},
				{v: totalData[1][1][0][1]},
				{v: totalData[1][1][1][1]},
				{v: totalData[1][1][2][1]},
				{v: totalData[1][1][3][1]}
			];
			
			$scope.pancreatic = [
				{v: totalData[2][0]},
				{v: totalData[2][1][0][1]},
				{v: totalData[2][1][1][1]},
				{v: totalData[2][1][2][1]},
				{v: totalData[2][1][3][1]}
			]
			
//			console.log("...also called");
			setTimeout($scope.chartMeLine(), 500);
			setTimeout($scope.chartMeBar(), 500);
			
		};
		
		$scope.postToDatabase = function() {
			
			var input = window.prompt("Please enter the password");
			
			if ( input == "pepper77" ) {
				
				var totalData = [];
				var boards = $scope.boards;
				var completed = $scope.completed;
				
				console.log("boards: ", boards);

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
						"56536aa2a71809d4b18a7ea3": 'Pancreatic',
						"56a13b662aad70e0c0d1f2f9": 'AM-5512 AML PDX'}
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
//					console.log("calling: ", callback)
//					callback($scope.compareData);
					
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
//			console.log("calling: ", callback);
//			callback($scope.chartMe);
		};
		
		$scope.chartMeBar = function() {
			
			$scope.chartObject1 = {};
			var serverComplete = []; // for cols
			var serverData = [];     // for rows
			var serverTotal = {};
			var temp = []
			
			// Generate columns
			serverComplete.push(
				{id: "tissue", label: "Tissue Type", type: "string"},
				{id: "chipped", label: "ChIPed", type: "number"},
				{id: "received", label: "Recevied", type: "number"},
				{id: "smashed", label: "Smashed", type: "number"},
				{id: "complete", label: "Complete", type: "number"}
			);
			
			// Generate rows
			for ( x=0; x < $scope.totalData.length; x++ ) {
				var temp = [];
				temp.push($scope.totalData[x][0]);
				for ( y=0; y < $scope.totalData[x][1].length; y++ ) {
					temp.push($scope.totalData[x][1][y][1]);
				}
				serverData.push(temp);
			}
			
			// Combine rows and cols
			var totalPackage = [serverComplete];
			
			for ( x=0; x < serverData.length; x++ ) {
				totalPackage.push(serverData[x]);
			}
			
			console.log(totalPackage);
			chartApiSuccess();
			
			// Chart options
			function chartApiSuccess(){
				console.log("Called");
				$scope.chartObject1.type = 'BarChart';
				$scope.chartObject1.options = {
					'title': 'EDGE Statistics',
					'isStacked': 'true'	
				}
				$scope.chartObject1.data = google.visualization.arrayToDataTable(
					totalPackage
				);
			};
		};
		
		$scope.chartMeLine = function() {
			
			$scope.chartObject2 = {};	
			var serverComplete = []; // for cols
			var serverData = [];     // for rows
			var serverTotal = {};
			var temp = []
			
			console.log("Diseases: ", diseases.diseases);
			
			init();
			
			function init(){
				googleChartApiPromise.then(chartApiSuccess);
			}
			
			// Generate columns ------------------------------
			serverComplete.push(
				{label: 'Week', id: 'week', type: "date"}
			);
			
			var tissueTypes = [];
			for ( x=0; x < diseases.diseases.length; x++ ) {
				if (tissueTypes.indexOf(diseases.diseases[x].name) == -1) {
					tissueTypes.push(diseases.diseases[x].name)
				}
			}
			
			for ( x=0; x < tissueTypes.length; x++ ) {
				serverComplete.push({
					id: tissueTypes[x],
					label: tissueTypes[x],
					type: "number"
				});
			}
			
			console.log("ServerComplete: ", serverComplete);
			
			// Generate rows ----------------------------------------
			var dates = [];
			
			for ( x=0; x < diseases.diseases.length; x++ ) {
				if (dates.indexOf(diseases.diseases[x].createdAt) == -1) {
					dates.push(diseases.diseases[x].createdAt)
				}
			}
			
//			console.log(dates);
//			
//			for ( x=0; x < dates.length; x++ ) {
//				dates[x] = new Date( dates[x] );
//			}
//			
//			console.log(dates);
			
			for ( x=0; x < dates.length; x++ ) {
				temp = [];
				temp.push(dates[x]);
				for( y=0; y < diseases.diseases.length; y++ ) {
					if ( diseases.diseases[y].createdAt == dates[x] ) {
						temp.push(diseases.diseases[y].complete)
					}
				}
				serverData.push(temp);
			}
			
			console.log("Server Data: ", serverData);
			
			for (x=0; x < serverData.length; x++ ) {
				serverData[x][0] = new Date( serverData[x][0] );
			}
			
			// Combine cols and rows --------------------------------------
			var totalPackage = [serverComplete];
			
			for (x=0; x < serverData.length; x++ ) {
				totalPackage.push(serverData[x]);
			}
			
			console.log("Total: ", totalPackage);
			chartApiSuccess();
			
			function chartApiSuccess(){
				$scope.chartObject2.type = 'LineChart';
				$scope.chartObject2.data = google.visualization.arrayToDataTable(
					totalPackage
				);
			};
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

app.controller('ChartCtrl', function($scope) {});
