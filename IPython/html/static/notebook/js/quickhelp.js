// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

//============================================================================
// QuickHelp button
//============================================================================

var IPython = (function (IPython) {
    "use strict";

    var platform = IPython.utils.platform;

    var QuickHelp = function (selector) {
    };
    var cmd_ctrl = 'Ctrl';

    if (platform === 'MacOS') {
        cmd_ctrl = 'Cmd';
    }

	var cm_shortcuts = [
      { shortcut:"Insert",   help:"toggle overwrite"  },
      { shortcut:"Tab",   help:"code completion" },
      { shortcut:"Shift-Tab",   help:"help introspection" },
      { shortcut: cmd_ctrl + "-]",   help:"indent"  },
      { shortcut: cmd_ctrl + "-[",   help:"dedent"  },
      { shortcut: cmd_ctrl + "-A",   help:"select all"  },
      { shortcut: cmd_ctrl + "-D",   help:"delete line"  },
      { shortcut: cmd_ctrl + "-Z",   help:"undo"  },
      { shortcut: cmd_ctrl + "-Shift-Z",   help:"redo"  },
      { shortcut: cmd_ctrl + "-Y",   help:"redo"  },
      { shortcut: cmd_ctrl + "-Up",   help:"go to cell start"  },
      { shortcut: cmd_ctrl + "-End",   help:"go to cell start"  },
      { shortcut:"PageUp",   help:"go to cell start"  },
      { shortcut:"---",   help:"go to cell end"  },
      { shortcut: cmd_ctrl + "-Down",   help:"go to cell end"  },
      { shortcut:"PageDown",   help:"go to cell end"  },
      { shortcut:"Alt-Left",   help:"go one word left"  },
      { shortcut:"Alt-Right",   help:"go one word right"  },
      { shortcut: cmd_ctrl + "-Left",   help:"go to line start"  },
      { shortcut:"Home",   help:"go to line start"  },
      { shortcut: cmd_ctrl + "-Right",   help:"go to line end"  },
      { shortcut:"End",   help:"go to line end"  },
      { shortcut:"Alt-Backspace",   help:"del word before"  },


 ]


    QuickHelp.prototype.show_keyboard_shortcuts = function () {
        // toggles display of keyboard shortcut dialog
        var that = this;
        if ( this.force_rebuild ) {
            this.shortcut_dialog.remove();
            delete(this.shortcut_dialog);
            this.force_rebuild = false;
        }
        if ( this.shortcut_dialog ){
            // if dialog is already shown, close it
            $(this.shortcut_dialog).modal("toggle");
            return;
        }
        var command_shortcuts = IPython.keyboard_manager.command_shortcuts.help();
        var edit_shortcuts = IPython.keyboard_manager.edit_shortcuts.help();
        var help, shortcut;
        var i, half, n;
        var element = $('<div/>');

        // The documentation
        var doc = $('<div/>').addClass('alert');
        doc.append(
            $('<button/>').addClass('close').attr('data-dismiss','alert').html('&times;')
        ).append(
            'The IPython Notebook has two different keyboard input modes. <b>Edit mode</b> '+
            'allows you to type code/text into a cell and is indicated by a green cell '+
            'border. <b>Command mode</b> binds the keyboard to notebook level actions '+
            'and is indicated by a grey cell border.'
        );
        element.append(doc);

        // Command mode
        var cmd_div = this.build_command_help();
        element.append(cmd_div);

        // Edit mode
        var edit_div = this.build_edit_help();
        element.append(edit_div);

	// CodeMirror shortcuts
	var cm_div = build_div('', cm_shortcuts);
        element.append(cm_div);

        this.shortcut_dialog = IPython.dialog.modal({
            title : "Keyboard shortcuts",
            body : element,
            destroy : false,
            buttons : {
                Close : {}
            }
        });
        
        $([IPython.events]).on('rebuild.QuickHelp', function() { that.force_rebuild = true;});
    };

    QuickHelp.prototype.build_command_help = function () {
        var command_shortcuts = IPython.keyboard_manager.command_shortcuts.help();
        return build_div('<h4>Command Mode (press <code>Esc</code> to enable)</h4>', command_shortcuts);
    };

    var special_case = { pageup: "PageUp", pagedown: "Page Down", 'minus': '-' };
    var prettify = function (s) {
        s = s.replace(/-$/, 'minus'); // catch shortcuts using '-' key
        var keys = s.split('-');
        var k, i;
        for (i in keys) {
            k = keys[i];
            if ( k.length == 1 ) {
                keys[i] = "<code><strong>" + k + "</strong></code>";
                continue; // leave individual keys lower-cased
            }
            keys[i] = ( special_case[k] ? special_case[k] : k.charAt(0).toUpperCase() + k.slice(1) );
            keys[i] = "<code><strong>" + keys[i] + "</strong></code>";
        }
        return keys.join('-');


    };

    QuickHelp.prototype.build_edit_help = function () {
        var edit_shortcuts = IPython.keyboard_manager.edit_shortcuts.help();
        // Edit mode
        return build_div('<h4>Edit Mode (press <code>Enter</code> to enable)</h4>', edit_shortcuts);
    };

    var build_one = function (s) {
        var help = s.help;
        var shortcut = prettify(s.shortcut);
        return $('<div>').addClass('quickhelp').
            append($('<span/>').addClass('shortcut_key').append($(shortcut))).
            append($('<span/>').addClass('shortcut_descr').text(' : ' + help));

    };

    var build_div = function (title, shortcuts) {
        var i, half, n;
        var div = $('<div/>').append($(title));
        var sub_div = $('<div/>').addClass('hbox');
        var col1 = $('<div/>').addClass('box-flex1');
        var col2 = $('<div/>').addClass('box-flex1');
        n = shortcuts.length;
        half = ~~(n/2);  // Truncate :)
        for (i=0; i<half; i++) { col1.append( build_one(shortcuts[i]) ); }
        for (i=half; i<n; i++) { col2.append( build_one(shortcuts[i]) ); }
        sub_div.append(col1).append(col2);
        div.append(sub_div);
        return div;
    };

    // Set module variables
    IPython.QuickHelp = QuickHelp;

    return IPython;

}(IPython));
