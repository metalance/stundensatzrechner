/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/m/HyphenationSupport"],function(c,H){"use strict";var T=c.TextAlign;var a=c.TitleLevel;var b={};b.render=function(r,t){var A=t._getTitle(),l=(A?A.getLevel():t.getLevel())||a.Auto,d=l==a.Auto,s=d?"div":l,e=H.getTextForRender(t,"main");r.openStart(s);r.controlData(t);r.class("sapMTitle");r.class("sapMTitleStyle"+(t.getTitleStyle()||a.Auto));r.class(t.getWrapping()?"sapMTitleWrap":"sapMTitleNoWrap");r.class("sapUiSelectable");var w=t.getWidth();if(!w){r.class("sapMTitleMaxWidth");}else{r.style("width",w);}var f=t.getTextAlign();if(f&&f!=T.Initial){r.class("sapMTitleAlign"+f);}if(t.getParent()instanceof sap.m.Toolbar){r.class("sapMTitleTB");}var g=A?A.getTooltip_AsString():t.getTooltip_AsString();if(g){r.attr("title",g);}if(d){r.attr("role","heading");}H.writeHyphenationClass(r,t);r.openEnd();r.openStart("span");r.attr("id",t.getId()+"-inner");r.openEnd();r.text(e);r.close("span");r.close(s);};return b;},true);
