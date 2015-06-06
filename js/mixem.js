
var CM = {

	/**
		* Mixem colourmixer - RGB / HSV colour mixer using sliders.
		*
		* @author        Martin Latter <copysense.co.uk>
		* @copyright     Martin Latter 05/06/2015
		* @version       0.10
		* @license       GNU GPL version 3.0 (GPL v3); http://www.gnu.org/licenses/gpl.html
		* @link          https://github.com/Tinram/Mixem.git
	*/


	aRGB : [0, 0 ,0],
	aHSV : [0, 0, 0],


	/**
		* Slider object constructor method.
		*
		* @param    string oDomElement, DOM element name
		* @param    integer iSliderMinVal, minimum slider value
		* @param    integer iSliderMaxVal, maximum slider value
		* @param    integer iSliderStep, slider increment step size
		* @param    string sSliderType, slider differentiator
	*/

	Slider: function(oDomElement, iSliderMinVal, iSliderMaxVal, iSliderStep, sSliderType) {

		var
			MAXVAL = (sSliderType === 'hue') ? 360 : ((sSliderType === 'sat' || sSliderType === 'bri') ? 100 : 255),
			oContainer, oDiv, oSlider, oSpan, oTitle,
			iMinVal = (iSliderMinVal < 0) ? 0 : iSliderMinVal,
			iMaxVal = (iSliderMaxVal > MAXVAL) ? MAXVAL : iSliderMaxVal,
			iStep = iSliderStep;

		oContainer = document.createDocumentFragment();
		oDiv = document.createElement("div");
		oSlider = document.createElement("input");
		oSlider.setAttribute("style", "width:75%");
		oSlider.setAttribute("style", "border-radius:4px");
		oSlider.setAttribute("type", "range");
		oSlider.setAttribute("min", iMinVal);
		oSlider.setAttribute("max", iMaxVal);
		oSlider.setAttribute("step", iStep);
		oSlider.setAttribute("id", "slider_" + oDomElement);

		oSlider.value = 0;
		oSpan = document.createElement("span");
		oSpan.setAttribute("id", "val_" + oDomElement);

		oSpan.innerHTML = oSlider.value;
		oTitle = document.createElement("div");
		oTitle.setAttribute("class", "desc");
		oTitle.innerHTML = oDomElement;
		oContainer.appendChild(oDiv);
		oContainer.appendChild(oSlider);
		oContainer.appendChild(oSpan);
		oContainer.appendChild(oTitle);

		document.getElementById(oDomElement).appendChild(oContainer);

		oSlider.onmousemove = function() {

			if (sSliderType === "rgb") {

				if (oDomElement === "r") {
					CM.aRGB[0] = oSlider.value;
				}
				else if (oDomElement === "g") {
					CM.aRGB[1] = oSlider.value;
				}
				else if (oDomElement === "b") {
					CM.aRGB[2] = oSlider.value;
				}

				CM.aHSV = CM.rgbToHsv(CM.aRGB[0], CM.aRGB[1], CM.aRGB[2]);
			}
			else {

				if (oDomElement === "hue") {
					CM.aHSV[0] = oSlider.value;
				}
				else if (oDomElement === "saturation") {
					CM.aHSV[1] = oSlider.value;
				}
				else if (oDomElement === "brightness") {
					CM.aHSV[2] = oSlider.value;
				}
		
				CM.aRGB = CM.hsvToRgb(CM.aHSV[0] / 360, CM.aHSV[1] * 0.01, CM.aHSV[2] * 0.01);
			}

			CM.update();
		};
	},


	/**
		* Update values.
	*/

	update: function() {

		document.getElementById("slider_r").value = CM.aRGB[0];
		document.getElementById("slider_g").value = CM.aRGB[1];
		document.getElementById("slider_b").value = CM.aRGB[2];

		document.getElementById("slider_hue").value = CM.aHSV[0];
		document.getElementById("slider_saturation").value = CM.aHSV[1];
		document.getElementById("slider_brightness").value = CM.aHSV[2];

		document.getElementById("val_r").innerHTML = CM.aRGB[0];
		document.getElementById("val_g").innerHTML = CM.aRGB[1];
		document.getElementById("val_b").innerHTML = CM.aRGB[2];

		document.getElementById("val_hue").innerHTML = CM.aHSV[0];
		document.getElementById("val_saturation").innerHTML = CM.aHSV[1];
		document.getElementById("val_brightness").innerHTML = CM.aHSV[2];

		document.getElementById("r").style.backgroundColor = "rgb(" + CM.aRGB[0] + ",0,0)";
		document.getElementById("g").style.backgroundColor = "rgb(0," + CM.aRGB[1] + ",0)";
		document.getElementById("b").style.backgroundColor = "rgb(0,0," + CM.aRGB[2] + ")";

		document.getElementById("final").style.backgroundColor = "rgb(" + CM.aRGB[0] + "," + CM.aRGB[1] + "," + CM.aRGB[2] + ")";

		document.getElementById("rgbout").innerHTML = "rgb(" + CM.aRGB.join(",") + ")";
		document.getElementById("hexout").innerHTML = "#" + CM.dec2hex(CM.aRGB[0], CM.aRGB[1], CM.aRGB[2]);
	},


	/**
		* Process RGB decimal / RGB hex colour inputs.
	*/

	input: function() {

		var
			sColour = document.getElementById("colourinput").value,
			sR = "", sG = "", sB = "",
			aTriplet = [],
			aDecs = [],
			rPermit = /[0-9a-f,#]+/i,
			rNoNum = /[0-9,]+/,
			rHex36 = /^([0-9a-f]{3})+$|^([0-9a-f]{6})+$/i, // credit: MSalters and Mark Manning
			rValidRGB = /\d{1,3},\d{1,3},\d{1,3}/;

		document.getElementById("error").innerHTML = "";

		if (sColour === "") {

			CM.errorDisplay("No RGB colour code entered!");
			return;
		}
		else if ( ! rPermit.test(sColour)) {
	
			CM.errorDisplay("Please enter a valid RGB hex code or RGB decimal triplet.");
			return;
		}

		if (sColour.indexOf(",") > -1) { // decimal

			if ( ! rNoNum.test(sColour)) {

				CM.errorDisplay("RGB triplet contains non-numbers.");
				return;
			}

			if ( ! rValidRGB.test(sColour)) {

				CM.errorDisplay("RGB triplet is not in the correct format. (e.g. 200, 100, 50)");
				return;
			}

			aDecs = sColour.split(",");

			if (aDecs[0] > 255 || aDecs[1] > 255 || aDecs[2] > 255 || aDecs[0] < 0 || aDecs[1] < 0 || aDecs[2] < 0) {

				CM.errorDisplay("RGB decimal values < 0 or > 255 are not valid.");
				return;
			}
			else {

				CM.aRGB[0] = aDecs[0];
				CM.aRGB[1] = aDecs[1];
				CM.aRGB[2] = aDecs[2];
			}
		}
		else { // hex

			sColour = sColour.replace("#", "");

			if ( ! rHex36.test(sColour)) {

				CM.errorDisplay("Please enter a valid 3 or 6 character RGB hex triplet.");
				return;
			}

			if (sColour.length === 3) {

				sR = sColour.slice(0, 1) + sColour.slice(0, 1);
				sG = sColour.slice(1, 2) + sColour.slice(1, 2);
				sB = sColour.slice(2, 3) + sColour.slice(2, 3);
			}
			else {

				sR = sColour.slice(0, 2);
				sG = sColour.slice(2, 4);
				sB = sColour.slice(4, 6);
			}

			aTriplet = CM.hex2dec(sR, sG, sB);

			CM.aRGB[0] = aTriplet[0];
			CM.aRGB[1] = aTriplet[1];
			CM.aRGB[2] = aTriplet[2];
		}

		CM.aHSV = CM.rgbToHsv(CM.aRGB[0], CM.aRGB[1], CM.aRGB[2]);

		CM.update();
	},


	/**
		* Convert decimal RGB components to hex.
		*
		* @param    string r, string g, string b
		* @return   string RGB hex code
	*/

	dec2hex: function (r, g, b) {

		var
			sHchars = "0123456789abcdef",
			sHR = sHchars.charAt((r >> 4) & 0xf) + sHchars.charAt(r & 0xf),
			sHG = sHchars.charAt((g >> 4) & 0xf) + sHchars.charAt(g & 0xf),
			sHB = sHchars.charAt((b >> 4) & 0xf) + sHchars.charAt(b & 0xf),
			sHexRGB = sHR + sHG + sHB;

			return sHexRGB;
		},


	/**
		* Convert RGB hex components to RGB decimal components.
		*
		* @param    string r, string g, string b
		* @return   array RGB components
	*/

	hex2dec: function(r, g, b) {

		var
			iDR = parseInt(r, 16),
			iDG = parseInt(g, 16),
			iDB = parseInt(b, 16),
			sDTotal = r + g + b;

		return [iDR, iDG, iDB];
	},


	/**
		* Handle input error messages.
		*
		* @param    string sMessage, the error feedback message
	*/

	errorDisplay: function(sMessage) {

		var
			oColour = document.getElementById("colourinput");

		document.getElementById("error").innerHTML = sMessage;
		oColour.focus();
	},


	/**
		* Convert RGB decimal components to HSV values.
		*
		* @link     Garry Tan, http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
		*
		* @param    string r, string g, string b
		* @return   array RGB integer components
	*/

	rgbToHsv: function (r, g, b) {

		r = r / 255;
		g = g / 255;
		b = b / 255;

		var 
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h, s, v = max,
			d = max - min,
			s = (max === 0) ? 0 : d / max;

		if (max === min) {
			h = 0; // achromatic
		}
		else {

			switch (max) {

				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return [parseInt(h * 360, 10), parseInt(s * 100, 10), parseInt(v * 100, 10)];
	},


	/**
		* Convert HSV decimal components to RGB values.
		*
		* @link     Garry Tan, http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
		*
		* @param    string h, string s, string v
		* @return   array RGB integer components
	*/

	hsvToRgb: function (h, s, v) {

		var
			r, g, b,
			i = Math.floor(h * 6),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);

		switch (i % 6) {

			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}

		return [parseInt(r * 255, 10), parseInt(g * 255, 10), parseInt(b * 255, 10)];
	}

};


/**
	* Set-up event handlers and create sliders on load.
*/

window.addEventListener('load', function() {

	var
		oR = new CM.Slider("r", 0, 255, 1, "rgb"),
		oG = new CM.Slider("g", 0, 255, 1, "rgb"),
		oB = new CM.Slider("b", 0, 255, 1, "rgb"),

		oHue = new CM.Slider("hue", 0, 360, 1, "hue"),
		oSat = new CM.Slider("saturation", 0, 100, 1, "sat"),
		oBrn = new CM.Slider("brightness", 0, 100, 1, "bri");

		document.getElementById("sub").addEventListener('click', CM.input, false);

}, false);


/**
	* Clear-up on unload.
*/

window.addEventListener('unload', function() {

	CM = null;

}, false);
