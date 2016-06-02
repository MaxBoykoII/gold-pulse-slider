angular.module("SliderApp", ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('SliderCtrl', ['$scope', function($scope) {
        //Set the metrics and initialize weightings and array of fixed metrics, that is, metrics that are checked off
        $scope.metrics = ['auV', 'au_oz', 'mcap', 'grd', 'price'];
        $scope.weightings = {
            'auV': 100,
            'au_oz': 0,
            'mcap': 0,
            'grd': 0,
            'price': 0,
        };
        $scope.fixed = [];
        //Initialze range for sliders. By default, no metrics are fixed, so the full range is allowed.

        $scope.rangeMax = 100;
        $scope.rangeMin = -100;

        //Make weightings iterable (so that they can be summed over more easily)
        $scope.weightings[Symbol.iterator] = function*() {
            let properties = $scope.metrics;
            for (let p of properties) {
                yield this[p];
            }

        }

        $scope.toggleFix = function(metric) {
            const index = $scope.fixed.indexOf(metric);
            if (index === -1) {
                $scope.fixed.push(metric);
                if ($scope.fixed.length === $scope.metrics.length - 1) {
                    let [last] = $scope.metrics.filter(metric => $scope.fixed.indexOf(metric) === -1);
                    $scope.disableAll = true;

                }
            }
            else {
                $scope.fixed.splice(index, 1);
                if ($scope.fixed.length < $scope.metrics.length - 1) {
                    $scope.disableAll = false;
                }
            }
        };

        $scope.sum = function() {
                let sum = 0;

                for (let weight of $scope.weightings) {
                    sum += Math.abs(weight);
                }

                return sum;
            };
            //Establish watch expression for fixed metrics
            //If some metrics are fixed, the ranges for the others must be shortened
        $scope.$watchCollection('fixed', (newVal) => {
            let sumFixed = 0;
            for (let metric of $scope.fixed) {
                sumFixed += Math.abs($scope.weightings[metric]);
            }
            $scope.rangeMax = 100 - sumFixed;
            $scope.rangeMin = -1 * $scope.rangeMax;
        });

        //Establish watch expression for weightings
        //to ensure absolute sum of weightings is 100.
        $scope.$watchCollection('weightings', (newVal, oldVal) => {
            //Is the absolute sum of the weightings 100?
            let sum = $scope.sum();
            // If not, adjust weightings of unchanged metrics.
            if (sum !== 100) {
                let diff = 100 - sum;
                const metrics = $scope.metrics;

                //Which metric changed?
                let changed;
                for (let metric of metrics) {
                    if (newVal[metric] !== oldVal[metric]) {
                        changed = metric;
                        break;
                    }
                }
                // Make an array of the unchanged metrics that are not fixed.
                let unchanged = metrics.filter(metric => metric !== changed && $scope.fixed.indexOf(metric) === -1);
                // if diff is positive, find metric to increase.
                if (diff > 0) {
                    for (let metric of unchanged) {
                        if ($scope.weightings[metric] >= 0 && $scope.weightings[metric] + diff <= 100) {
                            $scope.weightings[metric] += diff;
                            break;
                        }
                        else if ($scope.weightings[metric] < 0 && $scope.weightings[metric] - diff >= -100) {
                            $scope.weightings[metric] += -1 * diff;
                            break;

                        }
                    }
                }
                // If diff is negative, get rid of diff by deacreasing one or more metrics.
                //Have to be careful because range is from -100 to 100 and
                //we must decrease absolute values
                else {
                    for (let metric of unchanged) {
                        if ($scope.weightings[metric] <= 0) {
                            const inc = Math.min(-1 * diff, -1 * $scope.weightings[metric]);
                            $scope.weightings[metric] += inc;
                            diff += inc;
                            if (diff === 0) {
                                break;
                            }
                        }
                        else {
                            $scope.weightings[metric] += diff;
                            const inc = -1 * Math.min(-1 * diff, $scope.weightings[metric]);
                            $scope.weightings[metric] += inc;
                            diff += inc;
                            if (diff === 0) {
                                break;
                            }

                        }
                    }
                }

            }
        });

    }]);