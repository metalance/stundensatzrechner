/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/test/actions/Action","sap/ui/events/KeyCodes"],function(A,K){"use strict";return A.extend("sap.ui.test.actions.EnterText",{metadata:{properties:{text:{type:"string"},clearTextFirst:{type:"boolean",defaultValue:true}},publicMethods:["executeOn"]},executeOn:function(c){var a=this.$(c),o=a[0];if(!o){return;}if(this.getText()===undefined||(!this.getClearTextFirst()&&!this.getText())){this.oLogger.error("Please provide a text for this EnterText action");return;}var u=this.getUtils();this.oLogger.timestamp("opa.actions.enterText");this.oLogger.debug("Enter text in control "+c);this._tryOrSimulateFocusin(a,c);if(this.getClearTextFirst()){u.triggerKeydown(o,K.DELETE);u.triggerKeyup(o,K.DELETE);a.val("");u.triggerEvent("input",o);}var v=a.val();this.getText().split("").forEach(function(C){v+=C;u.triggerCharacterInput(o,C,v);u.triggerEvent("input",o);});this._simulateFocusout(o);u.triggerEvent("search",o);}});});
