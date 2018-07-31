/*
* fingertip.js
*
*/
/*jslint browser: true, multistr: true */
/*global $*/

/* IMAGESLOADED jQuery plugin */
(function(c,q){var m="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function n(){var b=c(j),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function p(b){k(b.target,"error"===b.type)}function k(b,a){b.src===m||-1!==c.inArray(b,l)||(l.push(b),a?h.push(b):j.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),r&&d.notifyWith(c(b),[a,e,c(j),c(h)]),e.length===l.length&&(setTimeout(n),e.unbind(".imagesLoaded",
p)))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():0,r=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),l=[],j=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",p).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)k(a,e.isBroken);else if(a.complete&&a.naturalWidth!==q)k(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=m,a.src=d}):
n();return d?d.promise(g):g}})(jQuery);

var SAND = SAND || {};

SAND.Global = (function (window, document, undefined) {

    var self = {

        "init": function() {

            var sandDom = '\
                <div id="sandcontainer">\
                <canvas id="sand" width="1024" height="655"></canvas>\
                <canvas id="final" width="1024" height="655"></canvas>\
                <image id="finalimage" width="1024" height="655"></image>\
                <form id="sandform" action="index.html" method="post"><div class="close">+</div>\
                    <div class="formcontent"><h2>Vul je e-mailadres in en stuur je zandtekening op.</h2>\
                        <input type="text" id="fname" name="fname" placeholder="naam" required>\
                        <input type="text" id="lname" name="lname" placeholder="achternaam" required>\
                        <input type="email" id="email" name="email" placeholder="e-mailadres" required>\
                        <input type="checkbox" name="agree" required><p>Ik ga akkoord met de actievoorwaarden</p><br>\
                        <input type="checkbox" name="newsletter"><p>Ja, ik wil mij aanmelden voor de Bijenkorf nieuwsbrief</p>\
                        <img src="content/Images/sandapp/loading.gif" class="loading"><input type="image" id="versturen" src="content/Images/sandapp/btn.versturen.2x.jpg">\
                    </div>\
                    <div class="sandbedankt">\
                        <h2><strong>Bedankt</strong> voor je zandtekening. Bekijk alle inzendingen op Bijenkorf Beach op Facebook.</h2>\
                        <div id="tobeach"></div>\
                        <div id="sharedrawing"></div>\
                    </div>\
                </form>\
                <div id="overlay"></div>\
                <div class="popup"><div class="close">+</div><div class="popcontainer scrollable"></div></div>\
                <nav>\
                    <ul>\
                        <li class="popup_link" id="n_prizes" data-copy="prizesCopy">Prijzen &amp; Uitleg</li>\
                        <li class="popup_link" id="n_disclaimer" data-copy="disclaimerCopy">Disclaimer</li>\
                        <li class="popup_link" id="n_actievoorwaarden" data-copy="actievoorwardenCopy">Actievoorwaarden</li>\
                        <!--li class="fb_shareapp"><a id="deelopfacebook" href="http://www.facebook.com/sharer.php?event=external&s=100&p[title]=Ben jij al klaar voor de zon?&p[summary]=Schrijf je favoriete strandbestemming in het zand van Bijenkorf Beach en maak kans op luxe zomerprijzen, zoals een trolley met Cadeaucard t.w.v. 250,- om een fashionable zomerlook te shoppen.&p[url]=http://www.facebook.com/debijenkorf/app_580759258609827&p[images][0]=https://www.zandschrijven.nl/app/images/shareicon.jpg" class="fb" target="_blank">Deel op Facebook</a></li-->\
                    </ul>\
                </nav>\
                <div id="sand_close"></div>\
                <div id="upload"></div>\
                <div id="nodrawing"></div>\
                <div id="erase"></div>\
                <div id="erase_confirm"><div id="e_yes"></div><div id="e_no"></div></div>\
                <div id="teken">Draw your favourite beach destination in the sand.<br><em>Please note: this functionality is only supported on touch devices.</em></div>\
                </div>';

            if ($('#sandcontaier').length > 0) {
                $('#sandcontainer').remove();
            }

            $(document.body).append(sandDom);

            // $("#sandcontainer").imagesLoaded(self.sandbox);
            self.sandbox();
        },

        "sandbox": function() {
            // Load analytics framework
            SAND.Analytics.init();

            // get the canvas element and its context
            var canvas = document.getElementById('sand'),
                cfinal = document.getElementById('final'),
                upload = document.getElementById('upload'),
                erase = document.getElementById('erase'),
                ctx = canvas.getContext('2d'),
                ctxf = cfinal.getContext('2d'),
                img = document.createElement('IMG'),
                stamp = document.createElement('IMG'),
                tile = document.createElement('IMG'),
                shadows = document.createElement('IMG'),
                popupCopy = {},
                params = {
                    maxRadius: 10,
                    radiusWobble: 0.02,
                    numPuffs: 20,
                    puffSpread: 7,
                    puffRadius: 5,
                    puffAlpha: 0.30,
                    inertia: 0.6,
                    shadowAlpha: 0.6
                },
                drawingExists = false;


                popupCopy.prizesCopy = "<h2>Uitleg &amp; Prijzen </h2> <p><em>Welke prijzen kun je winnen?</em></p> <p><strong>1e prijs:</strong> een trolley met een Cadeaucard t.w.v. 250,- om jezelf een zomerse look te shoppen </p> <p><strong>2e prijs:</strong> een luxe weekendtas</p> <p><strong>3e prijs:</strong> een strandtas vol fijne zonnecosmetica </p> <p><em>Wat moet je doen?</em></p><p>Teken met je vinger jouw favoriete strandbestemming in het zand, stuur je tekening in en maak kans op één van de heerlijke zomerprijzen.</p><p>Je kunt meerdere keren meedoen maar via je e-mailadres maak je slechts één keer kans. De winnaars worden door middel van loting bepaald en ontvangen een persoonlijk e-mailbericht vanuit de Bijenkorf.</p><p><strong>Houd het netjes:</strong> we zien graag je zomerse boodschap tegemoet, maar onbeleefde berichten verwijderen we. Je maakt dan ook geen kans meer op de prijzen.</p>";
                popupCopy.disclaimerCopy = "<h2>Disclaimer</h2> <p>Je gegevens worden gebruikt om uitvoering te geven aan de \'Teken jezelf naar de zon\' actie van de Bijenkorf. Je e-mailadres wordt nooit verstrekt aan andere organisaties (conform de wet op bescherming persoonsgegevens) en uitsluitend gebruikt voor registratie van de e-mailnieuwsbrief van de Bijenkorf. De Bijenkorf mag jou als mogelijke prijswinnaar communiceren via Facebook.com/deBijenkorf en/of deBijenkorf.nl. Alle gegevens die de Bijenkorf verkrijgt in het kader van deze actie worden vertrouwelijk en conform de Wet Bescherming Persoonsgegevens behandeld.</p>";
                popupCopy.actievoorwardenCopy = "<h2>Actievoorwaarden</h2> <ol> <li>De Bijenkorf \"Teken jezelf naar de zon\" (hierna: <strong>de Actie</strong>) wordt aangeboden door: Magazijn \"De Bijenkorf\" B.V. kantoorhoudende aan de Hoogoorddreef 11, 1101 BA, Amsterdam (hierna: <strong>de Bijenkorf</strong>). De Actie is toegankelijk voor elke persoon van 16 jaar of ouder die in Nederland woont, met uitzondering van tijdelijke of vaste werknemers van de Bijenkorf en hun familieleden.</li> <li>De Actie loopt van woensdag 8 mei t/m maandag 27 mei 2013.</li> <li>De Actie is een Facebookactie met inzet van een applicatie, waarbij de deelnemer de naam in het zand tekent van zijn favoriete strandbestemming door met zijn vinger over het scherm van zijn/haar device te gaan. Zodra de deelnemer klaar is met tekenen klikt hij op \"Ga verder\". In het volgende scherm kan de deelnemer zijn naam en e-mailadres achterlaten, zodat hij kans maakt op één van de prijzen. De deelnemer kan zo vaak als hij wil meedoen aan het spel, maar doet per e-mailadres maar één keer mee aan de trekking voor de prijzen.</li> <li>Uit alle deelnemers worden aan het eind van de actieperiode drie (3) winnaars getrokken door de computer: <ul> <li>De 1e prijs is een Cadeaucard van de Bijenkorf t.w.v. 250,-</li> <li>De 2e prijs is een luxe weekendtas</li> <li>De 3e prijs is een strandtas vol fijne zonnecosmetica</li> </ul> </li> <li>Prijswinnaars worden na afloop van de actie bekend gemaakt op deBijenkorf.nl. Tevens worden na afloop van de actie de prijswinnaars vermeld op de landingspagina van de Facebookapplicatie. De winnaars worden door de Bijenkorf gemaild met het verzoek de contactgegevens toe te sturen aan de Bijenkorf middels een e-mail naar <a href='mailto:webcare@deBijenkorf.nl'>webcare@deBijenkorf.nl</a> o.v.v. Zandschrijven actie, zodat de prijs opgestuurd kan worden. De prijswinnaars die zich na 23 juni 2013 melden komen niet meer in aanmerking voor een prijs.</li> <li>De prijzen zullen worden toegestuurd aan de winnaars naar het door de desbetreffende deelnemer opgegeven adres. De Bijenkorf is niet verantwoordelijk voor fouten of onvolledigheden in het hiervoor bedoelde opgegeven adres danwel voor verliezen, vertragingen of defecten veroorzaakt door TNT Post of andere meewerkende partijen. De Bijenkorf draagt tevens geen enkele verantwoordelijkheid inzake ongevallen, te late leveringen, schade of bijkomende kosten van welke aard ook voortvloeiende uit de handeling/ het verzenden van de op grond van de Actie toegekende prijzen.</li> <li>De Bijenkorf kan niet verantwoordelijk gesteld worden voor technische problemen. Zij kan ook niet verantwoordelijk zijn voor, onder andere: <ul> <li>enig technisch mankement en/of vertragingen;</li> <li>mankement in het internetverkeer (wegvallen verbinding etc.).</li> </ul> </li> <li>De Prijs is persoonlijk en niet overdraagbaar en is gekoppeld aan de naam en het e-mail adres van de Deelnemer.</li> <li>Personeel van de Bijenkorf is uitgezonderd om mee te doen aan desbetreffende actie. </li> <li>De Bijenkorf behoudt zich het recht voor om bij niet-beschikbaarheid van een prijs voor een vervangende prijs te zorgen. </li> <li>Deelname aan de Actie is kosteloos.</li> <li>De Prijs is niet inwisselbaar voor geld en kan niet omgeruild worden voor andere producten of diensten.</li> <li>De Bijenkorf behoudt zich het recht voor om de Actie eenzijdig te wijzigen, op te schorten of te beëindigen. Hiervan zal mededeling worden gedaan op http://www.deBijenkorf.nl</li> <li>Deelnemers die naar het redelijk oordeel van de Bijenkorf misbruik maken van de Actie kunnen van deelname worden uitgesloten.</li> <li>De Bijenkorf is niet verantwoordelijk voor het niet of niet juist functioneren van de website of App op de computer, tablet of telefoon van de deelnemer waardoor het bericht mogelijk niet verstuurd kan worden.</li> <li>Deze Actie is uitsluitend geldig binnen Nederland.</li> <li>Op deze Actie is uitsluitend Nederlands recht van toepassing. Voor zover deze op onderhavige Actie van toepassing is, handelt de Bijenkorf in het bijzonder in overeenstemming met de Gedragscode Promotionele Kansspelen.</li> <li>De Bijenkorf is niet aansprakelijk voor eventuele typ-, druk- of zetfouten.</li> <li>In de gevallen waarin deze voorwaarden niet voorzien, zal een besluit worden genomen door de Bijenkorf.</li> <li>Heeft u een vraag, opmerking of klacht naar aanleiding van deze Actie neem dan contact op met het Klant Contact Center van de Bijenkorf, telefoonnummer 0800-0818 of stuur een email via de website deBijenkorf.nl</li> <li>Door deelname aan de Actie verklaart de Deelnemer akkoord te gaan met de bovenstaande Actievoorwaarden.</li> <li>Deze actievoorwaarden zijn te vinden op http://www.deBijenkorf.nl</li> </ol><p>April 2013, Magazijn \"De Bijenkorf\" B.V.</p>";

            // img.src= "content/Images/sandapp/sand-texture-transparent-3.png";
            // imge.src="content/Images/sandapp/sand-tile.jpg";
            // imgf.src="content/Images/sandapp/sand-tile.jpg";
            // imgt.src="content/Images/sandapp/sand-texture-29.png";


            img.src = 'content/Images/sandapp/background2.jpg';

            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                $("#sandcontainer").addClass("shown");
            };

            /************** SETUP FROM DAN */

            // sprite for outside raised puffs of sand
            stamp.src = 'content/Images/sandapp/puff3.png';

            tile.src = 'content/Images/sandapp/tile-darker3.jpg';

            shadows.src = 'content/Images/sandapp/shadows5.png';
            var tilePat = null;
            tile.onload = function() {
                tilePat = ctx.createPattern(tile, 'repeat');
            };


            $("#sandform").validate({
                submitHandler: function(form) {
                    imageUpload();
                }
            });

            var mousePos = [0, 0];
            var mouseDown = false;
            var radius = 0;     // radius of trench
            var angle = 0;      // angle of mouse motion
            var rWander = 5;    // outer radius of puffs of sand


            // move a toward b by fraction x
            function lerp(a, b, x) {
                return (1-x)*a + x*b;
            }

            /************** END SETUP FROM DAN */


            /********* FROM DAN */


            function drawStamp(x, y, angle, alpha) {
                // draw semi-circle of puffs around trench
                ctx.globalAlpha = params.puffAlpha;
                var numPuffs = Math.floor(params.numPuffs);
                for (var i = 0; i < numPuffs; ++i) {
                    var r = Math.random() * rWander;
                    var theta = angle + Math.PI*(Math.random() - 0.5);
                    var dx = (r + radius) * Math.cos(theta);
                    var dy = (r + radius) * Math.sin(theta);
                    var q = 2 + Math.random()*params.puffRadius;
                    ctx.drawImage(stamp, x+dx - 0.5*q, y+dy - 0.5*q, q, q);
                }

                // draw the trench
                ctx.globalAlpha = 0.12;
                ctx.globalAlpha = 1;
                ctx.fillStyle = tilePat;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();

                // shadow
                var shadowIndex = (128*angle/Math.PI) &0xff;
                var tx = (shadowIndex &15) * 32;
                var ty = (shadowIndex >> 4) * 32;
                ctx.globalAlpha = alpha ? alpha : params.shadowAlpha;
                var radius2 = radius*1.05;
                // using 28,28 to cut off the dark overlap from next door
                ctx.drawImage(shadows, tx, ty, 28, 28, x-radius2, y-radius2, 2*radius2, 2*radius2);

                // update values for randomness
                radius = lerp(radius, params.maxRadius * (1 + (Math.random()-0.5)), params.radiusWobble);
                rWander = lerp(rWander, 3 + Math.random()*params.puffRadius, 0.2);
            }

            function getEventPos(e) {
                if (e.touches) {
                    var touch = e.touches[0];
                    // console.log(touch.pageY, touch.clientY);
                    return [touch.pageX, touch.pageY];
                } else {
                    return [e.pageX, e.pageY];
                }
            }
            /************ END FROM DAN */




            /*********************** UTILITY METHODS */



            // erases all drawn content from the <canvas>es
            function clearCanvas() {
                canvas.width = canvas.width;
                ctx.drawImage(img,0,0);

                $("#erase_confirm").toggleClass("shown");

                drawingExists = false;

                $("#sand").one('touchstart', function() {
                    drawingExists = true;
                    $("#nodrawing").removeClass("shown");
                });
            }

            // capture the <canvas> as a base64-encoded jpg and upload to the server
            function imageUpload() {

                $(".loading").addClass("shown");

                var dataURL = canvas.toDataURL('image/jpeg'),
                    fname = $("#fname").val(),
                    lname = $("#lname").val(),
                    email = $("#email").val(),
                    newsletter = $("[name=newsletter]").is(":checked") ? "Y" : "N";

                $.ajax({
                    type: "POST",
                    url: "https://www.zandschrijven.nl/app/getimage.php",
                    data: {
                        imgBase64: dataURL,
                        firstName: fname,
                        lastName: lname,
                        email: email,
                        newsletter: newsletter
                    },
                    dataType: 'json',
                    crossDomain: true
                }).success(function(x,y,z) {
                    popupCopy.submissionUrl = x['imageUrl'];
                }).error(function(a,b,c) {
                    console.log(a);
                    console.log(b);
                    console.log(c);
                    // self.init();
                }).complete(function() {
                    $(".loading").removeClass("shown");
                    $(".formcontent").hide();
                    $(".sandbedankt").show();

                    // ctxf.drawImage(imgf, 0, 0);

                    // $("#sharedrawing a").attr("href","http://www.facebook.com/sharer.php?s=100&p[title]=Ik ben helemaal klaar voor de zon!&p[summary]=En jij? Schrijf je favoriete strandbestemming in het zand van Bijenkorf Beach en maak ook kans op een trolley met Cadeaucard t.w.v. 250,- om een fashionable zomerlook te shoppen.&p[url]="+popupCopy.submissionUrl+"&p[images][0]="+popupCopy.submissionUrl);

                });

                return false;
            }

            /*********************** EVENT HANDLERS */


            $('#sandform').on('change','input[type=checkbox]',function() {
                document.body.scrollTop = 0;
            });

            // attach the event listeners for drawing

            function startDrawing(e) {
                // set trench radius to 0 to start from a point
                radius = 0.5*params.maxRadius;
                rWander = 0;
                mousePos = getEventPos(e);
                mouseDown = true;
                drawStamp(mousePos[0], mousePos[1], 0.25);

                // prevent drag &drop
                e.preventDefault();
            }

            function moveDrawing(e) {
                if (mouseDown) {
                    var lerpAmount = Math.pow(1-params.inertia, 2);
                    var newMousePos = getEventPos(e);
                    newMousePos[0] = lerp(mousePos[0], newMousePos[0], lerpAmount);
                    newMousePos[1] = lerp(mousePos[1], newMousePos[1], lerpAmount);

                    // direction and angle of mouse
                    var dx = newMousePos[0] - mousePos[0];
                    var dy = newMousePos[1] - mousePos[1];

                    var angle = 0;
                    if (dx !== 0 &&dy !== 0)
                        angle = Math.atan2(dy, dx);

                    var dist = Math.sqrt(dx*dx + dy*dy);
                    var stepSize = 2;
                    var numSteps = Math.floor(dist/stepSize);

                    var ddx = dx/numSteps;
                    var ddy = dy/numSteps;

                    for (var i = 0; i < numSteps; ++i) {
                        mousePos[0] += ddx;
                        mousePos[1] += ddy;
                        drawStamp(mousePos[0], mousePos[1], angle);
                    }
                }
            }

            function endDrawing(e) {
                mouseDown = false;
                var newMousePos = getEventPos(e);
                var dx = newMousePos[0] - mousePos[0];
                var dy = newMousePos[1] - mousePos[1];
                var angle = Math.atan2(dy, dx);
                drawStamp(mousePos[0], mousePos[1], angle, 0.55);
            }

            canvas.addEventListener('touchstart', startDrawing);
            canvas.addEventListener('touchmove', moveDrawing);
            canvas.addEventListener('touchend', endDrawing);

            // event listener for erase button
            $("#erase, #e_no").on('touchend',function() {
                $("#erase_confirm").toggleClass("shown");
            });

            $("#e_yes").on('touchend',clearCanvas);

            upload.ontouchstart = function() {
                if (drawingExists === false) {
                    $("#nodrawing").addClass("shown");
                } else {
                    //boop
                }
            };

            $("nav").on('touchend','.popup_link', function() {
                var pcopy = $(this).data('copy');
                $(".popcontainer").html(popupCopy[pcopy]);
                $("#overlay, .popup").toggleClass("shown");
            });

            $(".close").on('touchend', function() {
                $(this).parent().toggleClass('shown');
                $("#overlay").toggleClass('shown');
                $(".popcontainer").empty();
                document.body.scrollTop = 0;
                $(window).scrollTop(0);
                window.scrollTo(0, 0);
                // $("#sand").offset({top:0, left:0});
            });

            $("#sand_close").on('touchend', function() {
                $("#sandcontainer").fadeOut('400',function() {
                    canvas.removeEventListener('touchstart',startDrawing);
                    canvas.removeEventListener('touchmove', moveDrawing);
                    canvas.removeEventListener('touchend', endDrawing);
                    $(this).remove();
                    $("#sandtrigger").show();
                });
            });

            $("#sand").one('touchstart', function() {
                drawingExists = true;
                $("#nodrawing").removeClass("shown");
                $("#teken").remove();
            });

            $("#tobeach").on("touchend",function() {
                if (confirm('Je verlaat nu de Bijenkorf App.')) {
                    document.location.href="http://www.facebook.com/debijenkorf/app_580759258609827";
                }
            });

            $("#sharedrawing").on("touchend",function(e) {
                if (confirm('Je verlaat nu de Bijenkorf App.')) {
                    document.location.href="https://www.facebook.com/dialog/feed?event=external&app_id=580759258609827&link=http://www.zandschrijven.nl/app/gallery.html&picture="+popupCopy.submissionUrl+"&name=Ik ben helemaal klaar voor de zon!&caption= &description=En jij? Schrijf je favoriete strandbestemming in het zand van <a href='https://www.facebook.com/debijenkorf/app_580759258609827'>Bijenkorf Beach</a> en maak ook kans op een trolley met Cadeaucard t.w.v. 250,- om een fashionable zomerlook te shoppen.&redirect_uri=https://www.facebook.com/debijenkorf/app_580759258609827";
                }
            });

            // prevent elastic scrolling
            //uses document because document will be topmost level in bubbling
            $("#sandcontainer").on('touchmove',function(e){
                e.preventDefault();
            });

            //uses body because jquery on events are called off of the element they are added to, so bubbling would not work if we used document instead.
            $("#sandcontainer").on('touchstart','.scrollable',function(e) {
                if (e.currentTarget.scrollTop === 0) {
                    e.currentTarget.scrollTop = 1;
                } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
                    e.currentTarget.scrollTop -= 1;
                }
            });

            //prevents preventDefault from being called on document if it sees a scrollable div
            $("#sandcontainer").on('touchmove','.scrollable',function(e) {
                e.stopPropagation();
            });
        }
    };

    return self;
} (this, this.document));

SAND.Analytics = (function (window, document, undefined) {
    'use strict';
    var self = {

        init: function() {
            $("#sandcontainer").on('touchend','ul, li, div, span, p, a, form, input, select, label, button, img', function(e) {
                var event = e.type,
                link = e.currentTarget,
                id = link.id || link.getAttribute('data-ga');
                self.trackHandler(event, id);
            });
            console.log('Analytics framework loaded');
        },

        'trackHandler': function(event, id){
            //log(_linkTrackingMap[event][id]);
            if(_linkTrackingMap[event][id]) {
                var fn = _linkTrackingMap[event][id].gaFunction;
                if(fn === 'push') {
                    // _gaq.push(['_trackEvent',_linkTrackingMap[event][id].params[0],_linkTrackingMap[event][id].params[1]]);
                    console.log("_gaq.push('_trackEvent','"+_linkTrackingMap[event][id].params[0]+"','"+_linkTrackingMap[event][id].params[1]+"');");
                }
            }
        }
    };

    var _linkTrackingMap = {
        'touchend': {
            'upload': {
                'gaFunction': 'push',
                'params': ['App','Verder']
            },
            'versturen': {
                'gaFunction': 'push',
                'params': ['App','Versturen']
            },
            'tobeach': {
                'gaFunction': 'push',
                'params': ['App','Naar Bijenkorf Beach']
            },
            'sharedrawing': {
                'gaFunction': 'push',
                'params': ['App','Delen op je tijdlijn']
            },
            'deelopfacebook': {
                'gaFunction': 'push',
                'params': ['App','Share']
            }
        }
    };

    return self;
} (this, this.document));
