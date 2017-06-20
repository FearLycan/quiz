(function () {
    var questions = [];
    $.getJSON("http://pytania.dbronczyk.pl/question/get", function (data) {
        console.log("success");
    }).done(function (data) {
        console.log("done.");
        questions = data.results;
        console.log("second success!!!");
        console.log('');
        return true;
    }).fail(function () {
        console.log("error");
        return true;
    }).always(function () {
        console.log("complete");
        return true;
    });
    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Please make a selection!');
        } else {
            questionCounter++;
            displayNext();
        }
    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
        $('#checkQuest').show();
    });

    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Creates and returns the div that contains the questions and
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        if (questions[index].status == 1) {
            var status = '<span class="good">Sprawdzone z plikiem pytań</span> → <small><a href="http://pytania.dbronczyk.pl/question/update?id=' + questions[index].questionID + '" target="_blank">Edytuj</a></small>';
        } else {
            var status = '<span class="bad">Nie sprawdzone z plikiem pytań</span>  → <small><a href="http://pytania.dbronczyk.pl/question/update?id=' + questions[index].questionID + '" target="_blank">Edytuj</a></small>';
        }


        var header = $('<h2>Pytanie ' + status + '</h2>');
        qElement.append(header);

        var title = $('<p><small>' + (index + 1) + '/'+questions.length+' </small></p>');
        qElement.append(title);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<ul>');
        var item;
        var input = '';

        //questions[index].choices = shuffle(questions[index].choices);

        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<li>');
            input = '<label>';
            input += '<input type="radio" class="radio" name="answer" value=' + i + ' />';
            input += questions[index].choices[i];
            input += '</label>';

            item.append(input);
            radioList.append(item);
        }

        $("#questionCounter").val(index);

        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }

    // check user answer
    $('#checkQuest').on('click', function (e) {
        var selection = $('input[name="answer"]:checked').val();
        var questionCounter = $('input[id="questionCounter"]').val();

        if (selection == questions[questionCounter].correctAnswer) {
            document.getElementById("quest-status").innerHTML = "<p class='good ok'>Dobrze</p>";
        } else {
            document.getElementById("quest-status").innerHTML = "<p class='bad ok'>Źle!</p>";
        }
		
		console.log('Correct: ' + questions[questionCounter].correctAnswer + ', Selected: ' + selection)
		console.log(questions[questionCounter])
		
    })

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();

            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }
                document.getElementById("quest-status").innerHTML = "";
                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
                $('#checkQuest').hide();
            }
        });
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>', {id: 'question'});

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('You got ' + numCorrect + ' questions out of ' +
            questions.length + ' right!');
        return score;
    }
})();