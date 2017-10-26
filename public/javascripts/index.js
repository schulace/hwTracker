/**
 * Created by schulace on 9/18/17.
 */
const pageModule = angular.module('postsPage', []);
/**
 *  a holder for the relevant info. will remain mostly
 *  in sync with the backend postgres db so that on updates,
 *  we don't need to fetch entire lists, we can just update
 *  things in this table
*/
pageModule.service('pgdata', ['$http', function($http) {
    let $scope = this;
    $scope.assignments = [];
    $scope.classes = [];
    $scope.loggedIn = false;
    $scope.populate = function() {
        $http({
            url:'/api/assignments',
            method:'GET',
            responseType:'json'
        }).then(function(res) {
            $scope.assignments = res.data;
            $scope.loggedIn = true;
        }, function(err) {
            $scope.loggedIn = false;
            alert('not logged in');
        });
    }; 
    $scope.email = '';
}]);
pageModule.controller('loginController', function($scope, $http, pgdata) {
    $scope.login = function () {
        $http({
            url:'/login',
            method:'POST',
            responseType:'json',
            data: $scope.formdata
        }).then(
            function(data){
                pgdata.populate();
                pgdata.email = $scope.formdata.email;
            },
            function(err){
                if(err.status === 500) {
                    alert('login server down');
                } else {
                    alert('login failed');
                }
            });
    }; 
    $scope.formdata = {
        email:'ajs520@lehigh.edu',
        password:'password' //temp lol
    };
    $scope.$watch(() =>pgdata.loggedIn, function(newval, oldval) {
        $scope.loggedIn = newval;
    });
    pgdata.populate();
});
pageModule.controller('assignmentsController', function($scope, $http, pgdata) {
    $scope.assignments = pgdata.assignments;
    $scope.$watch(() => pgdata.assignments, function(newval) {
        console.log('watch for assignments, ' + JSON.stringify(newval));
        $scope.assignments = newval;
    }, true);
});
pageModule.controller('assignmentController', function($scope, $http, pgdata){
    $scope.item = pgdata.assignments[$scope.$index];
    $scope.update = function() {
        console.log('completed is ', $scope.item.completed);
        $http({
            url:'/api/assignments/' + $scope.item.assignment_id,
            method:'PUT',
            responseType:'json',
            data:{
                tick:$scope.item.completed
            }
        }).then(function (res) {
            console.log('updated');
        }, function(err) {
            $scope.item.completed = !$scope.item.completed;
            alert('unable to connect to server');
        });
    };
});
pageModule.controller('profileController', function($scope, pgdata) {
    $scope.email = pgdata.email;
    $scope.$watch(() => pgdata.email, function(nval) {
        $scope.email = nval;
    });
});
