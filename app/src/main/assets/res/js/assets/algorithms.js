var algHanoi = function (n) {
    var _arr = [];
    var core = function (n, A, B, C) {
        if (n == 1) {
            var _obj = {}
            _obj.n = n;
            _obj.from = A;
            _obj.aux = B;
            _obj.to = C;
            _arr.push(_obj);
            //console.log(n, A, B, C);
            return;
        }
        core(n - 1, A, C, B);
        var _obj = {}
        _obj.n = n;
        _obj.from = A;
        _obj.aux = B;
        _obj.to = C;
        _arr.push(_obj);
        //console.log(n, A, B, C);
        core(n - 1, B, A, C);
        return;
    }
    core(n, "A", "B", "C");
    return _arr;
}

var algInsertionSort = function (array) {
    var _arr = [];
    var core = function (array) {
        var i, j, n, temp;
        n = array.length;

        for (i = 1; i < n; i++) {
            var _inarr = [];
            temp = array[(j = i)];
            while (--j >= 0 && temp < array[j]) {
                var _obj = {}
                _obj.from = array[j + 1];
                _obj.to = array[j];
                array[j + 1] = array[j];
                array[j] = temp;
                _inarr.push(_obj);
            }
            _arr.push(_inarr);
        }
        return array;
    }

    core(array);
    return _arr;
}

onmessage = function (e) {
    // the passed-in data is available via e.data
    switch (e.data.name) {
        case "hanoi":
            postMessage(algHanoi(e.data.n));
            break;

        case "insertionsort":
            postMessage(algInsertionSort(e.data.n));
            break;

        default:
            break;
    }

};