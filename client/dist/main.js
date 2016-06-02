'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module("SliderApp", ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).controller('SliderCtrl', ['$scope', function ($scope) {
    //Set the metrics and initialize weightings and array of fixed metrics, that is, metrics that are checked off
    $scope.metrics = ['auV', 'au_oz', 'mcap', 'grd', 'price'];
    $scope.weightings = {
        'auV': 100,
        'au_oz': 0,
        'mcap': 0,
        'grd': 0,
        'price': 0
    };
    $scope.fixed = [];
    //Initialze range for sliders. By default, no metrics are fixed, so the full range is allowed.

    $scope.rangeMax = 100;
    $scope.rangeMin = -100;

    //Make weightings iterable (so that they can be summed over more easily)
    $scope.weightings[Symbol.iterator] = regeneratorRuntime.mark(function _callee() {
        var properties, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, p;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        properties = $scope.metrics;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 4;
                        _iterator = properties[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 13;
                            break;
                        }

                        p = _step.value;
                        _context.next = 10;
                        return this[p];

                    case 10:
                        _iteratorNormalCompletion = true;
                        _context.next = 6;
                        break;

                    case 13:
                        _context.next = 19;
                        break;

                    case 15:
                        _context.prev = 15;
                        _context.t0 = _context['catch'](4);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 19:
                        _context.prev = 19;
                        _context.prev = 20;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 22:
                        _context.prev = 22;

                        if (!_didIteratorError) {
                            _context.next = 25;
                            break;
                        }

                        throw _iteratorError;

                    case 25:
                        return _context.finish(22);

                    case 26:
                        return _context.finish(19);

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });

    $scope.toggleFix = function (metric) {
        var index = $scope.fixed.indexOf(metric);
        if (index === -1) {
            $scope.fixed.push(metric);
            if ($scope.fixed.length === $scope.metrics.length - 1) {
                var _$scope$metrics$filte = $scope.metrics.filter(function (metric) {
                    return $scope.fixed.indexOf(metric) === -1;
                });

                var _$scope$metrics$filte2 = _slicedToArray(_$scope$metrics$filte, 1);

                var last = _$scope$metrics$filte2[0];

                $scope.disableAll = true;
            }
        } else {
            $scope.fixed.splice(index, 1);
            if ($scope.fixed.length < $scope.metrics.length - 1) {
                $scope.disableAll = false;
            }
        }
    };

    $scope.sum = function () {
        var sum = 0;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = $scope.weightings[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var weight = _step2.value;

                sum += Math.abs(weight);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return sum;
    };
    //Establish watch expression for fixed metrics
    //If some metrics are fixed, the ranges for the others must be shortened
    $scope.$watchCollection('fixed', function (newVal) {
        var sumFixed = 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = $scope.fixed[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var metric = _step3.value;

                sumFixed += Math.abs($scope.weightings[metric]);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        $scope.rangeMax = 100 - sumFixed;
        $scope.rangeMin = -1 * $scope.rangeMax;
    });

    //Establish watch expression for weightings
    //to ensure absolute sum of weightings is 100.
    $scope.$watchCollection('weightings', function (newVal, oldVal) {
        //Is the absolute sum of the weightings 100?
        var sum = $scope.sum();
        // If not, adjust weightings of unchanged metrics.
        if (sum !== 100) {
            (function () {
                var diff = 100 - sum;
                var metrics = $scope.metrics;

                //Which metric changed?
                var changed = void 0;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = metrics[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _metric2 = _step4.value;

                        if (newVal[_metric2] !== oldVal[_metric2]) {
                            changed = _metric2;
                            break;
                        }
                    }
                    // Make an array of the unchanged metrics that are not fixed.
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var unchanged = metrics.filter(function (metric) {
                    return metric !== changed && $scope.fixed.indexOf(metric) === -1;
                });
                // if diff is positive, find metric to increase.
                if (diff > 0) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = unchanged[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var metric = _step5.value;

                            if ($scope.weightings[metric] >= 0 && $scope.weightings[metric] + diff <= 100) {
                                $scope.weightings[metric] += diff;
                                break;
                            } else if ($scope.weightings[metric] < 0 && $scope.weightings[metric] - diff >= -100) {
                                $scope.weightings[metric] += -1 * diff;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
                // If diff is negative, get rid of diff by deacreasing one or more metrics.
                //Have to be careful because range is from -100 to 100 and
                //we must decrease absolute values
                else {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = unchanged[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var _metric = _step6.value;

                                if ($scope.weightings[_metric] <= 0) {
                                    var inc = Math.min(-1 * diff, -1 * $scope.weightings[_metric]);
                                    $scope.weightings[_metric] += inc;
                                    diff += inc;
                                    if (diff === 0) {
                                        break;
                                    }
                                } else {
                                    $scope.weightings[_metric] += diff;
                                    var _inc = -1 * Math.min(-1 * diff, $scope.weightings[_metric]);
                                    $scope.weightings[_metric] += _inc;
                                    diff += _inc;
                                    if (diff === 0) {
                                        break;
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }
                    }
            })();
        }
    });
}]);
//# sourceMappingURL=main.js.map