/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./SinglePlanningCalendarUtilities','sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/core/Locale','sap/ui/core/InvisibleText','sap/ui/core/format/DateFormat','sap/ui/core/date/UniversalDate','sap/ui/core/dnd/DragInfo','sap/ui/core/dnd/DropInfo','sap/ui/core/dnd/DragDropInfo','sap/ui/unified/library','sap/ui/unified/calendar/DatesRow','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/calendar/CalendarUtils','sap/ui/events/KeyCodes','./SinglePlanningCalendarGridRenderer','sap/ui/Device','sap/ui/core/delegate/ItemNavigation'],function(S,C,L,a,I,D,U,b,c,d,u,e,f,g,K,h,k,l){"use strict";var R=69,m=48,B=34,n=25,H=3600000/2,O=60*1000,M=86400000;var o=C.extend("sap.m.SinglePlanningCalendarGrid",{metadata:{library:"sap.m",properties:{startDate:{type:"object",group:"Data"},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",dnd:{draggable:true}},_columnHeaders:{type:"sap.ui.unified.calendar.DatesRow",multiple:false,visibility:"hidden"},_intervalPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}},_blockersPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}}},dnd:true,associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}}}}});o.prototype.init=function(){var s=new Date(),i=new e(this.getId()+"-columnHeaders",{showDayNamesLine:false,showWeekNumbers:false,startDate:s}).addStyleClass("sapMSinglePCColumnHeader"),j=(60-s.getSeconds())*1000;this.setAggregation("_columnHeaders",i);this.setStartDate(s);this._setColumns(7);this._configureBlockersDragAndDrop();this._configureAppointmentsDragAndDrop();this._configureAppointmentsResize();this._configureAppointmentsCreate();this._oUnifiedRB=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");this._oFormatAriaApp=D.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY 'at' HH:mm:ss a"});this._oFormatAriaFullDayCell=D.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY"});this._oFormatAriaCell=D.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY 'at' HH"});this._sLegendId=undefined;setTimeout(this._updateRowHeaderAndNowMarker.bind(this),j);};o.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}};o.prototype.onBeforeRendering=function(){var A=this._createAppointmentsMap(this.getAppointments()),s=this.getStartDate(),i=f.fromLocalJSDate(s),j=this._getColumns();this._oVisibleAppointments=this._calculateVisibleAppointments(A.appointments,this.getStartDate(),j);this._oAppointmentsToRender=this._calculateAppointmentsLevelsAndWidth(this._oVisibleAppointments);this._aVisibleBlockers=this._calculateVisibleBlockers(A.blockers,i,j);this._oBlockersToRender=this._calculateBlockersLevelsAndWidth(this._aVisibleBlockers);if(this._iOldColumns!==j||this._oOldStartDate!==s){this._createBlockersDndPlaceholders(s,j);this._createAppointmentsDndPlaceholders(s,j);}};o.prototype.onmousedown=function(E){var i=E.target.classList;this._isResizeHandleBottomMouseDownTarget=i.contains("sapMSinglePCAppResizeHandleBottom");this._isResizeHandleTopMouseDownTarget=i.contains("sapMSinglePCAppResizeHandleTop");};o.prototype._isResizingPerformed=function(){return this._isResizeHandleBottomMouseDownTarget||this._isResizeHandleTopMouseDownTarget;};o.prototype._configureBlockersDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_blockersPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsDragAndDrop()){E.preventDefault();return false;}var i=function(){var $=jQuery(".sapMSinglePCOverlay");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");});jQuery(document).one("dragend",function(){$.removeClass("sapMSinglePCOverlayDragging");});};i();}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),r=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),s=function(){var $=jQuery(i.getIndicator()),t=A.$().outerHeight(),v=A.$().outerWidth(),G=j.$().closest(".sapMSinglePCBlockersColumns").get(0).getBoundingClientRect(),w=j.getDomRef().getBoundingClientRect(),x=(w.left+v)-(G.left+G.width);if(r){$.css("min-height",t);$.css("min-width",Math.min(v,v-x));}else{$.css("min-height",i.getDropControl().$().outerHeight());$.css("min-width",i.getDropControl().$().outerWidth());}};if(!i.getIndicator()){setTimeout(s,0);}else{s();}}.bind(this),drop:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),P=i.getDropControl(),s=P.getDate().getJSDate(),j,r=E.getParameter("browserEvent"),t=(r.metaKey||r.ctrlKey),v=this.isAllDayAppointment(A.getStartDate(),A.getEndDate());j=new Date(s);if(v){j.setMilliseconds(A.getEndDate().getTime()-A.getStartDate().getTime());}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(v&&A.getStartDate().getTime()===s.getTime()){return;}this.fireAppointmentDrop({appointment:A,startDate:s,endDate:j,copy:t});}.bind(this)}));};o.prototype._configureAppointmentsDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsDragAndDrop()||this._isResizingPerformed()){E.preventDefault();return false;}var i=function(){var $=jQuery(".sapMSinglePCOverlay");setTimeout(function(){$.addClass("sapMSinglePCOverlayDragging");});jQuery(document).one("dragend",function(){$.removeClass("sapMSinglePCOverlayDragging");});};i();}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=i.getDropControl(),r=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),s=function(){var $=jQuery(i.getIndicator()),t=A.$().outerHeight(),G=j.$().closest(".sapMSinglePCColumn").get(0).getBoundingClientRect(),v=i.getDropControl().getDomRef().getBoundingClientRect(),w=(v.top+t)-(G.top+G.height);if(r){$.css("min-height",2*i.getDropControl().$().outerHeight());}else{$.css("min-height",Math.min(t,t-w));}};if(!i.getIndicator()){setTimeout(s,0);}else{s();}}.bind(this),drop:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),P=i.getDropControl(),s=P.getDate().getJSDate(),j,r=E.getParameter("browserEvent"),t=(r.metaKey||r.ctrlKey),v=this.isAllDayAppointment(A.getStartDate(),A.getEndDate());j=new Date(s);if(v){j.setHours(j.getHours()+1);}else{j.setMilliseconds(A.getEndDate().getTime()-A.getStartDate().getTime());}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(!v&&A.getStartDate().getTime()===s.getTime()){return;}this.fireAppointmentDrop({appointment:A,startDate:s,endDate:j,copy:t});}.bind(this)}));};o.prototype._configureAppointmentsResize=function(){var r=new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsResize()||!this._isResizingPerformed()){E.preventDefault();return;}var i=E.getParameter("dragSession"),s=this.$().find(".sapMSinglePCOverlay"),$=jQuery(i.getIndicator()),j=i.getDragControl().$();if(this._isResizeHandleBottomMouseDownTarget){i.setData("bottomHandle","true");}if(this._isResizeHandleTopMouseDownTarget){i.setData("topHandle","true");}$.addClass("sapUiDnDIndicatorHide");setTimeout(function(){s.addClass("sapMSinglePCOverlayDragging");},0);jQuery(document).one("dragend",function(){var A=i.getComplexData("appointmentStartingBoundaries");s.removeClass("sapMSinglePCOverlayDragging");$.removeClass("sapUiDnDIndicatorHide");j.css({top:A.top,height:A.height,"z-index":"auto",opacity:1});});if(!k.browser.msie&&!k.browser.edge){E.getParameter("browserEvent").dataTransfer.setDragImage(p(),0,0);}}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl().$().get(0),j=i.getDropControl().getDomRef(),s=i.getComplexData("appointmentStartingBoundaries"),t=function(){var $=jQuery(i.getIndicator());$.addClass("sapUiDnDIndicatorHide");},T,v,w,V,x;if(!s){s={top:A.offsetTop,bottom:A.offsetTop+A.getBoundingClientRect().height,height:A.getBoundingClientRect().height};i.setComplexData("appointmentStartingBoundaries",s);}V=i.getData("bottomHandle")?s.top:s.bottom;T=Math.min(V,j.offsetTop);v=Math.max(V,j.offsetTop+j.getBoundingClientRect().height);w=v-T;x={top:T,height:w,"z-index":1,opacity:0.8};i.getDragControl().$().css(x);if(!i.getIndicator()){setTimeout(t,0);}else{t();}},drop:function(E){var i=E.getParameter("dragSession"),A=i.getDragControl(),j=this.indexOfAggregation("_intervalPlaceholders",i.getDropControl()),s=i.getComplexData("appointmentStartingBoundaries"),t;t=this._calcResizeNewHoursAppPos(A.getStartDate(),A.getEndDate(),j,i.getData("bottomHandle"));this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");jQuery(i.getIndicator()).removeClass("sapUiDnDIndicatorHide");A.$().css({top:s.top,height:s.height,"z-index":"auto",opacity:1});if(A.getEndDate().getTime()===t.endDate.getTime()&&A.getStartDate().getTime()===t.startDate.getTime()){return;}this.fireAppointmentResize({appointment:A,startDate:t.startDate,endDate:t.endDate});}.bind(this)});this.addDragDropConfig(r);};o.prototype._configureAppointmentsCreate=function(){this.addDragDropConfig(new d({targetAggregation:"_intervalPlaceholders",dragStart:function(E){if(!this.getEnableAppointmentsCreate()){E.preventDefault();return;}var s=this.$().find(".sapMSinglePCOverlay");setTimeout(function(){s.addClass("sapMSinglePCOverlayDragging");});jQuery(document).one("dragend",function(){s.removeClass("sapMSinglePCOverlayDragging");jQuery(".sapUiAppCreate").remove();jQuery(".sapUiDnDDragging").removeClass("sapUiDnDDragging");});if(!k.browser.msie&&!k.browser.edge){E.getParameter("browserEvent").dataTransfer.setDragImage(p(),0,0);}}.bind(this),dragEnter:function(E){var i=E.getParameter("dragSession"),j=i.getDropControl(),r=j.getDomRef(),s=r.offsetHeight,t=r.offsetTop,v=t,w=r.getBoundingClientRect().left,x=w,y=j.$().parents(".sapMSinglePCColumn").get(0),$=jQuery(".sapUiAppCreate");if(!$.get(0)){$=jQuery("<div></div>").addClass("sapUiCalendarApp sapUiCalendarAppType01 sapUiAppCreate");$.appendTo(y);}jQuery(".sapUiDnDDragging").removeClass("sapUiDnDDragging");if(!i.getComplexData("startingRectsDropArea")){i.setComplexData("startingRectsDropArea",{top:t,left:w});i.setComplexData("startingDropDate",j.getDate());}else{v=i.getComplexData("startingRectsDropArea").top;x=i.getComplexData("startingRectsDropArea").left;}if(w!==x){E.preventDefault();return false;}j.$().closest(".sapMSinglePCColumn").find(".sapMSinglePCAppointments").addClass("sapUiDnDDragging");$.css({top:Math.min(v,t)+2,height:Math.abs(v-t)+s-4,left:3,right:3,"z-index":2});i.setIndicatorConfig({display:"none"});},drop:function(E){var i=E.getParameter("dragSession"),j=i.getDropControl(),T=30*60*1000,s=i.getComplexData("startingDropDate").getTime(),r=j.getDate().getJSDate().getTime(),t=Math.min(s,r),v=Math.max(s,r)+T;this.fireAppointmentCreate({startDate:new Date(t),endDate:new Date(v)});jQuery(".sapUiAppCreate").remove();jQuery(".sapUiDnDDragging").removeClass("sapUiDnDDragging");}.bind(this)}));};o.prototype._calcResizeNewHoursAppPos=function(A,i,j,r){var s=new Date(this.getStartDate().getFullYear(),this.getStartDate().getMonth(),this.getStartDate().getDate()),t=30*60*1000,P=s.getTime()+j*t,v=P+t,V=r?A.getTime():i.getTime(),w=Math.min(V,P),E=Math.max(V,v);return{startDate:new Date(w),endDate:new Date(E)};};o.prototype._adjustAppointmentsHeightforCompact=function(s,i,j){var A,$,r,t,v,w,x,y,z=this._getRowHeight(),E=this;if(this._oAppointmentsToRender[s]){this._oAppointmentsToRender[s].oAppointmentsList.getIterator().forEach(function(F){A=F.getData();$=jQuery("div[data-sap-day='"+s+"'].sapMSinglePCColumn #"+A.getId());r=A.getStartDate();t=A.getEndDate();x=i.getTime()>r.getTime();y=j.getTime()<t.getTime();v=x?0:E._calculateTopPosition(r);w=y?0:E._calculateBottomPosition(t);$.css("top",v);$.css("bottom",w);$.find(".sapUiCalendarApp").css("min-height",z/2-3);});}};o.prototype._adjustBlockersHeightforCompact=function(){var i=this._getBlockersToRender().iMaxlevel,j=(i+1)*this._getBlockerRowHeight(),r=this._getBlockerRowHeight();if(i>0){j=j+3;}this.$().find(".sapMSinglePCBlockersColumns").css("height",j);this._oBlockersToRender.oBlockersList.getIterator().forEach(function(s){s.getData().$().css("top",r*s.level+1);});};o.prototype.onAfterRendering=function(){var j=this._getColumns(),s=this.getStartDate(),r=this._getRowHeight();if(r===m){for(var i=0;i<j;i++){var t=new f(s.getFullYear(),s.getMonth(),s.getDate()+i),v=this._getDateFormatter().format(t.toLocalJSDate()),w=new U(t.getYear(),t.getMonth(),t.getDate(),this._getVisibleStartHour()),x=new U(t.getYear(),t.getMonth(),t.getDate(),this._getVisibleEndHour(),59,59);this._adjustAppointmentsHeightforCompact(v,w,x);}this._adjustBlockersHeightforCompact();}this._updateRowHeaderAndNowMarker();_.call(this);};o.prototype._removeAppointmentSelection=function(){jQuery(".sapUiCalendarApp").removeClass("sapUiCalendarAppSel");this.getSelectedAppointments().forEach(function(A){A.setProperty("selected",false,true);this.fireAppointmentSelect({appointment:A});}.bind(this));};o.prototype.onkeydown=function(E){var A=E.srcControl,i=A&&A.isA("sap.ui.unified.CalendarAppointment"),G=E.target;if(E.which===K.SPACE||E.which===K.ENTER){if(i){this._toggleAppointmentSelection(A,!(E.ctrlKey||E.metaKey));this.fireAppointmentSelect({appointment:A});}if(G.classList.contains("sapMSinglePCRow")||G.classList.contains("sapMSinglePCBlockersColumn")){this.fireEvent("cellPress",{startDate:this._getDateFormatter().parse(G.getAttribute("data-sap-start-date")),endDate:this._getDateFormatter().parse(G.getAttribute("data-sap-end-date"))});}E.preventDefault();}};o.prototype._appFocusHandler=function(E,i){var A=sap.ui.getCore().byId(E.target.id),j=A&&A.isA("sap.ui.unified.CalendarAppointment");if(j){this._removeAppointmentSelection();this._focusCellWithKeyboard(A,i);E.preventDefault();}};o.prototype._cellFocusHandler=function(E,i){var G=E.target,F=this._getDateFormatter(),j;if(G.classList.contains("sapMSinglePCRow")||G.classList.contains("sapMSinglePCBlockersColumn")){j=F.parse(G.getAttribute("data-sap-start-date"));if(this._isBorderReached(j,i)){this.fireEvent("borderReached",{startDate:j,next:i===K.ARROW_RIGHT,fullDay:G.classList.contains("sapMSinglePCBlockersColumn")});}}};o.prototype.onsapup=function(E){this._appFocusHandler(E,K.ARROW_UP);};o.prototype.onsapdown=function(E){this._appFocusHandler(E,K.ARROW_DOWN);};o.prototype.onsapright=function(E){this._appFocusHandler(E,K.ARROW_RIGHT);this._cellFocusHandler(E,K.ARROW_RIGHT);};o.prototype.onsapleft=function(E){this._appFocusHandler(E,K.ARROW_LEFT);this._cellFocusHandler(E,K.ARROW_LEFT);};o.prototype.setStartDate=function(s){this._oOldStartDate=this.getStartDate();this.getAggregation("_columnHeaders").setStartDate(s);return this.setProperty("startDate",s);};o.prototype.getSelectedAppointments=function(){return this.getAppointments().filter(function(A){return A.getSelected();});};o.prototype._toggleAppointmentSelection=function(A,r){var j,i,s;if(r){j=this.getAppointments();for(i=0,s=j.length;i<s;i++){if(j[i].getId()!==A.getId()&&j[i].getSelected()){j[i].setProperty("selected",false,true);jQuery('[data-sap-ui='+j[i].getId()+']').find(".sapUiCalendarApp").removeClass("sapUiCalendarAppSel");}}}A.setProperty("selected",!A.getSelected(),true);jQuery('[data-sap-ui='+A.getId()+']').find(".sapUiCalendarApp").toggleClass("sapUiCalendarAppSel",A.getSelected());};o.prototype._isBorderReached=function(F,i){var G=f.fromLocalJSDate(this.getStartDate()),j=new f(G.getYear(),G.getMonth(),G.getDate()+this._getColumns()-1),t=f.fromLocalJSDate(F),r=i===K.ARROW_LEFT&&t.isSame(G),s=i===K.ARROW_RIGHT&&t.isSame(j);return r||s;};o.prototype._focusCellWithKeyboard=function(A,i){var F=this.isAllDayAppointment(A.getStartDate(),A.getEndDate()),j=this._getDateFormatter(),r=new Date(A.getStartDate().getFullYear(),A.getStartDate().getMonth(),A.getStartDate().getDate(),A.getStartDate().getHours()),G=new Date(this.getStartDate().getFullYear(),this.getStartDate().getMonth(),this.getStartDate().getDate(),this.getStartDate().getHours());if(r<G){r=G;}if(this._isBorderReached(r,i)){this.fireEvent("borderReached",{startDate:r,next:i===K.ARROW_RIGHT,fullDay:F});return;}switch(i){case K.ARROW_UP:if(!F){r.setHours(r.getHours()-1);}break;case K.ARROW_DOWN:if(!F){r.setHours(r.getHours()+1);}break;case K.ARROW_LEFT:r.setDate(r.getDate()-1);break;case K.ARROW_RIGHT:r.setDate(r.getDate()+1);break;default:}if(F&&i!==K.ARROW_DOWN){jQuery("[data-sap-start-date='"+j.format(r)+"'].sapMSinglePCBlockersColumn").focus();}else{jQuery("[data-sap-start-date='"+j.format(r)+"'].sapMSinglePCRow").focus();}};o.prototype.ontap=function(E){var A=sap.ui.getCore().byId(E.target.parentElement.id),G=E.target;if(A&&A.isA("sap.ui.unified.CalendarAppointment")){this._toggleAppointmentSelection(A,!(E.ctrlKey||E.metaKey));this.fireAppointmentSelect({appointment:A});}if(G.classList.contains("sapMSinglePCRow")||G.classList.contains("sapMSinglePCBlockersColumn")){this._removeAppointmentSelection();}};o.prototype._getVisibleStartHour=function(){return 0;};o.prototype._getVisibleEndHour=function(){return 23;};o.prototype._isVisibleHour=function(){return true;};o.prototype._isOutsideVisibleHours=function(){return false;};o.prototype._shouldHideRowHeader=function(r){var i=new Date().getHours(),j=g._areCurrentMinutesLessThan(15)&&i===r,s=g._areCurrentMinutesMoreThan(45)&&i===r-1;return j||s;};o.prototype._parseDateStringAndHours=function(s,i){var j=this._getDateFormatter().parse(s);if(i){j.setHours(i);}return j;};o.prototype._getDateFormatter=function(){if(!(this._oDateFormat instanceof D)){this._oDateFormat=D.getDateTimeInstance({pattern:"YYYYMMdd-HHmm"});}return this._oDateFormat;};o.prototype._formatTimeAsString=function(i){var P=this._getHoursPattern()+":mm",F=D.getDateTimeInstance({pattern:P},new a(this._getCoreLocaleId()));return F.format(i);};o.prototype._addAMPM=function(i){var A=this._getAMPMFormat();return" "+A.format(i);};o.prototype._calculateTopPosition=function(i){var j=i.getHours()-this._getVisibleStartHour(),r=i.getMinutes(),s=this._getRowHeight();return Math.floor((s*j)+(s/60)*r);};o.prototype._calculateBottomPosition=function(i){var j=this._getVisibleEndHour()+1-i.getHours(),r=i.getMinutes(),s=this._getRowHeight();return Math.floor((s*j)-(s/60)*r);};o.prototype._updateRowHeaderAndNowMarker=function(){var i=new Date();this._updateNowMarker(i);this._updateRowHeaders(i);setTimeout(this._updateRowHeaderAndNowMarker.bind(this),O);};o.prototype._updateNowMarker=function(i){var $=this.$("nowMarker"),j=this.$("nowMarkerText"),r=this.$("nowMarkerAMPM"),s=this._isOutsideVisibleHours(i.getHours());$.toggleClass("sapMSinglePCNowMarkerHidden",s);$.css("top",this._calculateTopPosition(i)+"px");j.text(this._formatTimeAsString(i));r.text(this._addAMPM(i));j.append(r);};o.prototype._updateRowHeaders=function(i){var $=this.$(),j=i.getHours(),N=j+1;$.find(".sapMSinglePCRowHeader").removeClass("sapMSinglePCRowHeaderHidden");if(this._shouldHideRowHeader(j)){$.find(".sapMSinglePCRowHeader"+j).addClass("sapMSinglePCRowHeaderHidden");}else if(this._shouldHideRowHeader(N)){$.find(".sapMSinglePCRowHeader"+N).addClass("sapMSinglePCRowHeaderHidden");}};o.prototype._createAppointmentsMap=function(A){var t=this;return A.reduce(function(i,j){var r=j.getStartDate(),s=j.getEndDate(),v,w,x;if(!r||!s){return i;}if(!t.isAllDayAppointment(r,s)){v=f.fromLocalJSDate(r);w=f.fromLocalJSDate(s);while(v.isSameOrBefore(w)){x=t._getDateFormatter().format(v.toLocalJSDate());if(!i.appointments[x]){i.appointments[x]=[];}i.appointments[x].push(j);v.setDate(v.getDate()+1);}}else{i.blockers.push(j);}return i;},{appointments:{},blockers:[]});};o.prototype._calculateVisibleAppointments=function(A,s,j){var v={},r,t,w;for(var i=0;i<j;i++){r=new f(s.getFullYear(),s.getMonth(),s.getDate()+i);t=this._getDateFormatter().format(r.toLocalJSDate());w=this._isAppointmentFitInVisibleHours(r);if(A[t]){v[t]=A[t].filter(w,this).sort(this._sortAppointmentsByStartHourCallBack);}}return v;};o.prototype._isAppointmentFitInVisibleHours=function(i){return function(A){var j=A.getStartDate().getTime(),r=A.getEndDate().getTime(),s=(new U(i.getYear(),i.getMonth(),i.getDate(),this._getVisibleStartHour())).getTime(),t=(new U(i.getYear(),i.getMonth(),i.getDate(),this._getVisibleEndHour(),59,59)).getTime();var v=j<s&&r>t,w=j>=s&&j<t,E=r>s&&r<=t;return v||w||E;};};o.prototype._calculateAppointmentsLevelsAndWidth=function(v){var t=this;return Object.keys(v).reduce(function(A,s){var i=0,j=new S.list(),r=v[s];r.forEach(function(w){var x=new S.node(w),y=w.getStartDate().getTime();if(j.getSize()===0){j.add(x);return;}j.getIterator().forEach(function(z){var E=true,F=z.getData(),G=F.getStartDate().getTime(),J=F.getEndDate().getTime(),N=J-G;if(N<H){J=J+(H-N);}if(y>=G&&y<J){x.level++;i=Math.max(i,x.level);}if(z.next&&z.next.level===x.level){E=false;}if(y>=J&&E){this.interrupt();}});j.insertAfterLevel(x.level,x);});A[s]={oAppointmentsList:t._calculateAppointmentsWidth(j),iMaxLevel:i};return A;},{});};o.prototype._calculateAppointmentsWidth=function(A){A.getIterator().forEach(function(i){var j=i.getData(),r=i.level,s=i.level,t=j.getStartDate().getTime(),v=j.getEndDate().getTime(),w=v-t;if(w<H){v=v+(H-w);}new S.iterator(A).forEach(function(x){var y=x.getData(),z=x.level,E=y.getStartDate().getTime(),F=y.getEndDate().getTime(),G=F-E;if(G<H){F=F+(H-G);}if(s>=z){return;}if(t>=E&&t<F||v>E&&v<F||t<=E&&v>=F){i.width=z-s;this.interrupt();return;}if(r<z){r=z;i.width++;}});});return A;};o.prototype._calculateVisibleBlockers=function(i,j,r){var s=new f(j.getYear(),j.getMonth(),j.getDate()+r),t=this._isBlockerVisible(j,s);return i.filter(t).sort(this._sortAppointmentsByStartHourCallBack);};o.prototype._isBlockerVisible=function(v,V){return function(A){var i=f.fromLocalJSDate(A.getStartDate()),j=f.fromLocalJSDate(A.getEndDate());var r=i.isBefore(v)&&j.isAfter(V),s=i.isSameOrAfter(v)&&i.isBefore(V),E=g._isBetween(j,v,V,true);return r||s||E;};};o.prototype._calculateBlockersLevelsAndWidth=function(v){var i=0,j=new S.list();v.forEach(function(r){var s=new S.node(r),t=f.fromLocalJSDate(r.getStartDate()),w=f.fromLocalJSDate(r.getEndDate());s.width=g._daysBetween(w,t);if(j.getSize()===0){j.add(s);return;}j.getIterator().forEach(function(x){var y=true,z=x.getData(),A=f.fromLocalJSDate(z.getStartDate()),E=f.fromLocalJSDate(z.getEndDate());if(t.isSameOrAfter(A)&&t.isSameOrBefore(E)){s.level++;i=Math.max(i,s.level);}if(x.next&&x.next.level===s.level){y=false;}if(t.isSameOrAfter(E)&&y){this.interrupt();}});j.insertAfterLevel(s.level,s);},this);return{oBlockersList:j,iMaxlevel:i};};o.prototype._sortAppointmentsByStartHourCallBack=function(A,i){return A.getStartDate().getTime()-i.getStartDate().getTime()||i.getEndDate().getTime()-A.getEndDate().getTime();};o.prototype._getVisibleAppointments=function(){return this._oVisibleAppointments;};o.prototype._getAppointmentsToRender=function(){return this._oAppointmentsToRender;};o.prototype._getVisibleBlockers=function(){return this._aVisibleBlockers;};o.prototype._getBlockersToRender=function(){return this._oBlockersToRender;};o.prototype._setColumns=function(i){this._iOldColumns=this._iColumns;this._iColumns=i;this.getAggregation("_columnHeaders").setDays(i);this.invalidate();return this;};o.prototype._getColumns=function(){return this._iColumns;};o.prototype._getRowHeight=function(){return this._isCompact()?m:R;};o.prototype._getBlockerRowHeight=function(){return this._isCompact()?n:B;};o.prototype._isCompact=function(){var i=this.getDomRef();while(i&&i.classList){if(i.classList.contains("sapUiSizeCompact")){return true;}i=i.parentNode;}return false;};o.prototype._getCoreLocaleId=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};o.prototype._getCoreLocaleData=function(){var s,i;if(!this._oLocaleData){s=this._getCoreLocaleId();i=new a(s);this._oLocaleData=L.getInstance(i);}return this._oLocaleData;};o.prototype._hasAMPM=function(){var i=this._getCoreLocaleData();return i.getTimePattern("short").search("a")>=0;};o.prototype._getHoursFormat=function(){var s=this._getCoreLocaleId();if(!this._oHoursFormat||this._oHoursFormat.oLocale.toString()!==s){var i=new a(s),P=this._getHoursPattern();this._oHoursFormat=D.getTimeInstance({pattern:P},i);}return this._oHoursFormat;};o.prototype._getHoursPattern=function(){return this._hasAMPM()?"h":"H";};o.prototype._getAMPMFormat=function(){var s=this._getCoreLocaleId(),i=new a(s);if(!this._oAMPMFormat||this._oAMPMFormat.oLocale.toString()!==s){this._oAMPMFormat=D.getTimeInstance({pattern:"a"},i);}return this._oAMPMFormat;};o.prototype._getColumnHeaders=function(){return this.getAggregation("_columnHeaders");};o.prototype._getAppointmentStartEndInfo=function(A){var s=this._oUnifiedRB.getText("CALENDAR_START_TIME"),E=this._oUnifiedRB.getText("CALENDAR_END_TIME"),F=this._oFormatAriaApp.format(A.getStartDate()),i=this._oFormatAriaApp.format(A.getEndDate());return s+": "+F+"; "+E+": "+i+"; ";};o.prototype.enhanceAccessibilityState=function(i,A){if(i.getId()===this._getColumnHeaders().getId()){A.labelledby=I.getStaticId("sap.m","PLANNINGCALENDAR_DAYS");}};o.prototype._getCellStartEndInfo=function(s,E){var i=this._oUnifiedRB.getText("CALENDAR_START_TIME"),j=this._oUnifiedRB.getText("CALENDAR_END_TIME"),F=!E;if(F){return i+": "+this._oFormatAriaFullDayCell.format(s)+"; ";}return i+": "+this._oFormatAriaCell.format(s)+"; "+j+": "+this._oFormatAriaCell.format(E)+"; ";};o.prototype.isAllDayAppointment=function(A,i){var s=A.getHours()===0,j=A.getMinutes()===0,r=A.getSeconds()===0,t=A.getMilliseconds()===0,v=s&&j&&r&&t,w=false;if(v){w=this._isEndTime0000(A,i);}return w;};o.prototype._isEndTime0000=function(A,i){return(i.getTime()-A.getTime())%M===0;};o.prototype._createBlockersDndPlaceholders=function(s,j){this.destroyAggregation("_blockersPlaceholders");for(var i=0;i<j;i++){var r=new U(s.getFullYear(),s.getMonth(),s.getDate()+i);var P=new q({date:r});this.addAggregation("_blockersPlaceholders",P,true);}};o.prototype._createAppointmentsDndPlaceholders=function(s,r){var t=this._getVisibleStartHour(),E=this._getVisibleEndHour();this._dndPlaceholdersMap={};this.destroyAggregation("_intervalPlaceholders");for(var i=0;i<r;i++){var v=new f(s.getFullYear(),s.getMonth(),s.getDate()+i);if(!this._dndPlaceholdersMap[v]){this._dndPlaceholdersMap[v]=[];}for(var j=t;j<=E;j++){var w=this._dndPlaceholdersMap[v],y=v.getYear(),x=v.getMonth(),z=v.getDate();w.push(this._createAppointmentsDndPlaceHolder(new U(y,x,z,j)));w.push(this._createAppointmentsDndPlaceHolder(new U(y,x,z,j,30)));}}};o.prototype._createAppointmentsDndPlaceHolder=function(i){var P=new q({date:i});this.addAggregation("_intervalPlaceholders",P,true);return P;};function p(){var $=jQuery("<span></span>").addClass("sapUiCalAppResizeGhost");$.appendTo(document.body);setTimeout(function(){$.remove();},0);return $.get(0);}var q=C.extend("sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",{metadata:{properties:{date:{type:"object",group:"Data"}}},renderer:function(r,i){r.write("<div");r.writeControlData(i);r.addClass("sapMSinglePCPlaceholder");r.writeClasses();r.write("></div>");}});o.prototype._findCorrespondingLegendItem=function(j,A){var s=j._sLegendId,r=sap.ui.getCore().byId(s),t=r?r.getAppointmentItems():null,v,w;if(t&&t.length){for(var i=0;i<t.length;i++){v=t[i];if(v.getType()===A.getType()){w=v.getText();break;}}}if(!w){w=A.getType();}return w;};function _(){var r=this.getDomRef(),i=this.$().find(".sapMSinglePCBlockersColumn").toArray();this._aGridCells=Array.prototype.concat(i);for(var j=0;j<=this._getVisibleEndHour();++j){i=this.$().find("div[data-sap-hour='"+j+"']").toArray();this._aGridCells=this._aGridCells.concat(i);}if(!this._oItemNavigation){this._oItemNavigation=new l();this.addDelegate(this._oItemNavigation);}this._oItemNavigation.setRootDomRef(r);this._oItemNavigation.setItemDomRefs(this._aGridCells);this._oItemNavigation.setCycling(false);this._oItemNavigation.setTableMode(true,true).setColumns(this._getColumns());this._oItemNavigation.setPageSize(this._aGridCells.length);}return o;});