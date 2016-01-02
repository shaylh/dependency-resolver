(function () {
    function resolve(depMap, options) {
        var result = [];
        var node;

        validateDepMap(depMap, options);

        for (node in depMap) {
            resolveSpecific(depMap, result, node, [node]);
        }

        return result;
    }

    function resolveSpecific(depMap, result, dependant, path) {
        if (path[0] === dependant && path.length > 1) {
            throw new Error('circular dependency found: ' + path.join(' > '));
        }

        if (depMap[dependant]) {
            depMap[dependant].forEach(function (depender) {
                resolveSpecific(depMap, result, depender, path.concat(depender));
            });
        }

        if (!result.includes(dependant)) {
            result.push(dependant);
            delete depMap[dependant];
        }
    }

    function validateDepMap(depMap, options) {
        var node;

        for (node in depMap) {
            if (options && options.exclude) {
                removeExcluded(depMap, node, options.exclude);
            }

            depMap[node].forEach(validateDep.bind(null, depMap, node));
        }
    }

    function removeExcluded(depMap, node, exclude) {
        depMap[node] = depMap[node].filter(function (item) {
            return !exclude.includes(item)
        });
    }

    function validateDep(depMap, node, dependency) {
        if (!depMap.hasOwnProperty(dependency)) {
            throw new Error('"' + node + '" has an unknown dependency "' + dependency + '"');
        }
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = resolve;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return resolve;
        });
    } else {
        window.DepResolver = resolve;
    }
}());