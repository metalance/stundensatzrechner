sap.ui.define(['jquery.sap.global', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', "sap/m/MessageToast"], function(jQuery,
	Controller, JSONModel) {
	"use strict";
	var CmainController = Controller.extend("com.metalance.chr.controller.Cmain", {
		onInit: function() {
			this.oCalcModel = new sap.ui.model.json.JSONModel({
				avgsal: 4556.00,
				kkpv: 19.325,
				fixk: 1500,
				weekends: 104,
				hodays: 13,
				vacat: 28,
				illdays: 5,
				edudays: 5,
				prody: 66.7,
				earning: 15,
				total: 0
			});
			this.getView().setModel(this.oCalcModel, "calclatr");

			this.oCalcModel.setProperty("/total", "Ihr Angebot: € " + this.getTotal(this.oCalcModel.getProperty("/avgsal"),
				this.oCalcModel.getProperty("/kkpv"),
				this.oCalcModel.getProperty("/fixk"),
				this.oCalcModel.getProperty("/weekends"),
				this.oCalcModel.getProperty("/hodays"),
				this.oCalcModel.getProperty("/vacat"),
				this.oCalcModel.getProperty("/illdays"),
				this.oCalcModel.getProperty("/edudays"),
				this.oCalcModel.getProperty("/prody"),
				this.oCalcModel.getProperty("/earning")
			) );
			this.oCalcModel.setProperty("/title", "Entwickelt von <a href='https://www.metalance.com'>Ulli Hoffmann@Metalance</a> nach einem Blog der Unternehmensberater <a href='https://lambertschuster.de/existenzgruender/stundensatz-kalkulation-fuer-freiberufler-und-selbstaendige/'>Lambert Schuster & Lars Strempel.</a> Der Quellcode ist frei verfügbar auf <a href='https://github.com/metalance'>Github.</a><br>");

		},
		onValueChange: function() {
			var oCalcModel = this.getView().getModel("calclatr");

			oCalcModel.setProperty("/total", "Ihr Angebot: € " + this.getTotal(oCalcModel.getProperty("/avgsal"),
				oCalcModel.getProperty("/kkpv"),
				oCalcModel.getProperty("/fixk"),
				oCalcModel.getProperty("/weekends"),
				oCalcModel.getProperty("/hodays"),
				oCalcModel.getProperty("/vacat"),
				oCalcModel.getProperty("/illdays"),
				oCalcModel.getProperty("/edudays"),
				oCalcModel.getProperty("/prody"),
				oCalcModel.getProperty("/earning")
			) );
		},
		getTotal: function(base, kkpv, fixk, wends, hodays, vacat, illdays, edudays, prody, earn) {
			var total;
			var daysOfYear = 365;
			var expenses = base + fixk + (base * kkpv / 100);

			var workdaysMonth = (daysOfYear - wends - hodays - vacat - illdays - edudays) /12;
			
			if (workdaysMonth > 0) {
				var wdmProd = workdaysMonth	* prody / 100;
				wdmProd = Math.round(wdmProd / 0.1) * 0.1 ;
				total = expenses / wdmProd / 8 / ((100 - earn) / 100);
			} else {
				total = 0;
			}
			return total.toFixed(2).replace(".",",");
		}
	});
	return CmainController;
});