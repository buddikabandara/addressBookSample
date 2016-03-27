'use strict';

sample_AddressBook.directive('addressBookScroll', function() {
	return {
		scope : {},
        link:function(scope, element) {
			var w = angular.element(window);
			scope.elm = element;
	
			scope.getWindowDimensions = function () {
				return {
					'h': (window.innerHeight || document.documentElement.clientHeight),
					'w': (window.innerWidth || document.documentElement.clientWidth)
				};
			};
			
			scope.offsetTop = function() {
				return element.offset().top;
			}
			scope.$watch(scope.offsetTop, function(val){
				var maxHeight = scope.getWindowDimensions().h - val;
				var maxWidth = scope.getWindowDimensions().w;
				scope.elm.css('max-height', maxHeight + 'px').css('max-width', maxWidth + 'px').css('height', maxHeight + 'px');
			});
	
			scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
				var maxHeight = newValue.h - element.offset().top;
				scope.elm.css('max-height', maxHeight + 'px').css('max-width', newValue.w + 'px').css('height', maxHeight + 'px');
			}, true);
			
			w.bind('resize', function () {
				scope.$apply();
			});
		}
	};
});