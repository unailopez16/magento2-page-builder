/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config"], function (_uiEvents, _preview, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentBlock =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(ContentBlock, _Preview);

    function ContentBlock() {
      return _Preview.apply(this, arguments) || this;
    }

    var _proto = ContentBlock.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Preview.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (args) {
        if (args.preview.parent.id === _this.parent.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-identifier"] === "") {
            return;
          }

          var url = _config.getConfig("preview_url");

          var requestData = {
            identifier: attributes["data-identifier"],
            role: _this.config.name
          };
          jQuery.post(url, requestData, function (response) {
            _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return ContentBlock;
  }(_preview);

  return ContentBlock;
});
//# sourceMappingURL=content-block.js.map