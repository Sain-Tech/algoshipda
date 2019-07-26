const initsimInsertionSort = () => {
    var interval;
    
    const sets = {
        destroy: app => {
            $(app.renderer.view).detach();

            if(interval != null) {
                clearInterval(interval);
            }

            app.destroy();
            initsimInsertionSort();
        },
        makes: arr => {},
        play: animTime => {},
        pause: () => {},
        rewind: () => {},
        reset: arr => {},
        forward: animTime => {},
        backward: animTime => {}
    }

    ALG.insertionsort = sets;
}