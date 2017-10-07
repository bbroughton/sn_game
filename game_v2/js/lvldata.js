var LevelData = [
    {
        title:"Level 1",
        score:5,
        tutorialmessage: "TDRS-C (TDRS-3) – Launched September 29, 1988 <br> First Generation TDRS: <br> ",
        tdrs_img: 'assets/img/tdrs_1.svg',
        hubble: false,
        iss: false,
        sat_speed:300,
        gen_modal: 'gen-1-info-modal',
        lvl_info: "a Pop-Quiz in each level will give you the opportunity for unique level boosts"

    },
    {
        title:"Level 2",
        score:5,
        tutorialmessage: 'TDRS-E (TDRS-5) – Launched August 02, 1991 <br> First Generation TDRS',
        tdrs_img: 'assets/img/tdrs_1.svg',
        hubble: false,
        iss: false,
        sat_speed:320,
        gen_modal: 'gen-1-info-modal',
        lvl_info: "The speed of the passing satellites will increase with each level"


    },
    {
        title:"Level 3",
        score:5,
        tutorialmessage: 'TDRS-F (TDRS-6) – Launched January 13, 1993 <br> First Generation TDRS',
        tdrs_img: 'assets/img/tdrs_1.svg',
        hubble: true,
        iss: false,
        sat_speed:340,
        gen_modal: 'gen-1-info-modal',
        lvl_info: "In the following level you will come across a special satellite that is served by the TDRS constellation"


    },
    {
        title:"Level 4",
        score:5,
        tutorialmessage: 'TDRS-G (TDRS-7) – Launched July 13, 1995 <br> First Generation TDRS',
        tdrs_img: 'assets/img/tdrs_1.svg',
        hubble: true,
        iss: false,
        sat_speed:  370,
        gen_modal: 'gen-1-info-modal',
        lvl_info: ""

    },
    {
        title:"Level 5",
        score:5,
        tutorialmessage: 'TDRS-H (TDRS-8) – Launched June 30, 2000 <br> Second Generation TDRS',
        tdrs_img: 'assets/img/tdrs_2.svg',
        hubble: true,
        iss: false,
        sat_speed:400,
        gen_modal: 'gen-2-info-modal',
        lvl_info: "In this level, you are introduced to the first of the second generation of TDRS",
        boost: function() {sat_speed -=200;}, // slow down satellites
        boost_message: '',
        boost_timed: 20
    },
    {
        title:"Level 6",
        score:5,
        tutorialmessage: 'TDRS-I (TDRS-9) – Launched March 8, 2002 <br> Second Generation TDRS',
        tdrs_img: 'assets/img/tdrs_2.svg',
        hubble: true,
        iss: true,
        sat_speed:40,
        gen_modal: 'gen-2-info-modal',
        lvl_info: "This level introduces another noteworthy customer of the SN",
        boost: function() {nextFire -= 200;}, //increase the  rate of signal launch (more signals)
        boost_message: '',
        boost_timed: 20
    },
    {
        title:"Level 7",
        score:5,
        tutorialmessage: 'TDRS-J (TDRS-10) – Launched December 4, 2002 <br> Second Generation TDRS',
        tdrs_img: 'assets/img/tdrs_2.svg',
        hubble: true,
        iss: true,
        sat_speed:00,
        gen_modal: 'gen-2-info-modal',
        lvl_info: "",
        boost: function() {score += 0;}, //all satellites are worth 6 pts
        boost_message: '',
        boost_timed: 20
    },
    {
        title:"Level 8",
        score:5,
        tutorialmessage: 'TDRS-K (TDRS-11) – Launched January 30, 2013 <br> Third Generation TDRS',
        tdrs_img: 'assets/img/tdrs_3.svg',
        hubble: true,
        iss: true,
        sat_speed:50,
        gen_modal: 'gen-3-info-modal',
        lvl_info: "Welcome to the third generation of TDRS!",
        boost: function() {max_sat_space -= 1000;}, //more satellites
        boost_message: '',
        boost_timed: 20    
    },
    {
        title:"Level 9",
        score:5,
        tutorialmessage: 'TDRS-L (TDRS-12) – Launched January 23, 2014 <br> Third Generation TDRS',
        tdrs_img: 'assets/img/tdrs_3.svg',
        hubble: true,
        iss: true,
        sat_speed:600,
        gen_modal: 'gen-3-info-modal',
        lvl_info: "",
        boost: function() {fireRate += 200;}, //faster signals
        boost_message: '',
        boost_timed: 20    
    },
    {
        title:"Level 10",
        score:5,
        tutorialmessage: 'TDRS-M (TDRS-13) – <strong>Launched August 18, 2017 </strong><br> Third Generation TDRS',
        tdrs_img: 'assets/img/tdrs_3.svg',
        hubble: true,
        iss: true,
        sat_speed:700,
        gen_modal: 'gen-3-info-modal',
        lvl_info: "This is the final level, the most recent TDRS launched in August 2017",
        boost: function() {sat_speed -=200;}, // slow down satellites
        boost_message: '',
        boost_timed: 20    
    }];

    var quizQuestions = [
    {
        question: "How often is the Space Network Operational?",
        choice_1: " <br> <div class = \'radio\'><input id = \'one\' type=\'radio\' checked name=\'answer\' value=\'Once a month for 24 hours\'> <label for=\'one\' class=\'radio-label\'> Once a month for 24 hours </lable></div>",
        choice_2: " <br> <div class = \'radio\'><input id = \'two\' type=\'radio\' name=\'answer\' value=\'Every Tueseday for 5 hours\'> <label for=\'two\' class=\'radio-label\'> Every Tueseday for 5 hours </lable></div>",
        choice_3: " <br> <div class = \'radio\'><input id = \'three\' type=\'radio\' name=\'answer\' value=\'Every day of the year, 24 hours a day\'> <label for=\'three\' class=\'radio-label\'> Every day of the year, 24 hours a day </lable></div>",
        choice_4: " <br> <div class = \'radio\'><input id = \'four\' type=\'radio\' checked name=\'answer\' value=\'Monday-Friday throughout the year but not on holidays\'> <label for=\'four\' class=\'radio-label\'> Monday-Friday throughout the year but not on holidays </lable></div>",
        correct: 'three',
        answer: "The Space Network is operated 24 hours a day, seven days a week, 365 days per year. Operations on the network run above 99.5% proficiency every month. Usually the Space Network operates above 99.9%.",
        boost: function() {nextFire = 500; fireRate = 300;}, //increase the  rate of signal launch (more signals)
        unBoost: function() {nextFire = 600; fireRate = 800;},
        boost_message: 'For 20 seconds you will be able to increase the number of signals you can send at a time',
        boost_timed: 200
    },
    {
        question: "Which of the following are services provided by the Space Network?",
        choice_1: "Telecommunications",
        choice_2: "Tracking and clock calibration",
        choice_3: "Testing and analysis",
        choice_4: "all of the above",
        correct: 'four',
        answer: "Services provided by the Space Network are: <ul> Telecommunications Tracking and clock calibration Testing and analysis",
        boost: function() {nextFire -= 200;},//max_sat_space -= 2000, //more satellites
        boost_message: '',
        boost_timed: 20
    },
    {
        question: "Whose responsibilty is it to manage the Space Network?",
        choice_1: "The International Space Station",
        choice_2: "Kennedy Space Flight Center",
        choice_3: "Goddatd Space Flight Center",
        choice_4: "all of the above",
        correct: 'three',
        answer: "NASA Goddard Space Flight Center in Greenbelt, MD Maryland manages the operations of the Space Network. " ,
        boost: function() {fireRate += 200;}, //faster signals
        boost_message: '',
        boost_timed: 20
    },
    {
        question: "How long has the Space Network been around?",
        choice_1: "The SN was established in 2000",
        choice_2: "The Space Network has been around since the 1930's",
        choice_3: "The SN dates back to the 1970's",
        choice_4: "None of the above",
        correct: 'three',
        answer: "The Space Network dates back to the early 1970s when NASA originally formulated the concepts for the Tracking and Data Relay Satellite System (TDRSS). The first SN ground station became operational in the early 1980s and the first TDRS was launched in April 1983. Since then, the TDRSS fleet has expanded significantly and the customer base has increased in number and diversity. Space Network Ground Segment Sustainment (SGSS) is an effort to upgrade the ground hardware that supports these assets and the network.",
        boost: function() {nextFire -= 200;}, //increase the  rate of signal launch (more signals)
        boost_message: '',
        boost_timed: 20   
    }
];
