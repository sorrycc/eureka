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
                invalidArray = [];

            if (formData.from === "") {
                invalidArray.push("#J_SessionFrom");
            }

            if (formData.to === "") {
                invalidArray.push("#J_SessionTo");   
            }

            if (formData.title === "") {
                invalidArray.push("#J_SessionTitle");   
            }
            
            if (formData.desc === "") {
                invalidArray.push("#J_SessionDesc");   
            }

            if (formData.speakers === "") {
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
