/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBaseRenderer','sap/ui/core/Renderer','sap/ui/core/LabelEnablement','sap/ui/Device'],function(I,R,L,D){"use strict";var C=R.extend(I);C.CSS_CLASS_COMBOBOXTEXTFIELD="sapMComboBoxTextField";C.writeInnerAttributes=function(r,c){r.writeAttribute("autocomplete","off");r.writeAttribute("autocorrect","off");r.writeAttribute("autocapitalize","off");r.writeAttribute("type","text");};C.writeAccAttributes=function(r,c){if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("aria-haspopup","listbox");r.writeAttribute("aria-autocomplete","inline");r.writeAttribute("role","combobox");}};C.getAriaRole=function(){};C.getAriaDescribedBy=function(c){var a=I.getAriaDescribedBy.apply(this,arguments);if(D.browser.msie){return(a||"")+" "+c.oInvisibleText.getId();}return a;};C.addOuterStyles=function(r,c){r.addStyle("max-width",c.getMaxWidth());};return C;},true);
