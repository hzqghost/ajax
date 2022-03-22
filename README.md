<h1>A short code JS Ajax library that supports chained calls and synchronous and asynchronous requests</h1>
<h2>一个短小的代码的 js ajax 库, 支持链式调用, 支持同步与异步请求。</h2>

#simple example (简单例子)
<pre>
var ajax = newAjax(); //once or global variable(一次使用或者设置为全局变量)
ajax.get('http://admin.client.com/api/app/menus').then( res => { console.log(res) });
ajax.post('http://admin.client.com/api/app/menus').then( res => { console.log(res) });
ajax.post('http://admin.client.com/api/app/menus').then( res => { console.log(res) }).catch( err=>{cosole.log(err) });
ajax.post('http://admin.client.com/api/app/menus',{param1:123,param2:"abc"})
    .then( res => { console.log(res) })
    .catch( err=>{ cosole.log(err) });
</pre>

synchronization (同步), not then (不使用then)
<pre>
var ajax = newAjax(); 
ajax.getWait('http://admin.client.com/api/app/menus', null, res => { console.log(res) })
ajax.postWait('http://admin.client.com/api/app/menus', {param1:123,param2:"abc"}, res => { console.log(res) })
    .catch( err=>{ cosole.log(err) });
</pre>

Customize API (定置一个自己的API)
<pre>
var api = newAjax(); //global variable(设置为全局变量)
//configuration (配置)
api.o.ext.begin = function(){
  api.o.ext.url = 'http://admin.client.com/api';
  api.o.ext.header = null; // {key1:value1,key2:value2}
  api.o.ext.params = null; // {key1:value1,key2:value2}
};

//revised data, only the data part with code is 0(修正数据,仅返回 code == 0 的 data部份)
api.o.ext.callback = function(response,o,resolve,reject){
  if(response.code == 0){
    return response.data;
  }else{
    api.error(o,reject,{code:response.code,msg:response.err, e:api.o, res:response});
    return null;
  }
};

//use with callback(与callback配合使用)
api.o.ext.then = function(response,o,resolve,reject){
  response = api.o.ext.callback(response);
  if(response!=null){
    resolve(response);
  }
};

//general error handling(通用错误处理)
api.o.ext.catch = function(err){
  if(err.code<0){
    console.error(err);
  }else{
    console.error(err.msg);
  }
};
</pre>
<pre>
api.post('/app/menus',{param1:123,param2:"abc"})
    .then( res => { console.log(res) })
</pre>

更多(more)
<pre>
var ajax = newAjax(); 
</pre>

return data type,  json or text
<pre>
ajax.dataType('text').post('http://').then();
</pre>

set header Content-type,  default is application/x-www-form-urlencoded
<pre>
ajax.contentType('application/x-www-form-urlencoded').post('http://').then();
</pre>

set header,  default null
<pre>
ajax.header({key1:'value1',key2:'value2'}).post('http://').then();
</pre>

set username,  default ''
<pre>
ajax.user('username').post('http://').then();
</pre>

set password,  default ''
<pre>
ajax.pass('password').post('http://').then();
</pre>

set timeout, valid when asynchronous, millisecond, default 90000,(异步时有效，单位毫秒)
<pre>
ajax.timeout(5000).post('http://').then();
</pre>
