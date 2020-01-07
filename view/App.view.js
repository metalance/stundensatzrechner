sap.ui.jsview("com.metalance.chr.view.App", {
	getControllerName: function() {
		return "com.metalance.chr.controller.App";
	},
	createContent: function(oController) {
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-sortable");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-droppable");
		$.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");		
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		// create app
		this.app = new sap.m.App();
		this.app.setDefaultTransitionName("show");
		// load the main page
		var cmain = sap.ui.xmlview("Cmain", "com.metalance.chr.view.Cmain");
		cmain.getController().nav = this.getController();
		this.app.addPage(cmain, true);
		// done
		return this.app;
	}
});