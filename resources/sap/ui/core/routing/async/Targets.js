/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";return{display:function(t,d,T){var s=Promise.resolve();return this._display(t,d,T,s);},_display:function(t,d,T,s,a){var b=this,v=[];if(!Array.isArray(t)){t=[t];}this._attachTitleChanged(t,T);return t.reduce(function(p,c){var o=c;if(typeof c==="string"){o={name:c};}var e={afterCreate:a,prefix:o.prefix};return b._displaySingleTarget(o,d,p,e).then(function(V){V=V||{};V.targetInfo=o;v.push(V);});},s).then(function(){return v;});},_displaySingleTarget:function(t,d,s,T){var n=t.name,o=this.getTarget(n);if(o!==undefined){return o._display(d,s,T);}else{var e="The target with the name \""+n+"\" does not exist!";L.error(e,this);return Promise.resolve({name:n,error:e});}}};});
