/**
* qg Ajax
*/
function createAjaxObject(){
	return {
		options:{
			dataType:'json', //json or text
			method:'POST',
			contentType:'application/x-www-form-urlencoded',
			header:null,
			async:true,
			url:'',
			username:'',
			password:'',
			params:null,
			timeout:120 * 1000,
			ext:{
				url:'',
				header:null,
				params:null,
				then:null,
				catch:null,
				callback:null,
			}
		},
		dataType(value){this.options.dataType=value;return this;},
		contentType(value){this.options.contentTyp=value;return this;},
		header(value){this.options.header=value;return this;},
		username(value){this.options.username=value;return this;},
		password(value){this.options.password=value;return this;},
		timeout(value){this.options.timeout=value;return this;},
		get(url,params=null){
			this.options.async = true; this.options.method = 'GET';this.options.url = url;this.options.params = params;
			return this.exec(this.options);
		},
		getWait(url,params,callback){
			if(typeof(callback)==='undefined'){
				console.error('getWait need a function callback');
				return null;
			}
			this.options.async = false;this.options.method = 'GET';this.options.url = url;this.options.params = params;
			return this.exec(this.options,callback);
		},
		post(url,params=null){
			this.options.async = true; this.options.method = 'POST';this.options.url = url;this.options.params = params;
			return this.exec(this.options);
		},
		postWait(url,params,callback){
			if(typeof(callback)==='undefined'){
				console.error('postWait need a function callback');
				return null;
			}
			this.options.async = false;this.options.method = 'POST';this.options.url = url;this.options.params = params;
			return this.exec(this.options,callback);
		},
		//json to &
		raw(data){
			if(!data) return null;
			var a = [];
			if (data.constructor == Array) {
				for (var i = 0; i < data.length; i ++) {
					a.push(data[i].name + "=" + encodeURIComponent(data[i].value));
				}
			} else {
				for (var i in data) {
					a.push(i + "=" + encodeURIComponent(data[i]));
				}
			}
			return a.join("&");
		},
		error:function(options,resolve,err){
			if(options.ext.catch){
				options.ext.catch(err);
			}else{
				resolve(err);
			}
		},
		exec(options,callback){
			var self = this;
			if(typeof(callback)==='undefined') callback = null;
			var ref = {resolve:null,reject:null};
			var promise = new Promise((resolve, reject) => {
				ref.resolve = resolve;
				ref.reject = reject;
			});
			if(options.ext.begin){
				options.ext.begin();
			}
			if(options.ext.url){
				options.url = options.ext.url + options.url;
			}
			if(options.ext.header){
				if(options.header){
					options.header = {...options.ext.header,...options.header};
				}else{
					options.header = optons.apiHeader;
				}
			}
			if(options.ext.params){
				if(options.params){
					options.params = {...options.ext.params,...options.params};
				}else{
					options.params = options.ext.params;
				}
			}
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			try{
				xhr.open(options.method, options.url, options.async,options.username, options.password);
				if(options.async){
					xhr.timeout = options.timeout;
					xhr.ontimeout = function (e) {
						self.error(options,ref.reject,{code:-4,msg:'ajax timeout:'+options.timeout, e:options, res:''});
					};
				}
				xhr.addEventListener('error', function handleEvent(e) {
					self.error(options,ref.reject,{code:-4,msg:'ajax error type:'+e.type +', loaded:'+ e.loaded, e:options, res:''});
				});
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status == 200 || xhr.status == 0) {
							if(options.dataType =='json'){
								try{
									response = eval("(" + xhr.responseText + ")");
								}catch(e){
									self.error(options,ref.reject,{code:-5,msg:'json format or url is error', e:options, text:xhr.responseText});
									return;
								}
							}else{
								response = xhr.responseText;
							}
							if(callback){
								if(options.ext.callback){
									response = options.ext.callback(response,options,ref.resolve,ref.reject);
								}
								callback(response);
							}else{
								if(options.ext.then){
									options.ext.then(response,options,ref.resolve,ref.reject);
								}else{
									ref.resolve(response);
								}
							}
						}else{
							self.error(options,ref.reject,{code:-3,msg:'ajax http status is error:'+xhr.status, e:options, res:''});
						}
					}
				};
				if(options.method == 'POST'){
					xhr.setRequestHeader('Content-type', options.contentType);  //POST设置为表单方式提交
				}
				for(var k in options.header){
					xhr.setRequestHeader(k, options.header[k]); 
				}
				try{
					xhr.send(this.raw(options.params));
				}catch(e){
					this.error(options,ref.reject,{code:-2,msg:'ajax send error', e:options, res:''});
				}
			}catch(e){
				this.error(options,ref.reject,{code:-1,msg:'ajax create XMLHttpRequest error', e:options, res:''});
			}
			return promise;
		},
	};
};