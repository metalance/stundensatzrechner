/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ComboBoxTextFieldRenderer','sap/ui/core/Renderer','sap/ui/core/Core'],function(C,R,a){"use strict";var b=R.extend(C);b.CSS_CLASS_COMBOBOXBASE="sapMComboBoxBase";b.getAccessibilityState=function(c){var A=C.getAccessibilityState.call(this,c),l=c._getList();if(l){A.controls=l.getId();}return A;};b.writeAccAttributes=function(r,c){C.writeAccAttributes.apply(this,arguments);if(a.getConfiguration().getAccessibility()){r.writeAttribute("aria-expanded",c.isOpen());}};b.addOuterClasses=function(r,c){C.addOuterClasses.apply(this,arguments);var d=b.CSS_CLASS_COMBOBOXBASE;r.addClass(d);if(!c.getEnabled()){r.addClass(d+"Disabled");}if(!c.getEditable()){r.addClass(d+"Readonly");}};b.addButtonClasses=function(r,c){C.addButtonClasses.apply(this,arguments);r.addClass(b.CSS_CLASS_COMBOBOXBASE+"Arrow");};return b;},true);
