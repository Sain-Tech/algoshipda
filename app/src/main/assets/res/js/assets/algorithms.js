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

var algInsertionSort = function (array, gObjs) {
    var rObj = {};
    var _arr = [];
    var _gArr = [];

    var core = function (array) {
        var i, j, n, temp, gTemp;
        n = array.length;
        // 첫 번째 원소 단계 추가
        _arr.push({action: 'extract', from: array[0], to: array[0]});
        _arr.push({action: 'insert', from: array[0], to: array[0]});
        _gArr.push({action: 'extract', from: gObjs[0], to: gObjs[0]});
        _gArr.push({action: 'insert', from: gObjs[0], to: gObjs[0]});

        for (i = 1; i < n; i++) {
            temp = array[(j = i)];
            gTemp = gObjs[(j = i)];

            // extract
            _arr.push({action: 'extract', from: temp, to: temp});
            _gArr.push({action: 'extract', from: gTemp, to: gTemp});
            while (--j >= 0 && temp < array[j]) {
                //swap
                _arr.push({action: 'swap', from: array[j + 1], to: array[j]});
                _gArr.push({action: 'swap', from: gObjs[j + 1], to: gObjs[j]});

                array[j + 1] = array[j];
                gObjs[j + 1] = gObjs[j];
                array[j] = temp;
                gObjs[j] = gTemp;
            }
            // insert
            _arr.push({action: 'insert', from: temp, to: temp});
            _gArr.push({action: 'insert', from: gTemp, to: gTemp});
        }
        
        return array;
    }

    core(array);

    rObj.a = _arr;
    rObj.g = _gArr;

    return rObj;
}

onmessage = function (e) {
    // the passed-in data is available via e.data
    switch (e.data.name) {
        case "hanoi":
            postMessage(algHanoi(e.data.n));
            break;

        case "insertionsort":
            postMessage(algInsertionSort(e.data.n, JSON.parse(e.data.g)));
            break;

        default:
            break;
    }

};