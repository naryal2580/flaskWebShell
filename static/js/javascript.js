// $(document).ready(function(){
// 	$.ajax({
// 		type: 'PROMPT',
// 		url: '/',
// 		success: function(data) {
// 			$('.screen').prepend(data);
// 		}
// 	});
// });

function logOutput(output) {
  console.log(`%c` + output, 'color: lime; background: black; font-family: monospace');
}

function execute(command) {
	if (command == 'reset') {
		clearScreen();
		clear();
		return "";
	}
	if (command == 'clear') {
		if ($('input').val() != "") {
			clearScreen();
			return "";
		}
		else {
			clear();
			return "";
		}
	}
  $.ajax({
    type: "EXEC",
    url: "/",
    data: {
      'cmd': command
    },
    success: function(data) {
      data = '> ' + command + '\n' + data + '\n\n';
      logOutput(data);
      $('pre').prepend(data)
    }
  });
}

function isTextSelected() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    if (text != ""){
      return true;
    }
    else {
      return false;
    }
}

function exec() {
  command = $('input').val();
  if (command.includes(' !!')){
    command = command.replace('!!', lastCommand)
  }
  lastCommand = command;
  execute(command);
}

function clearScreen() {
  $('pre').empty();
}

shortcut.add("Tab", function() {
  alert('Tab Not Supported Yet...');
  });


shortcut.add("Enter", function() {
  if ($('input').val()) {
    exec();
    $('input').val('');
  }
});

shortcut.add("Ctrl+L", function() {
  clearScreen();
});

shortcut.add("Shift+Esc", function() {
	if ($('input').val() != "") {
	  $('input').val('sudo ' +  $('input').val());
	}
	else {
		$('input').val('sudo !!');
	}
});

shortcut.add("Ctrl+C", function() {
  if (isTextSelected()) {
  }
  else {
    $.ajax({
      type: "SIGTERM",
      url: "/"
    })
  }
}, {
  propagate: true
});

shortcut.add("Ctrl+Shift+C", function() {
  alert('This not a real shell, Use `CTRL`+`C`');
});
