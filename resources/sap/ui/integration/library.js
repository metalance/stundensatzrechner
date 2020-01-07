/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType","sap/ui/Global","sap/ui/core/library","sap/f/library"],function(D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.integration",version:"1.65.1",dependencies:["sap.ui.core","sap.f"],types:["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode"],controls:["sap.ui.integration.widgets.Card","sap.ui.integration.host.HostConfiguration"],elements:[],noLibraryCSS:true,customTags:{"card":"sap/ui/integration/widgets/Card","host-configuration":"sap/ui/integration/host/HostConfiguration"},defaultTagPrefix:"ui"});var t=sap.ui.integration;t.CardActionType={Navigation:"Navigation"};t.CardDataMode={Active:"Active",Inactive:"Inactive"};return t;});
