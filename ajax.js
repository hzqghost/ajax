/**author:313143468@qq.com */
function newAjax(){
	return {
		o:{
			dataType:'json',method:'POST',contentType:'application/x-www-form-urlencoded',
			header:null,async:true,url:'',user:'',pass:'',params:null,timeout:90000,
			ext:{url:'',header:null,params:null,then:null,catch:null,callback:null,}
		},
		dataType(v){ this.o.dataType=v;return this; },
		contentType(v){ this.o.contentType=v;return this; },
		header(v){ this.o.header=v;return this; },
		user(v){ this.o.user=v;return this; },
		pass(v){ this.o.pass=v;return this; },
		timeout(v){ this.o.timeout=v;return this; },
		get(url,params=null){
			this.o.async = true; this.o.method = 'GET';this.o.url = url;this.o.params = params;
			return this.exec(this.o);
		},
		getWait(url,params,callback){
			if(typeof(callback)==='undefined'){
				console.error('getWait need a function callback'); 
				return null;
			}
			this.o.async = false;this.o.method = 'GET';this.o.url = url;this.o.params = params;
			return this.exec(this.o,callback);
		},
		post(url,params=null){
			this.o.async = true; this.o.method = 'POST';this.o.url = url;this.o.params = params;
			return this.exec(this.o);
		},
		postWait(url,params,callback){
			if(typeof(callback)==='undefined'){
				console.error('postWait need a function callback');
				return null;
			}
			this.o.async = false;this.o.method = 'POST';this.o.url = url;this.o.params = params;
			return this.exec(this.o,callback);
		},
		raw(v){
			if(!v) return null;
			var a = [];
			if(v.constructor == Array)
				for (var i=0;i<v.length;i++) a.push(v[i].name + "=" + encodeURIComponent(v[i].value));
			else
				for(var i in v) a.push(i + "=" + encodeURIComponent(v[i]));
			return a.join("&");
		},
		error:function(o,resolve,err){
			o.ext.catch ? o.ext.catch(err) : resolve(err);
		},
		exec(o,callback){
			if(typeof(callback)==='undefined') callback = null;
			var self = this;
			var ref = {resolve:null,reject:null};
			var promise = new Promise((resolve, reject) => { ref.resolve = resolve; ref.reject = reject; });
			if(o.ext.begin)  o.ext.begin();
			if(o.ext.url)    o.url = o.ext.url + o.url;
			if(o.ext.header) o.header = (o.header) ? {...o.ext.header,...o.header} : o.ext.header;
			if(o.ext.params) o.params = (o.params) ? {...o.ext.params,...o.params} : o.ext.params;
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			try{
				var url = o.url;
				if(o.method=='GET' && o.params) url = url + ((url.indexOf('?')===-1)?'?':'&') + this.raw(o.params);
				xhr.open(o.method, url, o.async,o.user, o.pass);
				if(o.async){
					xhr.timeout = o.timeout;
					xhr.ontimeout = function (e) {
						self.error(o,ref.reject,{code:-4,msg:'ajax timeout:'+o.timeout, e:o, res:''});
					};
				}
				xhr.addEventListener('error', function handleEvent(e) {
					self.error(o,ref.reject,{code:-4,msg:'ajax error type:'+e.type +', loaded:'+ e.loaded, e:o, res:''});
				});
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status == 200 || xhr.status == 0) {
							var response = xhr.responseText;
							if(o.dataType =='json'){
								try{
									response = eval("(" + response + ")");
								}catch(e){
									self.error(o,ref.reject,{code:-5,msg:'json format or url is error', e:o, text:response});
									return;
								}
							}
							if(callback){
								if(o.ext.callback) response = o.ext.callback(response,o,ref.resolve,ref.reject);
								callback(response);
							}else{
								o.ext.then ? o.ext.then(response,o,ref.resolve,ref.reject) : ref.resolve(response);
							}
						}else{
							self.error(o,ref.reject,{code:-3,msg:'ajax http status is error:'+xhr.status, e:o, res:''});
						}
					}
				};
				if(o.method == 'POST') xhr.setRequestHeader('Content-type', o.contentType);
				for(var k in o.header) xhr.setRequestHeader(k, o.header[k]); 
				try{
					(o.method=='POST') ? xhr.send(this.raw(o.params)) : xhr.send();
				}catch(e){
					this.error(o,ref.reject,{code:-2,msg:'ajax send error', e:o, res:''});
				}
			}catch(e){
				this.error(o,ref.reject,{code:-1,msg:'ajax create XMLHttpRequest error', e:o, res:''});
			}
			return promise;
		},
	};
};