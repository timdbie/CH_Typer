$("document").ready(function() {        
    $("#typer").css("display", "block")
    $("#typer").focus()
    selectedtimer = 14
    wpmval = 0.25

    function startTyper () {
        words = [];
        i = 0;
        w = 0;
        l = 0;
        correctentries = 0;
        incorrectentries = 0;
        totalentries = 0;
        totalkeystrokes = 0;
        totalerrors = 0;
        inputlength = 0;
        toppos = 0;
        firstline = true;
        timerstarted = false;
        endingpopup = false;

        generateWords(300)
        checkChar()
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
        $(".header-timercnt button").removeClass("selectedtimer")
        $(this).addClass("selectedtimer")
        selectedtimer = parseInt($(this).val())
        wpmval = (selectedtimer + 1) / 60
        $("#typer").focus()
    });


    function endingPopUp() {
        $("#typer").blur()
        $("#endingpopup").fadeTo("fast", 1)

        totalentries = correctentries + incorrectentries
        typedwords = totalentries / 5
        grosswpm = typedwords / wpmval
        grosswpmval = Math.round(grosswpm)

        typedcorrectwords = correctentries / 5
        netwpm = typedcorrectwords / wpmval
        netwpmval = Math.round(netwpm)

        accuracy = Math.round(((totalkeystrokes - totalerrors) / totalkeystrokes) * 100)

        $("#wpm h1").html(netwpmval)
        $("#rawwpm").html("raw: " + grosswpmval + " WPM")

        $("#accuracy h1").html(accuracy)
        $("#entries").html("entries: " + correctentries + "/" + incorrectentries)

        $.post({
            url: '/',
            data: {netwpmval, selectedtimer}
        })

        endingpopup = true
    }


    function refreshTyper() {
        $("#typer").blur()
        $("#typer").val("")
        if (timerstarted){ 
            clearInterval(timer);
            $(".contentbox-timer").empty()
        }

        if (endingpopup) {
            $("#endingpopup").fadeTo("fast", 0)
        }

        $("#cursor").appendTo(".contentbox-wordscnt")
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

    function submitInput() {
        text = $("#typer").val();

        if (text != words[w]) {
            $(`.w${w} > span`).css("border-bottom", "2px solid crimson")
        }


        $("#typer").val("");

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

        l = 0;
        checkChar()
        inputlength = 0;
    }

    function checkChar() {
        if (l == 0) {
            $("#cursor").appendTo(`.w${w} > .l${l + 1}`)

            $("#cursor").css({
                "left" : "-2px",
                "right" : "auto"
            })
        } else {
            $("#cursor").appendTo(`.w${w} > .l${l}`)

            $("#cursor").css({
                "left" : "auto",
                "right" : "-1px"
            })
        }
    }

    $("#typer").on("input", function() {
        if (timerstarted == false) {
            startTimer()
        }

        if ($("#typer").val().length < inputlength) {
            if($(`.w${w} > .l${l}`).hasClass("incorrect")) {
                $(`.w${w} > .l${l+1}`).removeClass("incorrect")
                incorrectentries--;
            } else if (correctentries > 0){
                correctentries--;
            }
            
            $(`.w${w} > .l${l}`).css("color", "rgba(255,255,255,0.20)")
            l--;
            checkChar()
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) != words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "crimson")
                    $(`.w${w} > .l${l+1}`).addClass("incorrect")
                    incorrectentries++;
                    totalerrors++;
                } else {
                    $(`.w${w} > .l${l+1}`).css("color", "white")
                    correctentries++;
                }
                totalkeystrokes++;
                l++;
                checkChar()
            }
        }
        inputlength = $("#typer").val().length;
    });

    $(".header-lbcnt").click( function(){
        $(".leaderboard-cnt").css("display", "flex")
    })

    $(".header-usercnt").click( function(){
        $(".user-cnt").css("display", "flex")
    })

    $("#leaderboard-closebtn").click( function(){
        $(".leaderboard-cnt").css("display", "none")
    })

    $("#user-closebtn").click( function(){
        $(".user-cnt").css("display", "none")
    })
    
    

    $("#leaderboard-btn1").click( function() {
        $(".leaderboard-15s").css("display", "block")
        $(".leaderboard-30s").css("display", "none")
        $(".leaderboard-60s").css("display", "none")

        $("#leaderboard-btn1").css("color", "#FAF000")
        $("#leaderboard-btn2").css("color", "white")
        $("#leaderboard-btn3").css("color", "white")
    })

    $("#leaderboard-btn2").click( function() {
        $(".leaderboard-15s").css("display", "none")
        $(".leaderboard-30s").css("display", "block")
        $(".leaderboard-60s").css("display", "none")

        $("#leaderboard-btn1").css("color", "white")
        $("#leaderboard-btn2").css("color", "#FAF000")
        $("#leaderboard-btn3").css("color", "white")
    })

    $("#leaderboard-btn3").click( function() {
        $(".leaderboard-15s").css("display", "none")
        $(".leaderboard-30s").css("display", "none")
        $(".leaderboard-60s").css("display", "block")

        $("#leaderboard-btn1").css("color", "white")
        $("#leaderboard-btn2").css("color", "white")
        $("#leaderboard-btn3").css("color", "#FAF000")
    })

    $.ajax(
        {
        url: "http://localhost:3000/leaderboard15s", 
        method: 'POST',
        success: function(res){
            let i = 0
            let c = 2
            while (i < 10) {
                if(c == 2) {
                    c = 1
                } else {
                    c = 2
                }

                row = `<div class="leaderboard-row${c}"><p>${i+1}. ${res[i].username}</p><p>${res[i].pb_15} WPM</p></div>`
                $(".leaderboard-15s").append(row)
                i++;
            }
        }
    })

    $.ajax(
        {
        url: "http://localhost:3000/leaderboard30s", 
        method: 'POST',
        success: function(res){
            let i = 0
            let c = 2
            while (i < 10) {
                if(c == 2) {
                    c = 1
                } else {
                    c = 2
                }

                row = `<div class="leaderboard-row${c}"><p>${i+1}. ${res[i].username}</p><p>${res[i].pb_30} WPM</p></div>`
                $(".leaderboard-30s").append(row)
                i++;
            }
        }
    })

    $.ajax(
        {
        url: "http://localhost:3000/leaderboard60s", 
        method: 'POST',
        success: function(res){
            let i = 0
            let c = 2
            while (i < 10) {
                if(c == 2) {
                    c = 1
                } else {
                    c = 2
                }

                row = `<div class="leaderboard-row${c}"><p>${i+1}. ${res[i].username}</p><p>${res[i].pb_60} WPM</p></div>`
                $(".leaderboard-60s").append(row)
                i++;
            }
        }
    })


    $(".user-profilebtn").click(changeUsername)

    function changeUsername() {
        newusername = $(".user-profileinp input").val()

        if(newusername.includes('#') == false && newusername.length >= 3){
            $.post({
                url: '/userdata',
                data: {newusername}
            })

            alert("Username was set to " + newusername)
            location.reload();
        }
    }

    $.ajax({
        url: "http://localhost:3000/userdata", 
        method: 'POST',
        success: function(res){
            username = res[0].username
            $(".header-usercnt").append("<h1>" + username + "</h1>")

            $("#pb15s").html(res[0].pb_15 + " WPM")
            $("#pb30s").html(res[0].pb_30 + " WPM")
            $("#pb60s").html(res[0].pb_60 + " WPM")

            $(".user-profileinp input").val(username)

            if (username.includes('#') == false) {
                $(".user-profileinp input").attr("disabled", true)
                $(".user-profilebtn").css("display", "none")
            }
        }
    })

});
