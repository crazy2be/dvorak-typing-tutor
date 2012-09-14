var dict = {
	wordsWith: function (letters) {
		console.log(letters);
		function containsOnly(word, letters) {
			for (var i = 0; i < word.length; i++) {
				if (!letters.contains(word[i])) return false;
			}
			return true;
		}
		results = [];
		for (var i = 0; i < dict.words.length; i++) {
			var word = dict.words[i];
			if (containsOnly(word, letters)) {
				results.push(word);
			}
		}
		return results;
	}
};

var lessons = {
	data: ["uh", "et", "on", "as", "id", "pg", ".c", ",r", ";l", "yf", "km", "jw", "qv", "'z", "xb"],
	next: function() {
	},
	load: function(num) {
		letters = "";
		var index = Math.floor(num / 2);
		if (num % 2 == 0) {
			letters = lessons.data[index];
		} else {
			for (var i = 0; i < num / 2; i++) {
				letters += lessons.data[i];
			}
		} 
		var punctuation = [" "];
		$.each('.,;', function (i, ch) {
			if (letters.indexOf(ch) != -1) punctuation = punctuation.concat([ch + ' ', ' ']);
		});
		return {
			letters: letters.split(''),
			punctuation: punctuation,
			words: dict.wordsWith(letters.split('')),
			title: num / 2 + ': ' + lessons.data[index]
		};
	}
};

function loadLesson(num) {
	var lesson = lessons.load(num);
	$('#stats-title').text(lesson.title);
	$('#stats-errors').text('');
	console.log(lesson);

	var str = '';
	for (var i = 0; i < 8; i++) {
		str += lesson.words.random() + lesson.punctuation.random();
	}

	var el = $('#current-lesson');
	el.children().remove();
	$.each(str, function (i, ch) {
		// We use nbsp here so that the last character on the line is shown.
		if (ch == " ") ch = String.fromCharCode(160);
		$("<span>").text(ch).appendTo(el);
	});
	el.children(':first-child').addClass('current');

	var prevts = 0;
	var total = 0;
	var count = 0;
	var errors = 0;
	$('body').off('keypress.dtt');
	$('body').on('keypress.dtt', function (ev) {
		if (prevts == 0) prevts = new Date();

		var typed = String.fromCharCode(ev.which == 32 ? 160 : ev.which);
		var cur = $('#current-lesson .current');
		if (cur.text() != typed) {
			if (!cur.hasClass('failed')) {
				errors++;
				cur.addClass('failed');
				percent = errors / str.length * 100;
				$('#stats-errors').text(percent.toFixed(0) + '%');
			}
			return;
		}

		if (ev.which == 32) {
			var newts = new Date();
			var delta = newts.getTime() - prevts.getTime();
			prevts = newts;

			if (delta > 10000) delta = 0; // Ignore long pauses.
			total += delta;
			count++;
			console.log(total, count);
		}

		if (cur.next().length == 0) {
			var avg = total / count;
			var wpm = 60000 / avg;
			$('#stats-speed').text(wpm.toFixed(0) + ' wpm');
			console.log(total, count, avg, errors);
			if (wpm < 30 || errors / str.length > 0.05) return loadLesson(num);
			else return loadLesson(num + 1);
		} else {
			cur.removeClass('current').next().addClass('current');
		}
	});
}

$(document).ready(function() {
	loadLesson(0);
});