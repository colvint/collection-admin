'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _underscore3 = require('underscore.string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionAdmin = function (_React$Component) {
  _inherits(CollectionAdmin, _React$Component);

  function CollectionAdmin() {
    _classCallCheck(this, CollectionAdmin);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CollectionAdmin).apply(this, arguments));
  }

  _createClass(CollectionAdmin, [{
    key: 'render',
    value: function render() {
      var items = this.props.items;
      var headers = _underscore2.default.keys(_underscore2.default.first(items));

      return _react2.default.createElement(
        _reactBootstrap.Table,
        { className: 'table table-bordered table-striped table-hover' },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _underscore2.default.map(headers, function (header, i) {
              return _react2.default.createElement(
                'th',
                { key: i },
                (0, _underscore3.humanize)(header)
              );
            })
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          _underscore2.default.map(items, function (item, i) {
            return _react2.default.createElement(
              'tr',
              { className: 'item', key: i },
              _underscore2.default.map(headers, function (header, j) {
                return _react2.default.createElement(
                  'td',
                  { key: j, className: header },
                  item[header]
                );
              })
            );
          })
        )
      );
    }
  }]);

  return CollectionAdmin;
}(_react2.default.Component);

exports.default = CollectionAdmin;


CollectionAdmin.propTypes = {
  items: _react2.default.PropTypes.array.isRequired
};
