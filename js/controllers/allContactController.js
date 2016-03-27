
sample_AddressBook.controller('allContactCtrl', ['$rootScope','$scope','$mdMedia','$mdDialog','$http','$httpParamSerializerJQLike','$mdToast','AddressBookData',
 function ($rootScope,$scope,$mdMedia,$mdDialog,$http,$httpParamSerializerJQLike,$mdToast,AddressBookData) {
  	$scope.tempUser = {};
  	
  	

  	var url = 'http://localhost/addressbook_sampleproject/phpConfig/dbConnect.php';

  	$scope.showAddContactPopup = function(ev,item) {
		//for updating the contact
  		if(ev=="updateContact"){
  			var updateObject=item;
  			$scope.actionHeading="Update Contact";
  			$scope.name=updateObject.name;
  			$scope.phone=updateObject.phone;
  			$scope.address=updateObject.address;
  			$scope.email=updateObject.email;
  			$scope.SelectedContactId=updateObject.id;
  			$scope.actionDone="Update";
  		}else{
  			//for add Contact popup Change
  			$scope.actionHeading="Add Contact";
  			$scope.name="";
  			$scope.phone="";
  			$scope.address="";
  			$scope.email="";
  			$scope.SelectedContactId="";
			$scope.actionDone="Add";
  		}

		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		$mdDialog.show({
			controller: 'allContactCtrl',
			templateUrl: 'partials/addContactPopUp.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: useFullScreen,
			scope:this,         // use parent scope in template
            preserveScope: true
		})
		.then(function() {
		}, function() {
			console.log("clicked cancel");
		});
		

		
	};

	$scope.closeContactPopup = function() {
		$mdDialog.cancel();
	};
 	
 	$scope.showHints = true;

 	$scope.showSimpleToast = function(message) {
    var pinTo = 'bottom';
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position(pinTo)
        .hideDelay(3000)
    );
  };

	$scope.addContact = function(Username,userPhone,email,userAddress) {
		if(Username==""){
			$scope.showSimpleToast("Fill User Name"); 
			return;
		}
		$scope.tempContact = {
			name : Username,
			phone:userPhone,
			address:userAddress,
			email : email,
			id:$scope.SelectedContactId
		};

		$http({
	      method: 'post',
	      url: url,
	      data: $httpParamSerializerJQLike({'user' : $scope.tempContact, 'type' : 'save_Contact' }),
	      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).
	    success(function(data, status, headers, config) {
	    	;
	    	if(data.success){
	    		$scope.addContact=true;

	    		$scope.tempContact = {
					name : Username,
					phone:userPhone,
					address:userAddress,
					email : email,
					id:data.id
				};
			for(var i=0;i<$scope.contactView.length;i++){
				if($scope.contactView[i].id==data.id){
					$scope.contactView[i].name=Username;
					$scope.contactView[i].phone=userPhone;
					$scope.contactView[i].address=userAddress;
					$scope.contactView[i].email=email;
					$scope.addContact=false;
				}else{
				}
			}
			if($scope.addContact){
					$scope.contactView.push($scope.tempContact );
			}
	    		
	    	$scope.closeContactPopup();	
	    	}else{
	    	}
	    }).
	    error(function(data, status, headers, config) {
	        //$scope.codeStatus = response || "Request failed";
	    });
	};


	$scope.init = function(){
		$scope.contactView=[];
		$scope.contactCount=0;
	    $http({
	      method: 'post',
	      url: url,
	      data: $httpParamSerializerJQLike({ 'type' : 'getContact' }),
	      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).
	    success(function(data, status, headers, config) {
	    	if(data.success && !angular.isUndefined(data.data) ){
	    		var objectSucess=data.data;
	    			$scope.contactView=	objectSucess;
	    			$scope.contactCount=objectSucess.length;
	    			AddressBookData.contactLoadedData = $scope.contactView;
	    		
	    	}else{
	    		$scope.messageFailure(data.message);
	    	}
	    }).
	    error(function(data, status, headers, config) {
	    	//$scope.messageFailure(data.message);
	    });
	}

	//contact filter code
	$scope.contactQuerySearch=contactQuerySearch;
	$scope.contactView=AddressBookData.contactLoadedData;


	function contactQuerySearch (query) {
		var results = query ? $scope.contactView.filter(createContactFilterFor(query)) : $scope.contactView;
		return results;
	};

	function createContactFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(contact) {
			return (contact.name.toLowerCase().indexOf(lowercaseQuery) === 0);
		};
	};
				
	$scope.selectedItemChange=function(item) {
		if(item!=null){
			$scope.contactView=[];
			$scope.contactView.push(item);	
		}else{
			$scope.contactView=AddressBookData.contactLoadedData;
		}
	};
		
	$scope.searchTextChange=function (item) {
				
	}
	


}]);

