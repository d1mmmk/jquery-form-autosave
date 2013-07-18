(function() {
  (function($, window) {
    var autosave, autosaveplugin, inArray, storagesupport;
    storagesupport = function() {
      return 'localStorage' in window && window['localStorage'] !== null;
    };
    inArray = function(value, array) {
      var val, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        val = array[_i];
        if (val === value) {
          return true;
        }
      }
      return false;
    };
    autosave = "autosave";
    autosaveplugin = function(form, param) {
      var data, fields, formSave, form_name, getValues, interval, storagedata;
      form_name = form.data("autosave-name");
      if (!form_name) {
        return;
      }
      data = {
        name: form_name,
        values: {}
      };
      interval = null;
      storagedata = JSON.parse(localStorage.getItem(autosave + data.name));
      if (storagedata) {
        data = storagedata;
      }
      fields = form.find('input, select, textarea').filter(function() {
        var name;
        if (param.ignore) {
          name = $(this).attr('name');
          if (name && !inArray(name, param.ignore)) {
            return $(this);
          }
        }
      }).each(function() {
        var item, name, _i, _len, _ref, _results;
        name = $(this).attr("name");
        _ref = data.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.name === name) {
            _results.push($(this).val(item.value));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      getValues = function() {
        var value;
        value = [];
        fields.each(function() {
          var name, val;
          name = $(this).attr('name');
          val = $(this).val();
          if (name) {
            return value.push({
              name: name,
              value: val
            });
          }
        });
        return value;
      };
      formSave = function() {
        clearTimeout(interval);
        return interval = setTimeout(function() {
          param.save(form);
          data.values = getValues();
          return localStorage.setItem(autosave + data.name, JSON.stringify(data));
        }, param.interval);
      };
      fields.on('change, keypress', function(e) {
        return formSave();
      });
      $(this)[autosave]['clear'] = function() {
        localStorage.setItem(autosave + data.name, null);
        return fields.val('');
      };
      return this;
    };
    $["fn"][autosave] = function(param) {
      param = $.extend({
        ignore: [],
        interval: 500,
        save: function() {}
      }, param);
      return $(this).each(function() {
        if (!$(this).data(autosave)) {
          $(this).data(autosave, new autosaveplugin($(this), param));
        }
        return $(this);
      });
    };
    return this;
  })(jQuery, window);

}).call(this);
