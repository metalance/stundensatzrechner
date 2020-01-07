jQuery.sap.declare("com.metalance.chr.Component");
sap.ui.core.UIComponent.extend("com.metalance.chr.Component", {
	createContent: function() {
		// create root view
		var oView = sap.ui.view({
			id: "app",
			viewName: "com.metalance.chr.view.App",
			type: "JS",
			viewData: {
				component: this
			}
		});
		// set i18n model 
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "i18n/i18n.properties"
		});
		oView.setModel(i18nModel, "i18n");
		return oView;
	}
});