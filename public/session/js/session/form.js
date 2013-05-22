/*
 * @name: form.js
 * @description: create,edit session
 * @author: dev2geek@163.com
 * @date: 2013-05-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("session/form", function(S) {
    var Form = function(cfg) {
        if (!(this instanceof Form)) return new Form(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this._init();
    };

    S.augment(Form, {
        _init: function() {
            var _this = this;
            S.one("#J_SessionCommit").on("click", function() {
                _this.commit();
            });
        },

        validate: function() {
            var formData = S.unparam(S.IO.serialize("#J_SessionForm")),
                invalidArray = [],
                reg = /^\d\d:\d\d$/g,
                fromVal = S.trim(formData.from),
                toVal = S.trim(formData.to),
                titleVal = S.trim(formData.title),
                descVal = S.trim(formData.desc),
                speakersVal = S.trim(formData.speakers);


            var _formVal = reg.test(fromVal);
            reg.lastIndex = 0;
            if (fromVal === "" || !_formVal) {
                invalidArray.push("#J_SessionFrom");
            }

            var _toVal = reg.test(toVal);
            if (toVal === "" || !_toVal) {
                invalidArray.push("#J_SessionTo");   
            }

            if (titleVal === "" || (titleVal.length > 20)) {
                invalidArray.push("#J_SessionTitle");   
            }
            
            if (descVal === "" || (descVal.length > 2000)) {
                invalidArray.push("#J_SessionDesc");   
            }

            if (speakersVal === "" || (speakersVal.length > 100)) {
                invalidArray.push("#J_SessionSpeakers");   
            }

            return invalidArray;
        },

        commit: function() {
            S.all(".warning-head").removeClass("warning-head");

            var invalidArray = this.validate() || [];

            if (invalidArray.length === 0) {
                S.one("#J_SessionForm")[0].submit();    
            } else {
                S.each(invalidArray, function(el){
                    S.one(S.DOM.parent(el, 2)).addClass("warning-head");
                });
                return false;
            }
        }
    });

    return Form;
}, {
    requires: ["core", "node"]
});
