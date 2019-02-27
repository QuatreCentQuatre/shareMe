/*
 * ShareMe from the MeLibs
 * Library that let you easily share your page on medias
 *
 * Version :
 *  - 1.0.2
 *
 * Supported Medias :
 *  - Facebook
 *  - Twitter
 *  - Google Plus
 *  - Pinterest
 *
 * Dependencies :
 *  - jQuery (http://jquery.com/download/)
 *  - TrackMe, if you want autotracking (https://github.com/QuatreCentQuatre/trackMe)
 *
 * Public Methods :
 *  - setOptions
 *  - getOptions
 *  - openBlank
 *  - openSocial
 *
 * Private Methods :
 *  -
 *
 * Updates Needed :
 *  -
 */

(function($, window, document, undefined) {
	"use strict";

	/* Private Variables */
	var instanceID      = 1;
	var instanceName    = "ShareMe";
	var defaults        = {
		debug: false,
		lang: 'fr',
		autoTrack: true
	};
	var overwriteKeys   = [
		'debug',
		'lang',
		'autoTrack'
	];

	/* Private Methods */
	var privatesMethods = {};

	/* Builder Method */
	var ShareMe = function(options) {
		this.__construct(options);
	};

	var proto = ShareMe.prototype;

    /* Private Variables */
    proto.__id          = null;
    proto.__name        = null;
    proto.__debugName   = null;

    /* Publics Variables */
    proto.debug         = null;
	proto.lang          = null;
	proto.autoTrack     = null;
    proto.options       = null;
	proto.newWinDefaults = {
		location: 0,     // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
		menubar: 0,      // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
		resizable: 1,    // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
		scrollbars: 1,   // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
		status: 0,       // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
		width: 1024,     // sets the width in pixels of the window.
		height: 768,     // sets the height in pixels of the window.
		windowURL: null, // url used for the popup
		toolbar: 0       // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
	};
	proto.translations = {
		share: {
			fr: "Partager",
			en: "Share"
		}
	};

	/**
	 *
	 * __construct
	 * the first method that will be executed.
	 *
	 * @param   options  all the options that you need
	 * @return  object    null || scope
	 * @access  private
	 */
	proto.__construct = function(options) {
        this.__id        = instanceID;
        this.__name      = instanceName;
        this.__debugName = this.__name + " :: ";

		this.setOptions(options);

		if (!this.__validateDependencies()) {return null;}
		if (!this.__validateArguments()) {return null;}

		instanceID ++;
		this.__initialize();

		return this;
	};

	/**
	 *
	 * __validateDependencies
	 * Will check if you got all the dependencies needed to use that plugins
	 *
	 * @return  boolean
	 * @access  private
	 *
	 */
	proto.__validateDependencies = function() {
		var isValid = true;

		if (!window.jQuery) {
			isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required jQuery (http://jquery.com/download/)");}
		}

        if(this.autoTrack && !Me.track) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required TrackMe (https://github.com/QuatreCentQuatre/trackMe)");}
        }

		return isValid;
	};

	/**
	 *
	 * __validateArguments
	 * Will check if you got all the required options needed to use that plugins
	 *
	 * @return  boolean
	 * @access  private
	 *
	 */
	proto.__validateArguments = function() {
		var isValid = true;

        return isValid;
	};

    /**
     *
     * __initialize
     * set the basics
     * By default you can add me:share:external on a link to open it in a blank window
     *
     * @return  object scope
     * @access  private
     *
     */
    proto.__initialize = function() {
        var scope = this;

        $(document).ready(function() {
            $('body').on('click', 'a[me\\:share\\:external]', function(e) {
                e.preventDefault();

                var $el = $(e.currentTarget);

                scope.openBlank($el.attr('href'));
            });
        });
    };

	/**
	 *
	 * setOptions
	 * will merge options to the plugin defaultKeys and the rest will be set as additionnal options
	 *
	 * @param   options
	 * @return  object scope
	 * @access  public
	 *
	 */
    proto.setOptions = function(options) {
        var scope    = this;
        var settings = (this.options) ? $.extend({}, this.options, options) : $.extend({}, defaults, options);

        $.each(settings, function(index, value) {
            if ($.inArray(index, overwriteKeys) != -1) {
                scope[index] = value;
                delete settings[index];
            }
        });

        this.options = settings;

        return this;
    };

	/**
	 *
	 * getOptions
	 * return the additional options that left
	 *
	 * @return  object options
	 * @access  public
	 *
	 */
	proto.getOptions = function() {
		return this.options;
	};

    /**
     *
     * openBlank
     *
     * @access  public
     *
     */
	proto.openBlank = function(url, windSettings) {
		var windowOptions = $.extend({}, this.newWinDefaults, windSettings);
		windowOptions.windowURL = url;

		this.popupProps  = 'height=' + windowOptions.height;
		this.popupProps += ',width=' + windowOptions.width;
		this.popupProps += ',toolbar=' + windowOptions.toolbar;
		this.popupProps += ',scrollbars=' + windowOptions.scrollbars;
		this.popupProps += ',status=' + windowOptions.status;
		this.popupProps += ',resizable=' + windowOptions.resizable;
		this.popupProps += ',location=' + windowOptions.location;
		this.popupProps += ',menuBar=' + windowOptions.menubar;
		this.popupProps += ',alwaysRaised=yes';

		var centeredY = (screen.availHeight - windowOptions.height) / 2;
		var centeredX = (screen.availWidth - windowOptions.width) / 2;
		var w = window.open(windowOptions.windowURL, "_blank", this.popupProps + ',left=' + centeredX + ',top=' + centeredY);

		w.focus();
	};

    /**
     *
     * openSocial
     *
     * @access  public
     *
     */
	proto.openSocial = function(network, params, windowOptions) {
		var defaults = {
			url: null,
			text: null,
			t_url: null,
			t_text: null,
			media: null
		};

		params = $.extend({}, defaults, params || {});

		var shareTerm = (this.translations.share[this.lang]) ? this.translations.share[this.lang] : this.translations.share["en"];
		var windowUrl = null;

		switch(network) {
			case 'facebook':
				windowUrl = "//www.facebook.com/sharer.php?u=" + params.url;
				break;
			case 'twitter':
				windowUrl =  "//twitter.com/share?url=" + encodeURIComponent(params.t_url);
				windowUrl += "&text=" + encodeURIComponent(params.t_text);
				break;
			case 'gplus':
				windowUrl = "https://plus.google.com/share?url=" + params.url;
				break;
			case 'pinterest':
				windowUrl =  '//pinterest.com/pin/create/button/?media=' + encodeURIComponent(params.media);
				windowUrl += '&url=' + encodeURIComponent(params.url);
				windowUrl += '&description=' + encodeURIComponent(params.text);
				break;
			default:
				if (this.debug) {console.warn(this.__debugName + "channel doesn't exist ::", network);}
				break;
		}

		if (!windowUrl) {return;}

		if(this.autoTrack) {
			var trackUrl = (params.t_url) ? params.t_url : params.url;
			Me.track.social(network, shareTerm, trackUrl);
		}

		this.openBlank(windowUrl, windowOptions);
	};

	proto.toString = function(){
		return "[" + this.__name + "]";
	};

    /* Create Me reference if does'nt exist */
    if (!window.Me) {window.Me = {};}

	/*  */
	Me.share = new ShareMe();
}(jQuery, window, document));