$("document").ready(function() {
    $("#typer").css("display", "block")
    $("#typer").focus()
    selectedtimer = 14
    wpmval = 0.25

    //var wordlist = ['a', 'about', 'all', 'also', 'and', 'as', 'at', 'be', 'because', 'but', 'by', 'can', 'come', 'could', 'day', 'do', 'do', 'even', 'find', 'first', 'for', 'from', 'get', 'give', 'go', 'have', 'he', 'her', 'here', 'him', 'his', 'how', 'if', 'in', 'into', 'it', 'its', 'just', 'know', 'like', 'look', 'make', 'man', 'many', 'me', 'more', 'my', 'new', 'no', 'not', 'now', 'of', 'on', 'one', 'only', 'or', 'other', 'our', 'out', 'people', 'say', 'see', 'she', 'so', 'some', 'take', 'tell', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this', 'those', 'time', 'to', 'two', 'up', 'use', 'very', 'want', 'way', 'we', 'well', 'what', 'when', 'which', 'who', 'will', 'with', 'would', 'year', 'you', 'your'];

    function startTyper () {
        words = [];
        i = 0;
        w = 0;
        l = 0;
        totalentries = 0;
        inputlength = 0;
        toppos = 0;
        firstline = true;
        timerstarted = false;
        endingpopup = false;

        generateWords(wpmval*300)
        
        $("#typer").attr("maxlength", `${words[0].length}`)
    }
    startTyper();

    $(".contentbox-wordscnt").fadeTo("fast", 1)

    function startTimer() {
        sec = selectedtimer
        timerstarted = true
        $(".contentbox-timer").html(sec+1);

        timer = setInterval(function () {
            if (sec >= 0) {
                $(".contentbox-timer").html(sec);
                sec--;
            } else {
                clearInterval(timer);
                $(".contentbox-timer").empty()
                endingPopUp()
            }
        }, 1000);
    }

    $(".header-timercnt button").click( function() {
        selectedtimer = parseInt($(this).val())
        wpmval = (selectedtimer + 1) / 60
        $("#typer").focus()
    });


    function endingPopUp() {
        $("#typer").blur()
        $(".contentbox-wordsinp").fadeTo("fast", 1)

        typedwords = totalentries / 5
        wpm = typedwords / wpmval
        wpm = Math.round(wpm)

        $(".contentbox-wordsinp h2").html(wpm + " WPM")
        endingpopup = true
    }


    function refreshTyper() {
        $("#typer").blur()
        if (timerstarted){ 
            clearInterval(timer);
            $(".contentbox-timer").empty()
        }

        if (endingpopup) {
            $(".contentbox-wordsinp").fadeTo("fast", 0)
        }

        $(".contentbox-words").empty()
        $(".contentbox-words").css("top", "0")
        startTyper()

        $("#typer").focus()
    }

    $("#refresh").click( function() {
        $(".contentbox-words").fadeOut(150)
        $(".contentbox-timer").fadeOut(150)
        $(".contentbox-words").promise().done(function(){
            refreshTyper()
            $(".contentbox-words").fadeIn(150)
            $(".contentbox-timer").fadeIn(0)
        });
    });


    $("html").on("keydown", (e) => {
        if (e.which == 9) {
            $("#refresh").focus()
            e.preventDefault()
        }

        if (e.which == 32) {
            submitInput()
            e.preventDefault()
        }
    });

    $("html").on("keyup", (e) => {
        if (e.which == 9) {
            $("#refresh").blur()
            $("#typer").focus()
            e.preventDefault()
        }
    });

    
    $("#typer").focus( function() {
        if (endingpopup) {
            refreshTyper()
        }
    });

    $("#typer").change(submitInput)

    function submitInput() {
        text = $("#typer").val();
        $("#typer").val("");
        
        if (text == words[w]) {
            $(".w" + w + " span").css("color", "green")

            oldpos = $(".w" + w).offset().top
            w++;
            newpos = $(".w" + w).offset().top

            if (oldpos != newpos) {
                if (firstline == true) {
                    firstline = false;
                } else {
                    toppos = toppos - 50;
                    $(".contentbox-words").css("top", `${toppos}px`)
                }
            }

            $("#typer").attr("maxlength", `${words[w].length}`)
        } else {
            $(".w" + w + " span").css("color", "white")
            $(".w" + w + " span").css("opacity", "0.2")
            totalentries = totalentries - l
        }
        l = 0;
        inputlength = 0;
    }

    $("#typer").on("input", function() {
        if (timerstarted == false) {
            startTimer()
        }

        if ($("#typer").val().length < inputlength) {
            $(`.w${w} > .l${l}`).css("opacity", "0.2")
            $(`.w${w} > .l${l}`).css("color", "white")
            l--;
            totalentries--;
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) != words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "red")
                }
                $(`.w${w} > .l${l+1}`).css("opacity", "1")
                l++;
                totalentries++;
            }
        }
        inputlength = $("#typer").val().length;
    });

});
