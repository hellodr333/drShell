function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
};
function drag(obj){
		obj.onmousedown=function(ev){
			var oEvt=ev||event;
			//alert(obj.className);
			//老坐标
			var oldX=oEvt.clientX;
			var oldY=oEvt.clientY;
			//老宽高
			var oldW=obj.parentNode.offsetWidth;
			var oldH=obj.parentNode.offsetHeight;
			//老位置
			var oldL=obj.parentNode.offsetLeft;
			var oldT=obj.parentNode.offsetTop;
			
			var disX=oldX-oldL
			var disY=oldY-oldT;
			
			document.onmousemove=function(ev){
				var oEvt=ev||event;	
				//新坐标
				var newX=oEvt.clientX;
				var newY=oEvt.clientY;
				//判断左上下右
				if(obj.className.indexOf('l') != -1){
					//←					
					if(obj.parentNode.offsetWidth<580){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}else{
						obj.parentNode.style.left=oldL-(oldX-newX)+'px';
						obj.parentNode.style.width=oldW+(oldX-newX)+'px';
					}
					
				}
				if(obj.className.indexOf('r') != -1){
					//→
					if(obj.parentNode.offsetWidth<580){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}else{
						obj.parentNode.style.width=oldW+(newX-oldX)+'px';
					}
					
				}
				if(obj.className.indexOf('t') != -1){
					//↑	
					if(obj.parentNode.offsetHeight<380){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}else if(newY==0){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}else{
						obj.parentNode.style.height=oldH+(oldY-newY)+'px';
						obj.parentNode.style.top=oldT-(oldY-newY)+'px';
					}
					
					
				}
				if(obj.className.indexOf('b') != -1 ){
					//↓	
					if(obj.parentNode.offsetHeight<380){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}else if(newY>document.documentElement.clientHeight-8){
						document.onmousemove=document.onmouseup=null;
						obj.releaseCapture && obj.releaseCapture();
					}

					obj.parentNode.style.height=oldH+(newY-oldY)+'px';
				}
				if(obj.className.indexOf('h') != -1){


					var l=newX-disX;//计算
					var t=newY-disY;
					
					//限定
					if(l<0) l=0;
					if(t<0) t=20;
					if(l>document.documentElement.clientWidth-obj.parentNode.offsetWidth)
						l=document.documentElement.clientWidth-obj.parentNode.offsetWidth;
					if(t>document.documentElement.clientHeight-obj.parentNode.offsetHeight)
						t=document.documentElement.clientHeight-obj.parentNode.offsetHeight;

					obj.parentNode.style.left=l+'px';
					obj.parentNode.style.top=t+'px';	
				}
				
			};	
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;	
				obj.releaseCapture && obj.releaseCapture();
			};
			
			obj.setCaputure && obj.setCapture();
			return false;
		};	
};

function addEvent(obj,sType,fn){
	if(obj.addEventListener){
		obj.addEventListener(sType,fn,false);
	}else{
		obj.attachEvent('on'+sType,fn)
	}
};

function move(obj,json,optional){	
	optional=optional||{};
	optional.time=optional.time || 300;
	optional.type=optional.type || 'ease-out';
	optional.fn=optional.fn || null;
	var start={};
	var dis={};
	for (var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		dis[key]=json[key]-start[key];
	}
	var count=Math.round(optional.time/30);
	var n=0;
	clearInterval(obj.timer)
	obj.timer=setInterval(function(){
		n++;
		for(var key in json){
			switch(optional.type){
				case 'liner':
				var a=n/count;
				var cur=start[key]+dis[key]*a;
				break;
				case 'ease-in':
				var a=n/count;
				var cur=start[key]+dis[key]*a*a*a;
				break;
				case 'ease-out':
				var a=1-n/count;
				var cur=start[key]+dis[key]*(1-a*a*a);
				break;
			}
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
			}
		}

		if(n==count){
			clearInterval(obj.timer);
			optional.fn && optional.fn();
		}
	},30)
}

window.onload = function(){
	//shallbox 拖拽
	var shellBox=document.getElementById('shellBox');
	var shellHead=document.getElementById('shellHead');
	var ipt=document.getElementById('ipt');
	
	var aDrag1 = shellBox.children;
	shellBox.onclick=function(){
		ipt.focus();
	}

	drag(shellHead);
	var commomIndex = 30;
	addEvent(shellHead,'mousedown',function(){
			var arr=[];
			for(var i=0;i<aDrag1.length;i++){
				arr.push(aDrag1[i]);
			}
			console.log(arr)
			for(var j=0;j<arr.length;j++){
				num=getStyle(arr[j],'zIndex');
				arr[j].style.zIndex = parseInt(num) +parseInt(commomIndex) ;
			}
			
			shellBox.style.zIndex = parseInt(getStyle(shellBox,'zIndex')) +parseInt(commomIndex);
			commomIndex =parseInt(num) +parseInt(commomIndex);
	})

	



	//pageBox 拖拽
	var pageBox=document.getElementById('pageBox');
	var pageHead=document.getElementById('pageHead')
	var aDrag2 = pageBox.children;
	var arr2=[];
	for(var i=0;i<aDrag2.length;i++){
		arr2.push(aDrag2[i]);
	};
	arr2.pop();
	for(var i=0;i<arr2.length;i++){
		drag(arr2[i]);
	};
	addEvent(pageHead,'mousedown',function(){
			var arr=[];
			for(var i=0;i<aDrag2.length;i++){
				arr.push(aDrag2[i]);
			}
			console.log(arr)
			for(var j=0;j<arr.length;j++){
				num=getStyle(arr[j],'zIndex');
				arr[j].style.zIndex = parseInt(num) +parseInt(commomIndex) ;
			}
			
			pageBox.style.zIndex = parseInt(getStyle(pageBox,'zIndex')) +parseInt(commomIndex);
			commomIndex =parseInt(num) +parseInt(commomIndex);
	})
	// 
	
	// 放大缩小
	var oToBig=document.getElementById('toBig');
	var oToSmall=document.getElementById('toSmall');
	var oToClose=document.getElementById('toClose');

	oToBig.onclick = function(){
		pageBox.style.width = '100%';
		pageBox.style.top = '0';
		pageBox.style.left = '0';
	};
	oToSmall.onclick = function(){
		pageBox.style.width = '600px';
		pageBox.style.height = '400px';
		pageBox.style.left = '400px';
	};
	
	pageHead.ondblclick = function(){
		if(pageBox.offsetWidth>1100){
			pageBox.style.width = '600px';
			pageBox.style.height = '400px';
			pageBox.style.left = '400px';
		}else{
			pageBox.style.width = '100%';
			pageBox.style.top = '0';
			pageBox.style.left = '0';
		}	
	}



	//folders
	var oPicBox=document.getElementById('folders');
	var aLi=oPicBox.children;
	var zIndex=2;  
	var aPos=[];
	for(var i=0;i<aLi.length;i++){
		aPos.push({left:aLi[i].offsetLeft,top:aLi[i].offsetTop});
		aLi[i].style.left=aPos[i].left+'px';
		aLi[i].style.top=aPos[i].top+'px';
	}
	for(var i=0;i<aLi.length;i++){
		aLi[i].style.position='absolute';
		aLi[i].style.margin=0;
		aLi[i].index=i;
	}
	for(var i=0;i<aLi.length;i++){
		dragq(aLi[i],aLi)
	}
	function dragq(obj,listObj){
		obj.onmousedown=function(ev){
			obj.style.zIndex++;
			var oEvt=ev || event;
			var disX=oEvt.clientX-obj.offsetLeft;
			var disY=oEvt.clientY-obj.offsetTop;
			document.onmousemove=function(ev){
				var oEvt=ev || event;
				obj.style.left=oEvt.clientX-disX+'px';
				obj.style.top=oEvt.clientY-disY+'px';
				for(var i=0;i<listObj.length;i++){				
					listObj[i].style.borderColor='black';
				}
				var nearObj=findNearest(obj,listObj);
				if(nearObj){
					nearObj.style.borderColor='red';
				}
			}
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;
				var nearObj=findNearest(obj,listObj)
				if(nearObj){
					move(nearObj,aPos[obj.index]);
					move(obj,aPos[nearObj.index]);
					nearObj.style.borderColor='black';
					var tem;
					tem=obj.index;
					obj.index=nearObj.index;
					nearObj.index=tem;
				}else{
					move(obj,aPos[obj.index],{time:1000});
				}

				obj.releaseCapture && obj.releaseCapture();
			}
			obj.setCapture && obj.setCapture();
			return false;
		}
	}
	function collTest(obj1,obj2){
		var l1=obj1.offsetLeft;
		var t1=obj1.offsetTop;
		var r1=obj1.offsetLeft+obj1.offsetWidth;
		var b1=obj1.offsetTop+obj1.offsetHeight;
		
		var l2=obj2.offsetLeft;
		var t2=obj2.offsetTop;
		var r2=obj2.offsetLeft+obj2.offsetWidth;
		var b2=obj2.offsetTop+obj2.offsetHeight;
		
		if(l1>r2 || t1>b2 || r1<l2 || b1<t2){
			//没撞到	
			return false;
		}else{
			//撞到
			return true;
		}
	}
	function findNearest(obj,listObj){
		var minDis=999999999999;
		var minDisIndex=-1;
		for(var i=0;i<listObj.length;i++){
			if(obj==listObj[i]) continue;
			if(collTest(obj,listObj[i])){
				var dis=getDis(obj,listObj[i]);
				if(dis<minDis)
					minDis=dis;
					minDisIndex=i;
			}
		}
		if(minDisIndex==-1){
			return null;
		}else{
			return listObj[minDisIndex];
		}
	}

	function getDis(obj1,obj2){
		var a=obj2.offsetTop-obj1.offsetTop;
		var b=obj2.offsetLeft-obj1.offsetLeft;
		return  Math.sqrt(a*a+b*b);
	}
}