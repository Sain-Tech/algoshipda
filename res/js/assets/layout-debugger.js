var currentPos = `<p class="layout-debugger-cursor"></p>`;
var point = '<div class="layout-debugger-point></div>'

$(document).on('mouseover', e => {
    //console.log("mouse enter")
    $(document.body).append(currentPos);
    $('.layout-debugger-cursor').html(`${e.pageX}, ${e.pageY}`);
});

$(document).on('mouseout', e => {
    //console.log("mouse out");
    $('.layout-debugger-cursor').detach();
});

$(document).on('mousemove', e => {
    //console.log(e.pageX, e.pageY);
    $('.layout-debugger-cursor').html(`${e.pageX}, ${e.pageY}`).css({left: e.pageX + 12, top: e.pageY});
});

var clicked = 0;
var coords = [];

$(document).on('click', e => {
    if(clicked == 0) {
        $(document.body).append(`<div class="layout-debugger-point" style="left:${e.pageX - 1}px;top:${e.pageY - 1}px"><span>${e.pageX}, ${e.pageY}</span></div>`);
        coords.push({x: e.pageX, y: e.pageY});
    }
    else if(clicked == 1) {
        $(document.body).append(`<div class="layout-debugger-point" style="left:${e.pageX - 1}px;top:${e.pageY - 1}px"><span>${e.pageX}, ${e.pageY}</span></div>`);
        coords.push({x: e.pageX, y: e.pageY});

        var coords2 = coords.pop();
        var coords1 = coords.pop();

        var dist = Math.sqrt(Math.pow(coords2.x - coords1.x, 2) + Math.pow(coords2.y - coords1.y, 2));
        var midX = (coords2.x + coords1.x) / 2;
        var midY = (coords2.y + coords1.y) / 2;

        $(document.body).append(`<div class="layout-debugger-point" style="left:${midX - 1}px;top:${midY - 1}px"><span class="dists" style="margin-top: -16pt; width: 128px">${dist.toFixed(2)} (${midX}, ${midY})</span></div>`);

        //console.log(dist);
    }
    else {
        $('.layout-debugger-point').detach();
        clicked = 0;
        coords = [];
        return;
    }
    clicked++;
});