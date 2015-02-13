(function($, window, document, undefined) {
	var ShareMe = function(options) {
		var defaults = {
			lang: 'fr',
			autoTrack: true
		};
		this.options = $.extend({}, defaults, options);
		this._initialize();
	};

	var p = ShareMe.prototype;
	p.options = null;
	p.newWindowDefaults = {
		location:0, // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
		menubar:0, // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
		resizable:1, // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
		scrollbars:1, // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
		status:0, // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
		width:1024, // sets the width in pixels of the window.
		height:768, // sets the height in pixels of the window.
		windowURL:null, // url used for the popup
		toolbar:0 // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
	};
	p.translations = {
		share: {
			fr: "Partager",
			en: "Share"
		}
	};

	p._initialize = function() {
		if (this.options.autoTrack && !Me.track) {
			console.warn('if you want auto tracking you need TrackMe');
		}

		var scope = this;
		$('body').on('click', 'a.external-link', function(e) {
			e.preventDefault();
			scope.openBlank($(this).attr('href'));
		});
	};

	p.openBlank = function(url, settings) {
		var windowOptions = $.extend({}, this.newWindowDefaults, settings || {});
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

	p.openSocial = function(channel, params, windowOptions) {
		var defaults = {
			url: null,
			text: null,
			t_url: null,
			t_text: null,
			media: null
		};
		params = $.extend({}, defaults, params || {});
		var shareTerm = (this.translations.share[this.options.lang]) ? this.translations.share[this.options.lang] : this.translations.share["en"];
		var windowUrl = null;
		switch(channel) {
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
		}

		if(windowUrl == null){
			console.warn("Channel doesn't exist ::", channel);
			return;
		}

		this.openBlank(windowUrl, windowOptions);
		if(this.options.autoTrack && Me.track) {
			Me.track.social(channel, shareTerm, params.url);
		}
	};

	var privateMethods = {
	};

	if(!window.Me){
		window.Me = {};
	}
	window.Me.share = new ShareMe();
}(jQuery, window, document));