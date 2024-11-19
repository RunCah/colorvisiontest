console.log('hello world!');
var maincolorbox = document.getElementById('maincolortable');
var but1 = document.getElementById('but1');
var but2 = document.getElementById('but2');
var but3 = document.getElementById('but3');
var but4 = document.getElementById('but4');
var but5 = document.getElementById('but5');
var buttons = [but1, but2, but3, but4, but5];
var scoretext = document.getElementById('scoretext');
var perctext = document.getElementById('perctext');
var percbox = document.getElementById('percentagebox');
var maincolortext = document.getElementById('maincolortext');

const scrollsfxpath = 'scroll.mp3';

var maincolor;
var puregrey = '#545454';
var colors = [0, 0, 0, 0, 0];

//if some1 is actually colorblind, how will they see the accuracy color - Kum Kim
var accuracy_ceiling = 80;
var score = 0;
var correct_index = 0;
var color_range = 80;
var total_attempts = 0;
var perc = 100;

//now making the automatic difficulity system
var maxrange = 120;
var minrange = 25;
var attempt_span = 40; //in how many attempts should we come from 100 to 5

var colorsRange = [
    "#8b0000", "#940000", "#9d0000", "#a60000", "#af0000", "#b80000", "#c10000", "#ca0000", "#d30000", "#dc0000", 
    "#e50000", "#ee0000", "#f70000", "#ff0000", "#ff1a00", "#ff3300", "#ff4d00", "#ff6600", "#ff8000", "#ff9900", 
    "#ffa500", "#ffac00", "#ffb200", "#ffb800", "#ffbf00", "#ffc500", "#ffcc00", "#ffd200", "#ffd800", "#ffdf00", 
    "#ffe500", "#ffec00", "#fff200", "#fff800", "#ffff00", "#fcff00", "#f9ff00", "#f6ff00", "#f3ff00", "#f0ff00", 
    "#ecff00", "#e9ff00", "#e6ff00", "#e3ff00", "#e0ff00", "#dcff00", "#d9ff00", "#d6ff00", "#d3ff00", "#d0ff00", 
    "#ccff00", "#c9ff00", "#c6ff00", "#c3ff00", "#c0ff00", "#bcff00", "#b9ff00", "#b6ff00", "#b3ff00", "#b0ff00", 
    "#acff00", "#a9ff00", "#a6ff00", "#a3ff00", "#a0ff00", "#9cff00", "#99ff00", "#96ff00", "#93ff00", "#90ff00", 
    "#8cff00", "#89ff00", "#86ff00", "#83ff00", "#80ff00", "#7cff00", "#79ff00", "#76ff00", "#73ff00", "#70ff00", 
    "#6cff00", "#69ff00", "#66ff00", "#63ff00", "#60ff00", "#5cff00", "#59ff00", "#56ff00", "#53ff00", "#50ff00", 
    "#4cff00", "#49ff00", "#46ff00", "#43ff00", "#40ff00", "#3cff00", "#39ff00", "#36ff00", "#33ff00", "#30ff00"
];

function scrollsfxPlay() {
    const sound = new Audio(scrollsfxpath);
    sound.play();
}

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function maincolortextOver()
{
    maincolortext.style.color = rgbToHex((255 - hexToRgb(maincolor).r + 20) % 256, (255 - hexToRgb(maincolor).g + 20) % 256, (255 - hexToRgb(maincolor).b + 20) % 256);
}

function maincolortextLeave()
{
    maincolortext.style.color = maincolor;
}

function maincolorToClipboard()
{
    navigator.clipboard.writeText(maincolor);
    alert('Copied to clipboard.');
}

function generate_new_colors()
{
    //this one function should define a new maincolor, put it in, and then, depending on difficulty,
    //set a range in which new colors can be, and then accordingly generate the five differentials, and thus calculate
    //the actual colors, 1 to 5, and then put them in. so looking forward to this(im not really, i want to sleep, but i also kinda want to make at least a barely working version of this)
    //OF COURSE, one of them should have a differential of 0, and we can do that at the very end, just changing one of them to the main color, hopefully
    maincolor = rgbToHex(getRandomIntInclusive(0, 255), getRandomIntInclusive(0, 255), getRandomIntInclusive(0, 255));
    maincolorbox.style.backgroundColor = maincolor;
    maincolortext.innerHTML = maincolor;
    maincolortext.style.color = maincolor;

    //before that, we set the range
    color_range = ((minrange - maxrange)/attempt_span) * total_attempts + maxrange;
    if (color_range > maxrange) color_range = maxrange;
    if (color_range < minrange) color_range = minrange;

    //now to generate five range-random colors
    //you have to add % 256
    //and also somehow negative numbers as well!
    colors.forEach((col, index) => {
        col = rgbToHex((hexToRgb(maincolor).r + getRandomIntInclusive(-color_range, color_range) + 256) % 256, 
                       (hexToRgb(maincolor).g + getRandomIntInclusive(-color_range, color_range) + 256) % 256,
                       (hexToRgb(maincolor).b + getRandomIntInclusive(-color_range, color_range) + 256) % 256);
        buttons[index].style.backgroundColor = col;
    });
    
    //now choosing the correct index
    correct_index = getRandomIntInclusive(0, 4);
    colors[correct_index] = maincolor;
    buttons[correct_index].style.backgroundColor = maincolor;

    //we should also change the bg color of perc box based on how good is it
    //0-25: grey, 25-50 hard red, 50-70 orange, 70-80 yellow, 80-90 greenish yellow, 90 to 100 green solid
    //we need more colors and a smarter system
    //btw for the first time am programming using ai, and i think it is actually a good thing, 
    //not like it is writing everything, but it comes up with either very boring stuff, or just finds something stupid instead of stackoverflow
    //i think it will make stack obsolete, not programmers

    //we just need more ranges
    //AND DONT FORGET TO MAKE SOMETIMES THAT THE RIGHT ANSWER is wrong
   /* if (90 <= perc && perc <= 100)
    {
        percbox.style.backgroundColor = weighted_perc_mix('#2cba00');
    }
    else if (80 <= perc && perc < 90)
    {
        percbox.style.backgroundColor = weighted_perc_mix('#a3ff00');
    }
    else if (70 <= perc && perc < 80)
    {
        percbox.style.backgroundColor = weighted_perc_mix('#fff400');
    }
    else if (50 <= perc && perc < 70)
    {
        percbox.style.backgroundColor = weighted_perc_mix('#ffa700');
    }
    else if (25 <= perc && perc < 50)
    {
        percbox.style.backgroundColor = weighted_perc_mix('#ff0000');
    }
    else if (perc < 25)
    {
        percbox.style.backgroundColor = puregrey;
    }*/

    //lets test the arrays out
    percbox.style.backgroundColor = weighted_perc_mix(colorsRange[Math.trunc(perc)-1]);
}

function squeeze(index)
{
    //im sorry i have to hard code it, but i really dont care that much bro
    buttons[index].style.width = '190px';
    buttons[index].style.height = '190px';
    scrollsfxPlay();
}

function release(index)
{
    buttons[index].style.width = '200px';
    buttons[index].style.height = '200px';
}

function weighted_perc_mix(hexcolor)
{
    //the alg is total_attempts / accuracy ceiling = k of pure color in total, but if k>1 k = 1, so at accuracy ceiling we should have a pure color
    //then weighted average (k * color) + (1-k) * grey // 2 and thats the color
    coef = total_attempts / accuracy_ceiling;
    if (coef > 1) coef = 1;
    red = Math.round(((coef * hexToRgb(hexcolor).r) + ((1 - coef) * hexToRgb(puregrey).r)));
    green = Math.round(((coef * hexToRgb(hexcolor).g) + ((1 - coef) * hexToRgb(puregrey).g)));
    blue = Math.round(((coef * hexToRgb(hexcolor).b) + ((1 - coef) * hexToRgb(puregrey).b)));
    return rgbToHex(red, green, blue);
}

function cbut_click(index)
{
    //we need to check if it was winning, and change the scores aproprately, then reset all the vars, and to a gen colors
    //you need the or for the case where there are two randomly correct colors
    if (index == correct_index || buttons[index].style.backgroundColor == maincolor)
    {
        bad_luck = getRandomIntInclusive(0, 9);
        //you won
        if (bad_luck != 7 || total_attempts / attempt_span < 0.5){
            //we add the 0.5 thing, to not make things too obvious in the beggining
            score = score + 1;
        }
        else if (bad_luck == 7)
        {
            //bad luck strikes
            console.log('you got scammed lil bro');
        } 
    }

    total_attempts = total_attempts + 1;
    if (total_attempts >= 100)
    {
        //lets make the text smaller
        scoretext.style.fontSize = "40px";
    }
    scoretext.innerHTML = score + "/" + total_attempts;
    perc = (score/total_attempts) * 100;
    perctext.innerHTML = Math.trunc(perc) + "%";
    generate_new_colors();
}

generate_new_colors();


//it would be so fun if you made like even if they clicked correct, one out of ten times it would still say they are wrong.
//then you sell them the idea that they are color blind, genious. then they stay at ur site and watch ur ads izi money
