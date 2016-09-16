# TagMan Watcher

Utility for sending browser events to Google Tag Manager.

These Events can be triggered by DOM events or manually triggered.

Usage:

    tagmanWatch(DOMEvent, selectors, [customFields]);

Example:

    <script src="tagman-watcher.js"></script>
    <script>
        // listen for change events on inputs and selects
        window.tagmanWatch('change', 'input,select');

        // Also listen for blur events on selects
        window.tagmanWatch('blur', 'select');
    </script>

This could also be written more concisely as,

    <script src="tagman-watcher.js"></script>
    <script>
        window.tagmanWatch(['change', 'input,select'], ['blur', 'select']);
    </script>

And you can set additional data to be sent when the event fires by passing a third argument:

       window.tagmanWatch(['change', 'input,select', {'event':'override', color:'red'}], ['blur', 'select']);

This lets you override the event from 'change' to the Tag Manager Event that you want.

Within your app you can also trigger custom events:

    var domElement = document.querySelector("input");

    window.tagmanWatch.trigger("my-custom-event", {value: domElement.value, customKey:"foobar"});

All events must be preregistered with Tag Manager for them to received by Google Tag Manager.

## Requirements

This utility requires a global variable `dataLayer` from Tag Manager.

