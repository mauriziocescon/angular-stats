var AngularStats=function(){function AngularStats($rootScope,$document,$window,$timeout){this.digestInfo={duration:"0"},this.rootScope=$rootScope,this.document=$document,this.window=$window,this.timeout=$timeout,this.startingElement="app"}return AngularStats.prototype.setStartingElement=function(element){this.startingElement=element},AngularStats.prototype.analyzeWebApp=function(){this.scopesList=[],this.watchersList=[],this.componentsInfo={},this.domElementsCount=0,this.nodeNameList={};var element=this.document.find(this.startingElement);if(!element||0==element.length)throw Error(this.startingElement+" is not a valid selector");return this.analizeScope(this.rootScope),this.detectFromElement(element),this.calculateDigestDuration(),this.composeMessage()},AngularStats.prototype.composeMessage=function(){var mex="GENERAL\n";mex+="----------------------\n",mex+="Tot scopes: "+this.scopesList.length+"\n",mex+="Tot watchers: "+this.watchersList.length+"\n",mex+="Tot DOM Elements: "+this.domElementsCount+"\n",mex+="Digest duration: "+this.digestInfo.duration+" ms \n\n",mex+="\nCOMPONENTS\n",mex+="----------------------\n";for(var name_1 in this.componentsInfo)mex+="- "+name_1.toUpperCase()+"\ns: "+this.componentsInfo[name_1].scopesCount+", w: "+this.componentsInfo[name_1].watchers.length+"\n";mex+="\n\nHTMLElement\n",mex+="----------------------\n";for(var nodeName in this.nodeNameList)mex+=nodeName+": "+this.nodeNameList[nodeName]+"\n";return mex},AngularStats.prototype.analizeScope=function(currentScope){var _this=this;if(this.scopesList.indexOf(currentScope)==-1){this.scopesList.push(currentScope);var name_2=currentScope.$ctrl?currentScope.$ctrl.name:currentScope.name?currentScope.name:"Unknown";void 0==this.componentsInfo[name_2]?this.componentsInfo[name_2]={name:name_2,scopesCount:1,watchers:[]}:this.componentsInfo[name_2].scopesCount++,angular.forEach(currentScope.$$watchers,function(watcher){_this.watchersList.indexOf(watcher)==-1&&_this.watchersList.push(watcher),_this.componentsInfo[name_2].watchers.indexOf(watcher)==-1&&_this.componentsInfo[name_2].watchers.push(watcher)}),currentScope.$$childHead&&this.analizeScope(currentScope.$$childHead),currentScope.$$childTail&&this.analizeScope(currentScope.$$childTail),currentScope.$$prevSibling&&this.analizeScope(currentScope.$$prevSibling),currentScope.$$nextSibling&&this.analizeScope(currentScope.$$nextSibling)}},AngularStats.prototype.detectFromElement=function(element){var _this=this;this.domElementsCount++,element.data().hasOwnProperty("$scope")&&this.analizeScope(element.data().$scope),angular.forEach(element.children(),function(childElement){void 0==_this.nodeNameList[childElement.nodeName]?_this.nodeNameList[childElement.nodeName]=1:_this.nodeNameList[childElement.nodeName]++,_this.detectFromElement(_this.document.find(childElement))})},AngularStats.prototype.calculateDigestDuration=function(){var _this=this,duration=0,scopePrototype=Object.getPrototypeOf(this.rootScope),angularDigest=scopePrototype.$digest;scopePrototype.$digest=function(){for(var args=[],_i=0;_i<arguments.length;_i++)args[_i-0]=arguments[_i];var start=_this.getTime();angularDigest.apply(_this.rootScope,args),duration=_this.getTime()-start,_this.digestInfo.duration=duration.toFixed(2)}},AngularStats.prototype.getTime=function(){return performance?performance.now():this.getDate().getTime()},AngularStats.prototype.getDate=function(){return new Date},AngularStats.$inject=["$rootScope","$document","$window","$timeout"],AngularStats}();angular.module("angular-stats",[]).service("AngularStats",AngularStats);