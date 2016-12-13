
var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$sce){
	var shellBox=angular.element(document.getElementById('shellBox'));
	var oldMsgBox=document.getElementById('oldMsgBox');

	$scope.source = '';
	$scope.toWhere = '';
	$scope.bShow = false;
	$scope.isShow = function(){
		return $scope.bShow; 
	};
	//文件夹
	$scope.folderJson = [
							{src:'images/picswall/6.png',url:'http://hellodr333.github.io/form-validate/',title:'store'},
							{src:'images/picswall/6.png',url:'http://hellodr333.github.io/form-validate/',title:'CSS'},
							{src:'images/picswall/6.png',url:'http://hellodr333.github.io/form-validate/',title:'app'},
							{src:'images/picswall/6.png',url:'http://hellodr333.github.io/form-validate/',title:'Work'},
							{src:'images/picswall/6.png',url:'http://hellodr333.github.io/form-validate/',title:'info'},
						] ;

	// 命令行
	$scope.keypPress = function($event){
		var oldMsgBox = document.getElementById('oldMsgBox');	
		var bFind = false;	
		if($event.charCode==13){
			for(var i=0;i<$scope.folderJson.length;i++){
				if($scope.source == $scope.folderJson[i].title){
					bFind = true;
					$scope.bShow = true;
					$scope.toWhere = $scope.folderJson[i].url;
					$scope.toWhere = $sce.trustAsResourceUrl($scope.toWhere);
					shellBox.css('right','0');
					oldMsgBox.innerHTML+='<div><p>自然的卷卷@LAPTOP-VLJVB4J8</p><div>&nbsp;&nbsp;<span>$</span>'+$scope.folderJson[i].title+'</div></div>';
					console.log(oldMsgBox.innerHTML)
					$scope.source = '';
					$scope.folderJson[i].src = 'images/picswall/'+i+'.png';
					
				}
			}	
			if(!bFind){
				oldMsgBox.innerHTML+='<div><p>自然的卷卷@LAPTOP-VLJVB4J8</p><div><span>&nbsp;$&nbsp;'+$scope.source+'</span></div><div>&nbsp;bash: '+$scope.source+': command not found</div></div>';
				$scope.source = '';
			}
			
		}

		/* */

	};


	//文件夹打开文件
	$scope.showFromFolder = function(whichOne){
		$scope.bShow = true;
		$scope.toWhere = $scope.folderJson[whichOne].url;
		$scope.toWhere=$sce.trustAsResourceUrl($scope.toWhere);
		$scope.folderJson[whichOne].src = 'images/picswall/'+whichOne+'.png';
	};

	$scope.changeShow = function(){
		$scope.bShow = false;
	};

})