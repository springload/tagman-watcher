window.tagmanWatch = (function(global){
    const emitterRegistry = {},
          rootElement = document.documentElement;

    function emitter(e){
        if(!emitterRegistry[e.type]) return;

        emitterRegistry[e.type].map(eachEmitter.bind(undefined, e.type, e.target));
    };

    function eachEmitter(eventType, target, watcher){
        const selector = watcher.length ? watcher[1] : undefined,
              formValue = getFormValue(target);

        if(target.matches(selector)) trigger(eventType, {value: formValue}, watcher);
    }

    function getFormValue(target){
        const escape = val => {
            return val.replace(/,/g, '\\,')
        }

        let value = (target.value !== undefined) ? escape(target.value) : target.checked;

        if(target.nodeName.toLowerCase() === "select"){
            const checkedOptions = Array.prototype.slice.apply(target.options)
                    .filter(option => option.selected)
                    .map(selectedOption => escape(selectedOption.value));

            value = checkedOptions.join(', ');
        }
        return value;
    }

    function trigger(eventType, data, watcher){
        const dispatchData = Object.assign({'event': eventType}, data, (watcher && watcher.length > 2) ? watcher[2] : null);
        if(!window.dataLayer){
            if(window.console) console.warn("TagManWatcher.js: window.dataLayer is unavailable. Unable to dispatch events to Tag Manager. Data was ", dispatchData);
            return;
        }
        if(window.console) console.log("DataLayer", dispatchData);
        dataLayer.push(dispatchData);
    }

    const tagWatchManager = function tagWatchManager(){
        // Register a watcher on events occuring on elements in the page.
        // Usage:
        // singular:   fn('change', '[data-value]');
        // multiple:   fn(['change', '.class'], ['blur', 'input']);

        const argumentsArray = Array.prototype.slice.apply(arguments),
              addWatchers    = Array.isArray(argumentsArray[0]) ? argumentsArray : [argumentsArray];

        addWatchers.map( watcher => {
            const eventType = watcher[0];

            if(!emitterRegistry.hasOwnProperty(eventType)){
                emitterRegistry[eventType] = [];
                rootElement.addEventListener(eventType, emitter, true);
            }

            emitterRegistry[eventType].push(watcher);
        })
    };

    tagWatchManager.trigger = trigger;

    return tagWatchManager;
})(window);

window.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches || 
        ElementPrototype.matchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;

            while (nodes[++i] && nodes[i] != node);

            return !!nodes[i];
        }
}(Element.prototype);

