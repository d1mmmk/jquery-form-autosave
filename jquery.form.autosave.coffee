(($,window) ->

    storagesupport = ->
        'localStorage' of window and window['localStorage'] != null;

    inArray = (value,array)->
        for val in array
            if (val is value) then return true
        false
    autosave = "autosave";
    autosaveplugin = (form, param)->
        form_name = form.data("autosave-name")
        if not form_name then return
        data = {
            name: form_name
            values: {}
        }
        interval = null
        storagedata = JSON.parse localStorage.getItem autosave+data.name

        if storagedata
          data = storagedata

        fields = form
                    .find('input, select, textarea')
                    .filter ->
                        if (param.ignore)
                            name = $(this).attr 'name'
                            if name and not inArray(name,param.ignore)
                                $(this)
                    .each ->
                        name = $(this).attr "name"
                        for item in data.values
                            if item.name is name
                                $(this).val item.value
        getValues = ->
            value = []
            fields.each ->
                name = $(this).attr 'name'
                val = $(this).val()
                if name
                    value.push {
                        name: name
                        value: val
                    }
            value
        formSave = ->
            clearTimeout(interval)
            interval = setTimeout ->
                param.save(form)
                data.values = getValues()
                localStorage.setItem autosave+data.name, JSON.stringify data
            ,param.interval
            
        fields
            .on 'change, keypress', (e)->
                formSave()
        $(this)[autosave]['clear']= ->
            localStorage.setItem autosave+data.name, null
            fields.val('')
        this

    $["fn"][autosave] = (param) ->
        param = $.extend {
            ignore: []
            interval: 500
            save: ->
            },param
        $(this).each ->
            if not $(this).data(autosave)
                $(this).data autosave, new autosaveplugin($(this),param)
            $(this)
                        
    this
)(jQuery,window)