/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/content", "Magento_PageBuilder/js/converter/default/attribute/link-href", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/utils/number-converter"], function (_translate, _content, _linkHref, _colorConverter, _directives, _numberConverter) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slide =
  /*#__PURE__*/
  function (_Content) {
    _inheritsLoose(Slide, _Content);

    function Slide() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Content.call.apply(_Content, [this].concat(args)) || this, _this.createValueForHref = new _linkHref(), _temp) || _this;
    }

    var _proto = Slide.prototype;

    /**
     * Get the slide wrapper styles for the storefront
     *
     * @returns {object}
     */
    _proto.getSlideStyles = function getSlideStyles(type) {
      var data = this.parent.store.get(this.parent.id);

      var style = _.clone(this.getStyle());

      var backgroundImage = "";

      if (type === "image") {
        backgroundImage = this.getImage() ? this.getStyle().backgroundImage : "none";
      }

      if (type === "mobileImage") {
        if (this.getMobileImage()) {
          backgroundImage = this.getStyle().mobileImage;
        } else {
          if (this.getImage()) {
            backgroundImage = this.getStyle().backgroundImage;
          } else {
            backgroundImage = "none";
          }
        }
      }

      return Object.assign(style, {
        backgroundImage: backgroundImage,
        backgroundSize: data.background_size,
        border: "",
        borderColor: "",
        borderRadius: "",
        borderWidth: "",
        marginBottom: "",
        marginLeft: "",
        marginRight: "",
        marginTop: "",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: ""
      });
    };
    /**
     * Get the slide overlay attributes for the storefront
     *
     * @returns {object}
     */


    _proto.getOverlayAttributes = function getOverlayAttributes() {
      var data = this.parent.store.get(this.parent.id);
      var overlayColorAttr = "transparent";

      if (data.show_overlay !== "never_show") {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          overlayColorAttr = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
        }
      }

      return {
        "data-overlay-color": overlayColorAttr
      };
    };
    /**
     * Get the slide overlay styles for the storefront
     *
     * @returns {object}
     */


    _proto.getOverlayStyles = function getOverlayStyles() {
      var data = this.parent.store.get(this.parent.id);
      var _data$margins_and_pad = data.margins_and_padding.padding,
          _data$margins_and_pad2 = _data$margins_and_pad.top,
          top = _data$margins_and_pad2 === void 0 ? 0 : _data$margins_and_pad2,
          _data$margins_and_pad3 = _data$margins_and_pad.right,
          right = _data$margins_and_pad3 === void 0 ? 0 : _data$margins_and_pad3,
          _data$margins_and_pad4 = _data$margins_and_pad.bottom,
          bottom = _data$margins_and_pad4 === void 0 ? 0 : _data$margins_and_pad4,
          _data$margins_and_pad5 = _data$margins_and_pad.left,
          left = _data$margins_and_pad5 === void 0 ? 0 : _data$margins_and_pad5;
      return {
        backgroundColor: this.getOverlayColorStyle().backgroundColor,
        minHeight: data.min_height + "px",
        paddingBottom: bottom + "px",
        paddingLeft: left + "px",
        paddingRight: right + "px",
        paddingTop: top + "px"
      };
    };
    /**
     * Get the overlay color style only for the storefront
     *
     * @returns {object}
     */


    _proto.getOverlayColorStyle = function getOverlayColorStyle() {
      var data = this.parent.store.get(this.parent.id);
      var overlayColor = "transparent";

      if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
        overlayColor = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
      }

      return {
        backgroundColor: overlayColor
      };
    };
    /**
     * Get the slide content for the storefront
     *
     * @returns {string}
     */


    _proto.getContentHtml = function getContentHtml() {
      var data = this.parent.store.get(this.parent.id);

      if (data.content === "" || data.content === undefined) {
        return;
      } else {
        return (0, _translate)(data.content);
      }
    };
    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {object}
     */


    _proto.getImage = function getImage() {
      var data = this.parent.store.get(this.parent.id);

      if (data.background_image === "" || data.background_image === undefined) {
        return false;
      }

      if (_.isEmpty(data.background_image[0])) {
        return;
      }

      return (0, _directives.getImageUrl)(data.background_image);
    };
    /**
     * Get the mobile image attributes for the render
     *
     * @returns {object}
     */


    _proto.getMobileImage = function getMobileImage() {
      var data = this.parent.store.get(this.parent.id);

      if (data.mobile_image === "" || data.mobile_image === undefined) {
        return false;
      }

      if (_.isEmpty(data.mobile_image[0])) {
        return;
      }

      return (0, _directives.getImageUrl)(data.mobile_image);
    };
    /**
     * Get the link attributes for the render
     *
     * @returns {object}
     */


    _proto.getLinkAttribute = function getLinkAttribute() {
      var data = this.parent.store.get(this.parent.id);
      var attribute = {};

      if (_typeof(data.link_url) === "object") {
        attribute.href = this.createValueForHref.toDom("link_url", data);
        attribute["data-link-type"] = data.link_url.type;
        attribute.target = data.link_url.setting === true ? "_blank" : "";
      }

      return attribute;
    };
    /**
     * Get the button style for the render
     *
     * @returns {object}
     */


    _proto.getButtonStyle = function getButtonStyle() {
      var data = this.parent.store.get(this.parent.id);
      return {
        opacity: data.show_button === "always" ? "1" : "0",
        visibility: data.show_button === "always" ? "visible" : "hidden"
      };
    };
    /**
     * Get slide container style only for the storefront
     *
     * @returns {object}
     */


    _proto.getSlideContainerStyle = function getSlideContainerStyle() {
      var style = _.clone(this.getStyle());

      return Object.assign(style, {
        backgroundImage: "",
        minHeight: "",
        padding: "",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: "",
        textAlign: ""
      });
    };

    return Slide;
  }(_content);

  return Slide;
});
//# sourceMappingURL=slide.js.map