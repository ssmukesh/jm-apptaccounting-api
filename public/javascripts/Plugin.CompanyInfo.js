// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "CompanyInfo",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            this.API_getCompanyInfo();
        },
        API_getCompanyInfo: function () {

            $.get("/api/qbSDK/getCompanyInfo", function (data) {

                if (data.status.QBOData != null && data.status.QBOData != undefined) {
                    var companyInfo = data.status.QBOData;
                    $("#companyName").val(companyInfo.CompanyName);
                    $("#username").val(companyInfo.Email.Address);
                    $("#email").val(companyInfo.Email.Address);
                    $("#address").val(companyInfo.CustomerCommunicationAddr.Line1);
                    $("#address2").val(companyInfo.CustomerCommunicationAddr.City);
                    $("#zip").val(companyInfo.CustomerCommunicationAddr.PostalCode);
                }

            });

        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);