///////////////////////////
//       UI Toolbox      //
///////////////////////////
//
//  Description : Reusable DOM manipulation functions.
//   Written by : Francois Oligny-Lemieux
// Date Created : 02.Nov.2014
//     Modified : 22.Nov.2014 (added jsonp request, added [data-template])
// 
// Browser support : 
//  DOM manipulations: IE8+, Firefox 1.5+, Chrome, Safari
//  HTML5: IE9+, Firefox 22+, Chrome 15.
//
// TODO: Write fallback to querySelector for IE6 & IE7
//
//////////////////////////////////////////////////////
"use strict";
define(function (require) {
		
	function Toolbox() {
		if (console) console.log("WARNING: You do not need to call new Toolbox(). You can use it directly, e.g., Toolbox.addClass(...)");
	}

	// Reason to be: Javascript native reduce() function does *not* work for an array with a single element
	// elements is an array[]
	// joinure is a string, like ","
	// getter is a function, like function(el) { return el.id; }
	Toolbox.reduce = function(elements, joinure, getter)
	{
		var reduced = "";
		for (var i=0; i<elements.length; i++)
		{
			if (i>0) reduced += joinure;
			
			if (getter != null)
			{	reduced += getter(elements[i]);
			}
			else
			{	reduced += elements[i];
			}
		}
		return reduced;
	};
	
	Toolbox.addClass = function(el, className)
	{
		if (el == null)
		{	if (console) console.log("ERROR: Toolbox.addClass with null element");
			return;
		}
		
		if (el.length == null || el.value != null) { el = [el] };
		
		Toolbox.removeClass(el, className);
		for (var i=0; i<el.length; i++)
		{
			el[i].className += " " + className;
		}
	};
	
	Toolbox.removeClass = function(el, className)
	{
		if ( el == null )
		{	if (console) console.log("Called removeClass with null element");
			if (console) console.trace();
			return;
		}
		
		if (el.length == null || el.value != null) { el = [el] };
		
		for (var i=0; i<el.length; i++)
		{
			var singleEl = el[i];
			if (singleEl.className == null )
			{
				return;
			}
			var src = singleEl.className.split(" ");
			var dst = new Array();
			for (var j=src.length; j>0;)
			{
				if (src[--j] != className)
				{
					dst[dst.length] = src[j];
				}
			}
			singleEl.className = dst.join(" ");
		}
	};
	
	Toolbox.hasClass = function(el, className)
	{
		if ( el == null || el.className == null )
		{
			return null;
		}
		var classes = el.className.split(" ");
		for (var i=classes.length; i>0;)
		{
			if (classes[--i] == className)
			{
				return true;
			}
		}
		return false;
	};
	
	Toolbox.toggleClass = function(el, className)
	{
		if (Toolbox.hasClass(el, className) === true)
		{	Toolbox.removeClass(el, className);
		}
		else
		{	Toolbox.addClass(el, className);
		}
	};
	
	// Returns single element or null
	Toolbox.get = Toolbox.getElement = function(selector, parent)
	{
		// IE8 does not support querySelector with spaces, i.e. hierarchical selections
		if (parent != null)
		{	return parent.querySelector(selector);
		}
		return document.querySelector(selector);
	};
	
	// Returns array[]
	Toolbox.getAll = Toolbox.getAllElements = function(selector, parent)
	{
		// IE8 does not support querySelectorAll with spaces, i.e. hierarchical selections
		if (parent != null)
		{
			if (typeof parent.querySelectorAll == "undefined")
			{
				if (console) console.log("parent.querSelectorAll is invalid for selector:" + selector);
				if (console) console.trace();
			}
			return Array.prototype.slice.call(parent.querySelectorAll(selector));
		}
///		return document.querySelectorAll(selector);
		
		return Array.prototype.slice.call(document.querySelectorAll(selector));
	};
	
	// Returns array[]
	Toolbox.getElementsByClass = function(className, parent)
	{
		parent || (parent=document);
		var descendants = parent.getElementsByTagName('*');
		var i = -1;
		var e, results = [];
		while ( e=descendants[++i] ) 
		{	// push all descendants that have class
			((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) && results.push(e);
		}
		return results;
	};
	
	// Returns attribute, or null if no attributes
	// Returns undefined on error => error will be printed in console.
	Toolbox.getAttribute = function(el, attributeName)
	{
		if ( el == null )
		{	if (console) console.log("Called getAttribute with null element");
			if (console) console.trace();
			return;
		}
		if ( el.attributes == null )
		{	if (console) console.log("Called getAttribute with invalid element that does not have attributes");
			if (console) console.trace();
			return;
		}
		
		if (typeof el.getAttribute == "function") 
		{	return el.getAttribute(attributeName);
		}
		
		for (var i=0; i<el.attributes.length; i++)
		{
			if (el.attributes[i].nodeName == attributeName)
			{
				return el.attributes[i].value;
			}
		}
		
		return null;
	};
	
	// Returns undefined on error => error will be printed in console.
	Toolbox.setAttribute = function(el, attributeName, value)
	{
		if ( el == null )
		{	if (console) console.log("Called getAttribute with null element");
			if (console) console.trace();
			return;
		}
		if ( el.attributes == null )
		{	if (console) console.log("Called getAttribute with invalid element that does not have attributes");
			if (console) console.trace();
			return;
		}
		
		if (typeof el.setAttribute == "function")
		{
			el.setAttribute(attributeName, value);
			
			// test to see if it worked
			
			var testValue = el.getAttribute(attributeName);
			if (testValue != value) // use lax compare because it is converted to string in DOM
			{
				if ( el.attributes == null )
				{	if (console) console.log("ERROR: Failure to setAttribute and retrieve back value");
					return;
				}
			}
		}
		else
		{
			// fallback for older browsers
			el[attributeName] = value;
		}
		
		return true;
	};
	
	// T.onEvent(eventName, el, f_callback)
	// Returns on success: Array of function to call to unbind
	// Returns on error: undefined on error if input element is null or undefined.
	Toolbox.onEvent = function(eventName, el, callback)
	{
		var unbinders = [];
		
		if (el == null)
		{	if (console) console.log("ERROR: Toolbox.onEvent with null element");
			return;
		}
		
		if (el.length == null || el.value != null) { el = [el] };
		
		for (var i=0; i<el.length; i++) 
		{
			var singleEl = el[i];
			
			if (singleEl.attachEvent) //Internet Explorer
			{
				var createHandler = function(scopedElement)
				{
					return function(event)
					{	
						event.currentTarget = scopedElement; // this fixes any bubbling issue with IE where srcElement is not the element bound to the click handler.
						callback.call(scopedElement, event);
					};
				};
				
				var handler = createHandler(singleEl);
				singleEl.attachEvent("on"+eventName, handler); 
				
				var f_unbind = function(_el, _eventName, _handler)
				{	return function()
					{	_el.detachEvent("on"+_eventName, _handler); 
					};
				};
				unbinders.push(f_unbind(singleEl, eventName, handler));
			}
			else if (singleEl.addEventListener) //Firefox & company
			{	singleEl.addEventListener(eventName, callback, false); //don't need the 'call' trick because in FF everything already works in the right way
				
				// creating a scope to capture element (otherwise it wont work)
				var f_unbind = function(_el, _eventName, _callback)
				{	return function()
					{
						_el.removeEventListener(_eventName, _callback, false);
					};
				};
				unbinders.push(f_unbind(singleEl, eventName, callback));
			}
			else {
				singleEl["on"+eventName] = callback;
				var f_unbind = function(_el, _eventName)
				{	return function()
					{	_el["on"+_eventName] = null;
					};
				};
				unbinders.push(f_unbind(singleEl, eventName));
			}
		}
		
		return unbinders;
	};
	
	Toolbox.onClick = function(el, callback)
	{
		return Toolbox.onEvent("click", el, callback);
	};
	Toolbox.onChange = function(el, callback)
	{
		return Toolbox.onEvent("change", el, callback);
	};
	Toolbox.onSelectChange = function(el, callback)
	{
		var unbinders = Toolbox.onEvent("keyup", el, callback);
		unbinders.push.apply(unbinders, Toolbox.onEvent("change", el, callback));
		return unbinders;
	};
	
	Toolbox.Replace = function (html, model)
	{	
		while (1)
		{
			var nextLogic = html.indexOf("%%if");
			var nextLoop = html.indexOf("%%loop");
			if (nextLoop > 0 && (nextLogic > nextLoop || nextLogic == -1))
			{	// loop first
				var loop = html.match(/%%loop ?\( ?(((?!%%).)*) ?\) ?%%(((?!%%end%%)[\S\s])*)%%end%%/);
				if(loop && loop.length && loop.length >= 5)
				{
					var myArray = model[loop[1]];
					if (Object.prototype.toString.call(model[loop[1]]) === '[object Array]')
					{
						var chunks = "";
						for (var level2 in model[loop[1]])
						{
							var chunk = Toolbox.Replace(loop[3], model[loop[1]][level2]);
							chunks += chunk;
						}
						html = html.replace(loop[0], chunks);
					}
					else
					{	html = html.replace(loop[0], "");
					}
				}
			}
			
			var logic = html.match(/%%if ?(((?!%%).)*)%%(((?!%%endif%%).)*)%%endif%%/);
			if(logic && logic.length && logic.length >= 5)
			{
				logic[1] = logic[1].replace(/&amp;/g, "&");
				var result = eval(logic[1]);
				if(result)
				{
					var chunk = Toolbox.Replace(logic[3], model);
					html = html.replace(logic[0], chunk);
				}
				else
				{  html = html.replace(logic[0], "");
				}
			}
			else
			{
				nextLoop = html.indexOf("%%loop");
				if (nextLoop == -1)
				{	break;
				}
			}
		}
		
		html = Toolbox.ReplacePlain(html, model); // after handling and removing logic blocks, parse everything
		return html;
	};

	// Replace model in HTML string
	// Targets on %%variable-name%%
	// Suports array %%cities[0].temperature%%
	Toolbox.ReplacePlain = function(html, model, base)
	{
		var regex;
		if (base == null) base = "";
		
		for (var item in model)
		{
			if (typeof model[item] == "function")
			{	// skip functions
			}
			else if (Object.prototype.toString.call( model[item] ) === '[object Array]')
			{
				for (var iterator in model[item])
				{
					html = Toolbox.ReplacePlain(html, model[item][iterator], base+item+"\\["+iterator+"\\]\\.");
				}
			}
			else if (typeof model[item] == "object")
			{
				html = Toolbox.ReplacePlain(html, model[item], base+item+"\\.");
			}
			else
			{
				regex = new RegExp("%%"+base+item+"%%", "g"); // the "g" is important to replace all
				html = html.replace(regex, model[item]);
			}
		}
		return html;
	};
	
	// Replaces using innerHTML on existing DOM elements
	// Targets on attributes data-target="model-variable-name" and data-template="templateName"
	Toolbox.ReplaceInPlace = function(rootEl, model, base)
	{
		var regex;
		if (base == null) base = "";
		
		for (var item in model)
		{
			if (typeof model[item] == "function")
			{	// skip functions
			}
			else if (Object.prototype.toString.call( model[item] ) === '[object Array]')
			{
				for (var iterator in model[item])
				{
					Toolbox.ReplaceInPlace(rootEl, model[item][iterator], base+item+"\\["+iterator+"\\]\\.");
				}
			}
			else if (typeof model[item] == "object")
			{
				Toolbox.ReplaceInPlace(rootEl, model[item], base+item+"\\.");
			}
			else
			{
				var dataQuery = "data-target=\""+base+item;
				var elements = Toolbox.getAllElements("["+dataQuery+"\"]", rootEl);
				if (elements.length > 0)
				{
					Toolbox.innerHTML(elements, model[item]);
				}
			}
		}
	};
	
	Toolbox.innerHTML = function(el, value)
	{
		if (el == null)
		{	if (console) console.log("ERROR: Toolbox.innerHTML with null element");
			return;
		}
		
		if (el.length == null || el.value != null) { el = [el] };
		
		for (var i=0; i<el.length; i++) 
		{
			var singleEl = el[i];
			singleEl.innerHTML = value;
		}
		
		return el;
	};
	
	Toolbox.jsonp = function(url, f_callback)
	{
		var head = document.head || document.documentElement;
		var script = document.createElement("script");
		script.async = true;
		script.charset = "utf-8";
		script.callbackName = "uiToolbox" + (Math.random() * 12).toString().replace(".", "");
		
		var existingCallbackFunc = url.match(/callback=([^&]*)/);
		if (existingCallbackFunc)
		{
			// caller already had function, do nothing
			script.callbackName = existingCallbackFunc; // just for info
		}
		else
		{
			// append callback=XXXXXX to URL
			if (url.indexOf("?") == -1) { url += "?"; }
			else { url += "&"; }
			url += "callback=" + script.callbackName;
			
			window[ script.callbackName ] = function(value)
			{
				f_callback(value);
			};
			
			setTimeout(function()
			{	// clear window callback to prevent leaks
				if (script == null)
				{	// we were already cleaned
					return;
				}
				window[ script.callbackName ] = null;
			}, 30000);		
		}
		
		script.src = url;
		
		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function()
		{
			if (!script.readyState || /loaded|complete/.test(script.readyState)) 
			{
				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;

				// Remove the script
				if (script.parentNode)
				{	script.parentNode.removeChild(script);
				}
				
				window[ script.callbackName ] = null;	
				
				// Dereference the script
				script = null;
			}
		};
		
		script.abort = function()
		{
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;

			// Remove the script
			if (script.parentNode)
			{	script.parentNode.removeChild(script);
			}
			
			window[ script.callbackName ] = null;
				
			// Dereference the script
			script = null;
		};

		head.insertBefore(script, head.firstChild);
	};
	
	/// does not include element in search
	Toolbox.closest = function(el, selector) 
	{
	    var matchesFn;
	
	    // find vendor prefix
	    ['matches','webkitMatchesSelector','mozMatchesSelector',
	     'msMatchesSelector','oMatchesSelector'].some(function(fn) {
	        if (typeof document.body[fn] == 'function') {
	            matchesFn = fn;
	            return true;
	        }
	        return false;
	    })
	
	    // traverse parents
	    while (el!==null) 
	    {
	        parent = el.parentElement;
	        if (parent!==null && parent[matchesFn](selector)) 
	        {
	            return parent;
	        }
	        
	        // test decendants of parent (including siblings)
	        var test = Toolbox.get(selector, parent);
	        if (test !== null)
	        {
	        		return test;
	        }
	        el = parent;
	    }
	
	    return null;
	};


			
			var mingleSingle = function(key, value, model)
			{
				if (key.length > 0 && key.indexOf(".") > 0)
				{
					//console.log("mingling "+key);
					var parts = key.split(".");
					if (parts == null || parts.length <= 1)
						return;
					var subset = (typeof model.get == "function") ? model.get([parts[0]]) : model[parts[0]];
					if (parts.length === 2)
					{
						subset[parts[1]] = value;
					}
					else if (parts.length > 2)
					{
						var newKey = key.substring(parts[0].length+1);
						mingleSingle(newKey, value, subset);
					}
				}
			};
			// mingle settings
			var mingle = function(settings, model)
			{
				for (var key in settings)
				{
					if (key.length > 0 && key.indexOf(".") > 0)
					{
						//console.log("mingling "+key);
						var parts = key.split(".");
						if (parts.length === 2)
						{
							var subset = model.get([parts[0]]);
							subset[parts[1]] = settings[key];
						}
						else if (parts.length > 2)
						{
							var subset = model.get([parts[0]]);
							var newKey = key.substring(parts[0].length+1);
							mingleSingle(newKey, settings[key], subset);
						}
					}
				}
			};
			/*self.settings["config.test.c"] = "";
			self.settings["config.test.third.smack"] = "";
			mingle(self.settings, this.model);
			*/

	//////////////////////////////////////////
	// MIT license. Code from MooTools begins
	//////////////////////////////////////////
	// Array & Object cloning, Object merging and appending
	
	var typeOf = Toolbox.typeOf = function(item){
		if (item == null) return 'null';
	
		if (item.nodeName){
			if (item.nodeType == 1) return 'element';
			if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
		} else if (typeof item.length == 'number'){
			if ('callee' in item) return 'arguments';
			if ('item' in item) return 'collection';
		}
	
		return typeof item;
	};

	Toolbox.cloneArray = function(myArray) 
	{
		var i = myArray.length, clone = new Array(i);
		while (i--) clone[i] = cloneOf(myArray[i]);
		return clone;
	};
	
	var cloneOf = function(item){
		switch (typeOf(item)){
			case 'array': return Toolbox.cloneArray(item);
			case 'object': return Toolbox.clone(item);
			default: return item;
		}
	};
		
	var mergeOne = function(source, key, current){
		switch (typeOf(current)){
			case 'object':
				if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
				else source[key] = Toolbox.clone(current);
			break;
			case 'array': source[key] = Toolbox.cloneArray(current); break;
			default: source[key] = current;
		}
		return source;
	};
	
	// Returns merged set
	// Input: either T.merge(source, key, value)
	// Input: either T.merge(source, {})
	Toolbox.merge = function(source, k, v)
	{
			if (typeOf(k) == 'string') return mergeOne(source, k, v);
			for (var i = 1, l = arguments.length; i < l; i++){
				var object = arguments[i];
				for (var key in object) mergeOne(source, key, object[key]);
			}
			return source;
	};
	
	Toolbox.clone = function(object)
	{
		var clone = {};
		for (var key in object) clone[key] = cloneOf(object[key]);
		return clone;
	};
	
	Toolbox.append = function(original)
	{
			for (var i = 1, l = arguments.length; i < l; i++){
				var extended = arguments[i] || {};
				for (var key in extended) original[key] = extended[key];
			}
			return original;
	};
		
	//////////////////////////////////////////			
	// MIT license. Code from MooTools ends
	//////////////////////////////////////////

	
Toolbox.getOffset = function(element)
{
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });
};
	return Toolbox;
});

