# notify.js
Custom notification tool that allows for replacement of alerts, prompts, confirms and other modal popups.

## Usage
Add file to scripts directory.

Initialise popup by calling notify method.

### Examples
**Example 1: Standard alert**
```
notify({ 
  text: "Hello world!",
  type: notifyTypeAlert 
});
```
***OR***
```
notify("Hello world!");
```

**Example 2: Confirm choice**
```
notify({ 
  text: "Hello world!", 
  type: notifyTypeConfirm, 
  buttonOptions: {
    ok: "Yes",
    cancel: "No"
  }
}, function() {
  //if "Yes" was clicked...
}, function() {
  //if "No" was clicked...
});
```

**Example 3: Warnings/Errors**
```
notify({ 
  text: "Warning!",
  type: notifyTypeWarning 
});

notify({ 
  text: "Error!",
  type: notifyTypeError 
});
```

**Example 4: Custom html**
```
var html = '<h1>This is custom html</h1>';

notify({
  text: "Custom Heading",
  type: notifyTypeCustom,
  customHtml: html,
  buttonOptions: { ok: null, cancel: "Close" }
}, function() {
  //if "OK" was clicked... will not hit this as ok button is hidden with buttonOptions: { ok: null, ... }
}, function() {
  //if "Cancel" was clicked...
}, function(popupCustomHtmlContainer, popupOKButton, popupCancelButton) {
  //popup initialised, code can go here...
  //popupCustomHtmlContainer holds the customHtml
  //popupOKButton is a handle to the ok button if used,
  //popupCancelButton is a handle to the cancel button if used
});
```

**Example 5: Input form**
The popup can also handle forms inputs, declared in json format
```
notify({
  text: "Create New Object",
  type: notifyTypeForm,
  buttonOptions: {
    ok: "Save",
    cancel: "Cancel"
  },
  inputOptions: [
    { name: "ObjectName", label: "Name", value: "", type: "text", htmlProperties: 'max-length="20"' },
    { name: "ObjectId", label: "Id", value: "1", type: "number", htmlProperties: 'min="0" readonly' },
    { name: "ObjectComment", label: "Comment", value: "No comment", type: "textarea", htmlProperties: 'disabled' },
    { name: "ObjectType", label: "Type", value: "A", type: "select", htmlProperties: '', 
      selectOptions: [
        { value: null, label: "Select type..." },
        { value: "A", label: "Type A" },
        { value: "B", label: "Type B" }
      ] }
  ]
}, function(inputResults) {
  //if "Save" was clicked...
  var validationFailed = false;
  $.each(inputResults, function (idx, val) {
    var inputname = val.name;
    var inputvalue = val.value;
    var inputlabel = val.label;
    var validationMessage = "";
    //do validation code here (optional)
    if (inputvalue === "") {
      validationMessage = inputlabel + " is a required field";
      validationFailed = true;
    }
    val.validationContainer.html(validationMessage);
  });
  
  if (validationFailed) {
    //validation failed, cancel popup close
    return false;
  }
  else {
    //perform success logic here
  }
}, function() {
  //if "Cancel" was clicked...
}, function() {
  //initialised, can do logic on inputs if necessary, styling or bind events...
});
```

**Example 6: Close popup**
The popup can be closed in code by calling the following function
```
notify();
```
