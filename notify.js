/*  notify.js
*   Original author Phillip Klawansky
*   Use of this control is not restricted provided this comment remains in this file for reference
*   https://github.com/pklawansky/notify
*   Published 2016-05-16
*/

var notify = function (options, functionOK, functionCancel, functionInitialised) {

    //configure for your website if it has a navbar on top
    var maxTopOffsetPixels = 100;

    //setting up ids and classes
    var popupDivId = "notifyPopupDiv";
    var popupDivContentId = "notifyPopupContentDiv";
    var popupDivMaskId = "notifyPopupMaskDiv";
    var popupDivContentDivId = "notifyPopupContentInnerDiv";
    var popupDivContentDivOKButtonId = "notifyPopupContentInnerDivOkButton";
    var popupDivContentDivCancelButtonId = "notifyPopupContentInnerDivCancelButton";
    var popupDivContentDivButtonClass = "notifyPopupContentInnerDivButton";
    var popupDivContentDivInputClass = "notifyPopupContentInnerDivInput";
    var popupDivContentDivHeading = "popupDivContentDivHeading";
    var popupDivContentDivValidationClass = "popupDivContentDivValidationMessage";
    var popupDivContentDivCustomHtmlId = "popupDivContentDivCustomHtml";

    //if popup exists already, delete and add new
    var popupDiv = $("#" + popupDivId);
    if (popupDiv.length > 0) {
        popupDiv.remove();
    }

    //function renders all the processed data into the popup
    var renderPopup = function (text, type, customHtml, buttonOptions, inputOptions, functionOK, functionCancel) {



        //initialise popup containers
        var html = '<div id="' + popupDivId + '">';
        html += '<div id="' + popupDivMaskId + '"></div>';
        html += '<div id="' + popupDivContentId + '">';
        html += '<div id="' + popupDivContentDivId + '"></div>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        popupDiv = $("#" + popupDivId);

        var popupDivContent = popupDiv.find("#" + popupDivContentId);
        var popupDivMask = popupDiv.find("#" + popupDivMaskId);

        var popupDivContentDiv = popupDiv.find("#" + popupDivContentDivId);


        //style popup containers
        popupDiv.css("z-index", 10000);

        var popupColour = "transparent";
        switch (type) {
            case notifyTypeAlert:
                popupColour = "lightgreen";
                break;
            case notifyTypeForm:
                popupColour = "lightgreen";
                break;
            case notifyTypeConfirm:
                popupColour = "lightgreen";
                break;
            case notifyTypeError:
                popupColour = "lightcoral";
                break;
            case notifyTypeWarning:
                popupColour = "orange";
                break;
            case notifyTypeCustom:
                popupColour = "white";
        }

        popupDivMask.css("position", "fixed");
        popupDivMask.css("top", "0px");
        popupDivMask.css("bottom", "0px");
        popupDivMask.css("left", "0px");
        popupDivMask.css("right", "0px");
        popupDivMask.css("overflow", "hidden");
        popupDivMask.css("padding", "0");
        popupDivMask.css("margin", "0");
        popupDivMask.css("background-color", popupColour);
        popupDivMask.css("filter", "alpha(opacity=50)");
        popupDivMask.css("opacity", "0.5");

        popupDivContent.css("background-color", "white");
        popupDivContent.css("overflow", "auto");
        popupDivContent.css("padding", "10px");
        popupDivContent.css("border-top", "3px solid black");
        popupDivContent.css("box-shadow", "0 0 200px rgba(0,0,0,1)");
        popupDivContent.css("-moz-box-shadow", "0 0 200px rgba(0,0,0,1)");
        popupDivContent.css("-webkit-box-shadow", "0 0 200px rgba(0,0,0,1)");
        popupDivContent.css("position", "fixed");
        popupDivContent.css("bottom", 0);
        popupDivContent.css("left", 0);
        popupDivContent.css("right", 0);
        popupDivContent.css("width", "auto");

        if (type !== notifyTypeCustom) {
            popupDivContentDiv.css("margin", "auto");
            popupDivContentDiv.css("text-align", "center");
        }

        html = '<h1 id="' + popupDivContentDivHeading + '">' + text + "</h1>";
        popupDivContentDiv.append(html);

        //heading/alert
        var heading = popupDivContentDiv.find("#" + popupDivContentDivHeading);
        heading.css("margin", "10px");
        heading.css("margin-top", "0");
        heading.css("border-bottom", "3px solid #f0f0f0");
        if (text === undefined || text === null || text === "") {
            heading.css("display", "none");
        }

        html = "";
        //if popup is a form box, it contains inputs, otherwise it is just a box with buttons
        if (type === notifyTypeForm) {
            html = "<table><tbody>";

            $.each(inputOptions, function (idx, val) {
                html += "<tr>";

                html += "<td>";
                html += '<label for="popupInput_' + val.name + '">' + val.label + ': </label>';
                html += "</td>";

                html += '<td class="' + popupDivContentDivInputClass + '">';

                if (val.type === "textarea") {
                    html += '<textarea id="popupInput_' + val.name + '" name="' + val.name + '" ' + val.htmlProperties + ' >' + val.value + '</textarea>';
                }
                else if (val.type === "select") {
                    html += '<select id="popupInput_' + val.name + '" name="' + val.name + '" ' + val.htmlProperties + ' >';

                    $.each(val.selectOptions, function (idxO, valO) {
                        var _val = valO.value;
                        var _lab = valO.label;
                        var _extra = "";
                        if (_val === val.value) {
                            _extra = "selected";
                        }
                        html += '<option ' + _extra + ' value="' + _val + '">' + _lab + '</option>';
                    });
                    html += '</select>';
                }
                else {
                    html += '<input id="popupInput_' + val.name + '" name="' + val.name + '" value="' + val.value + '" type="' + val.type + '" ' + val.htmlProperties + ' />';
                }
                html += "</td>";
                html += '<td class="' + popupDivContentDivValidationClass + '" id="popupValidation_' + val.name + '"></td>'

                html += "</tr>";
            });

            html += "</tbody></table>";

        }

        //custom html
        if (type === notifyTypeCustom) {
            html += '<div id="' + popupDivContentDivCustomHtmlId + '">' + customHtml + '</div>';
        }

        //append the inputs
        html += "<p>";
        if (buttonOptions.ok != null && buttonOptions.ok != "") {
            html += '<input type="button" id="' + popupDivContentDivOKButtonId + '" class="' + popupDivContentDivButtonClass + '" value="' + buttonOptions.ok + '"/>';
        }

        //if form or confirm, requires cancel button
        if (buttonOptions.cancel != null && buttonOptions.cancel != "" && (type === notifyTypeForm || type === notifyTypeConfirm || type === notifyTypeCustom)) {
            html += '<input type="button" id="' + popupDivContentDivCancelButtonId + '" class="' + popupDivContentDivButtonClass + '" value="' + buttonOptions.cancel + '"/>';
        }
        html += "</p>";

        popupDivContentDiv.append(html);

        var popupDivCustomHtml = popupDivContentDiv.find("#" + popupDivContentDivCustomHtmlId);

        popupDivContentDiv.find("table").css("margin", "auto");
        var textareas = popupDivContentDiv.find("table tbody tr td." + popupDivContentDivInputClass + " textarea");
        var selects = popupDivContentDiv.find("table tbody tr td." + popupDivContentDivInputClass + " select");
        var inputs = popupDivContentDiv.find("table tbody tr td." + popupDivContentDivInputClass + " input");
        var validations = popupDivContentDiv.find("table tbody tr td." + popupDivContentDivValidationClass);

        var allformitems = popupDivContentDiv.find("table tbody tr td." + popupDivContentDivInputClass + " textarea, table tbody tr td." + popupDivContentDivInputClass + " select, table tbody tr td." + popupDivContentDivInputClass + " input");

        //styling validation
        validations.css("color", "red");
        validations.css("text-align", "left");

        //styling inputs
        inputs.css("width", "300px");
        inputs.css("height", "30px");
        inputs.css("padding", "5px");
        inputs.css("border-radius", "5px");
        inputs.css("border", "1px solid black");

        selects.css("width", "300px");
        selects.css("height", "30px");
        selects.css("padding", "5px");
        selects.css("border-radius", "5px");
        selects.css("border", "1px solid black");

        textareas.css("width", "300px");
        textareas.css("height", "100px");
        textareas.css("padding", "5px");
        textareas.css("border-radius", "5px");
        textareas.css("border", "1px solid black");

        //setup allformitem change event
        allformitems.change(function () {
            var inp = $(this);
            var _name = inp.attr("name");
            var _value = inp.val();

            $.each(inputOptions, function (idx, val) {
                if (val.name === _name) {
                    val.value = _value;
                }

                if (val.validationContainer === undefined || val.validationContainer === null) {
                    val.validationContainer = popupDivContentDiv.find("#popupValidation_" + val.name);
                }
            });
        });

        allformitems.change();

        var popupOKButton = popupDivContentDiv.find("#" + popupDivContentDivOKButtonId);
        var popupCancelButton = popupDivContentDiv.find("#" + popupDivContentDivCancelButtonId);
        var popupButtons = popupDivContentDiv.find("." + popupDivContentDivButtonClass);

        //styling buttons
        popupOKButton.css("background-color", "lightgreen");
        popupCancelButton.css("background-color", "lightcoral");
        popupButtons.css("margin", "10px");
        popupButtons.css("width", "200px");
        popupButtons.css("height", "50px");
        popupButtons.css("border", "1px solid black");
        popupButtons.css("border-radius", "2px");
        popupButtons.css("box-shadow", "0 0 15px rgba(0,0,0,0.5)");
        popupButtons.css("-moz-box-shadow", "0 0 15px rgba(0,0,0,0.5)");
        popupButtons.css("-webkit-box-shadow", "0 0 15px rgba(0,0,0,0.5)");
        popupButtons.css("font-weight", "bold");
        popupButtons.css("font-size", "20px");

        //popup is initialised
        if (functionInitialised != undefined && functionInitialised != null && typeof (functionInitialised) === "function") {
            functionInitialised(popupDivCustomHtml, popupOKButton, popupCancelButton);
        }

        //setting up event for cancel button click
        popupCancelButton.click(function () {
            if (functionCancel != undefined && functionCancel != null && typeof (functionCancel) === "function") {
                var result = functionCancel();
                if (!(result === false)) {
                    popupDiv.remove();
                }
            }
            else {
                popupDiv.remove();
            }
        });

        //setting up event for ok button click
        popupOKButton.click(function () {
            if (functionOK != undefined && functionOK != null && typeof (functionOK) === "function") {
                //if (inputOptions.length === 1) {
                //    inputOptions = inputOptions[0];
                //}
                var result = functionOK(inputOptions);
                if (!(result === false)) {
                    popupDiv.remove();
                }
            }
            else {
                popupDiv.remove();
            }
        });

        if (popupCancelButton.length > 0) {
            popupCancelButton.focus();
        }
        else if (popupOKButton.length > 0) {
            popupOKButton.focus();
        }

        //sets max height of the container on window resize
        var resizeWindow = function () {
            var windowheight = $(window).height();
            var maxheight = windowheight - maxTopOffsetPixels;
            popupDivContent.css("max-height", maxheight + "px");
        }

        resizeWindow();
        $(window).resize(function () {
            resizeWindow();
        });
    }

    //processes data in the options to get popup ready for rendering
    var notifyWithOptions = function (options, functionOK, functionCancel, functionInitialised) {

        var text = options.text;
        var type = options.type;
        var buttonOptions = options.buttonOptions;
        var inputOptions = options.inputOptions;
        var customHtml = options.customHtml;

        if (text === undefined || text === null) {
            text = "";
        }
        if (type === undefined || type === null) {
            type = notifyTypeAlert;
        }
        if (customHtml === undefined || customHtml === null) {
            customHtml = "";
        }
        if (buttonOptions === undefined || typeof (buttonOptions) != "object") {
            buttonOptions = { ok: "OK", cancel: "Cancel" };
        }
        else {
            if (buttonOptions.ok === undefined) {
                buttonOptions.ok = "OK";
            }
            if (buttonOptions.cancel === undefined) {
                buttonOptions.cancel = "Cancel";
            }
        }
        if (inputOptions === undefined || typeof (inputOptions) != "object") {
            inputOptions = [{ name: "Confirm", value: "", type: "text", htmlProperties: "" }];
        }
        else {
            $.each(inputOptions, function (idx, val) {
                if (val.name === undefined || val.name === null || val.namecancel === "") {
                    val.name = "Input1";
                }
                if (val.label === undefined || val.label === null || val.label === "") {
                    val.label = val.name;
                }
                if (val.value === undefined || val.value === null) {
                    val.value = "";
                }
                if (val.type === undefined || val.type === null || val.type === "") {
                    val.type = "text";
                }
                if (val.htmlProperties === undefined || val.htmlProperties === null) {
                    val.htmlProperties = "";
                }

                if (val.selectOptions === undefined || typeof (val.selectOptions) != "object") {
                    val.selectOptions = [];
                }
                else {
                    $.each(val.selectOptions, function (idx2, val2) {
                        if (val2.value === undefined || val2.value === null) {
                            val2.value = "";
                        }
                        if (val2.label === undefined || val2.label === null) {
                            val2.label = "";
                        }
                    });
                }
            });
        }

        renderPopup(text, type, customHtml, buttonOptions, inputOptions, functionOK, functionCancel, functionInitialised);
    };

    //parse options into object to help generate view
    if (typeof (options) === "object") {
        notifyWithOptions(options, functionOK, functionCancel, functionInitialised);
    }
    else if (options != undefined && options != null) {
        //treats the popup like a standard alert() function
        notifyWithOptions({ text: options, type: notifyTypeAlert }, functionOK, functionCancel, functionInitialised);
    }
};

var notifyTypeAlert = "alert";
var notifyTypeWarning = "warning";
var notifyTypeConfirm = "confirm";
var notifyTypeError = "error";
var notifyTypeForm = "form";
var notifyTypeCustom = "custom";
