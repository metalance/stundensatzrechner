/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var F={};F.render=function(r,c){var w=c.getWidth();var h=c.getHeight();r.write("<div");r.writeControlData(c);r.addClass("sapMFT");if(w){r.addClass("sapMFTOverflowWidth");}if(h){r.addClass("sapMFTOverflowHeight");}r.writeClasses();if(c.getTooltip_AsString()){r.writeAttributeEscaped("title",c.getTooltip_AsString());}r.addStyle("width",w||null);r.addStyle("height",h||null);r.writeStyles();r.write(">");r.write(c._getDisplayHtml());r.write("</div>");};return F;},true);
