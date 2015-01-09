function Timer(maxTime, eventHandler) {
    this.eventHandler = eventHandler;
    counter = maxTime;
    
    this.start = function() {
        var iid = setInterval(
            function() {
                if (counter <= 0) {
                    eventHandler();
                    clearInterval(iid);
                } else {
                    counter -= 1;
                }
            }, 1000);
    }
    this.get_time = function() {
        return counter;
    }
}
