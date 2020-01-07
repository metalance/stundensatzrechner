/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/base/ManagedObject','./IconTabBarRenderer','./IconTabHeader',"sap/ui/thirdparty/jquery"],function(l,C,M,I,a,q){"use strict";var b=l.IconTabHeaderMode;var B=l.BackgroundDesign;var c=l.IconTabDensityMode;var d=C.extend("sap.m.IconTabBar",{metadata:{interfaces:["sap.m.ObjectHeaderContainer","sap.f.IDynamicPageStickyContent"],library:"sap.m",properties:{showSelection:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},expandable:{type:"boolean",group:"Misc",defaultValue:true},expanded:{type:"boolean",group:"Misc",defaultValue:true},selectedKey:{type:"string",group:"Data",defaultValue:null},upperCase:{type:"boolean",group:"Appearance",defaultValue:false},stretchContentHeight:{type:"boolean",group:"Appearance",defaultValue:false},applyContentPadding:{type:"boolean",group:"Appearance",defaultValue:true},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:B.Solid},headerMode:{type:"sap.m.IconTabHeaderMode",group:"Appearance",defaultValue:b.Standard},showOverflowSelectList:{type:"boolean",group:"Appearance",defaultValue:false},headerBackgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:B.Solid},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false},tabDensityMode:{type:"sap.m.IconTabDensityMode",group:"Appearance",defaultValue:c.Cozy}},aggregations:{items:{type:"sap.m.IconTab",multiple:true,singularName:"item",forwarding:{getter:"_getIconTabHeader",aggregation:"items",forwardBinding:true}},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},_header:{type:"sap.m.IconTabHeader",multiple:false,visibility:"hidden"}},events:{select:{parameters:{item:{type:"sap.m.IconTabFilter"},key:{type:"string"},selectedItem:{type:"sap.m.IconTabFilter"},selectedKey:{type:"string"}}},expand:{parameters:{expand:{type:"boolean"},collapse:{type:"boolean"}}}},designtime:"sap/m/designtime/IconTabBar.designtime"}});d.prototype.setExpanded=function(e){this.setProperty("expanded",e,true);if(this.$().length){this._toggleExpandCollapse(e);}return this;};d.prototype.setExpandable=function(e){this.setProperty("expandable",e,true);return this;};d.prototype.setHeaderMode=function(m){this.setProperty("headerMode",m,true);this._getIconTabHeader().setMode(m);return this;};d.prototype.setTabDensityMode=function(m){this.setProperty("tabDensityMode",m);this._getIconTabHeader().setTabDensityMode(m);return this;};d.prototype.setHeaderBackgroundDesign=function(h){this.setProperty("headerBackgroundDesign",h,true);this._getIconTabHeader().setBackgroundDesign(h);return this;};d.prototype.setShowOverflowSelectList=function(v){this.setProperty("showOverflowSelectList",v,true);this._getIconTabHeader().setShowOverflowSelectList(v);return this;};d.prototype.setEnableTabReordering=function(v){this.setProperty("enableTabReordering",v,true);this._getIconTabHeader().setEnableTabReordering(v);return this;};d.prototype._rerenderContent=function(o){var $=this.$("content");if(o&&($.length>0)){var r=sap.ui.getCore().createRenderManager();for(var i=0;i<o.length;i++){r.renderControl(o[i]);}r.flush($[0]);r.destroy();}};d.prototype._toggleExpandCollapse=function(e){var $=this.$("content");var s=this._getIconTabHeader().oSelectedItem;if(e===undefined){e=!this.getExpanded();}if(s){s.$().toggleClass("sapMITBSelected",e);s.$().attr({'aria-expanded':e});if(e){s.$().attr({'aria-selected':e});}else{s.$().removeAttr('aria-selected');}}this._iAnimationCounter=(this._iAnimationCounter===undefined?1:++this._iAnimationCounter);if(e){if(s){if(this.$("content").children().length===0){var S=s.getContent();if(S.length>0){this._rerenderContent(S);}else{this._rerenderContent(this.getContent());}}$.stop(true,true).slideDown('400',q.proxy(this.onTransitionEnded,this,e));this.$("containerContent").toggleClass("sapMITBContentClosed",!e);}}else{this.$("contentArrow").hide();$.stop(true,true).slideUp('400',q.proxy(this.onTransitionEnded,this,e));}if(!e||s){this.setProperty("expanded",e,true);}this.fireExpand({expand:e,collapse:!e});return this;};d.prototype.onTransitionEnded=function(e){var $=this.$("content"),f=this.$("containerContent"),g=this.$("contentArrow");if(this._iAnimationCounter===1){f.toggleClass("sapMITBContentClosed",!e);if(e){g.show();$.css("display","block");}else{g.hide();$.css("display","none");}}this._iAnimationCounter=(this._iAnimationCounter>0?--this._iAnimationCounter:0);return this;};d.prototype._getIconTabHeader=function(){var o=this.getAggregation("_header");if(!o){o=new a(this.getId()+"--header",{});this.setAggregation("_header",o,true);}return o;};d.prototype._getStickyContent=function(){return this._getIconTabHeader();};d.prototype._returnStickyContent=function(){if(this.bIsDestroyed){return;}this._getStickyContent().$().prependTo(this.$());};d.prototype._setStickySubheaderSticked=function(i){this._bStickyContentSticked=i;};d.prototype._getStickySubheaderSticked=function(){return this._bStickyContentSticked;};d.prototype.onBeforeRendering=function(){var e=this._getIconTabHeader().$();if(this._bStickyContentSticked&&e){delete this._bStickyContentSticked;this._getIconTabHeader().$().remove();}};d.prototype.setShowSelection=function(v){this._getIconTabHeader().setShowSelection(v);return this;};d.prototype.getShowSelection=function(){return this._getIconTabHeader().getShowSelection();};d.prototype.setSelectedKey=function(v){this._getIconTabHeader().setSelectedKey(v);return this;};d.prototype.getSelectedKey=function(){return this._getIconTabHeader().getSelectedKey();};d.prototype.setSelectedItem=function(i,A){return this._getIconTabHeader().setSelectedItem(i,A);};return d;});