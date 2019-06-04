(function () {
    'use strict';

    class DepResolverError extends Error {
        constructor() {
            super(...arguments);
        }
    }

    function removeExcluded(depMap, node, excludeItems) {
        depMap[node] = depMap[node].filter(function (item) {
            return !excludeItems.includes(item);
        });
    }

    function validateDep(depMap, node, dependency) {
        if (!depMap.hasOwnProperty(dependency)) {
            throw new DepResolverError(`"${node}" has an unknown dependency "${dependency}"`);
        }
    }

    function validateDepMap(depMap, options) {
        for (let node in depMap) {
            if (!depMap.hasOwnProperty(node)) {
                continue;
            }
            if (options && options.exclude) {
                removeExcluded(depMap, node, options.exclude);
            }
            depMap[node].forEach(validateDep.bind(null, depMap, node));
        }
    }

    function resolveSpecific(depMap, result, dependant, path) {
        if (path.indexOf(dependant) !== path.lastIndexOf(dependant)) {
            throw new DepResolverError(`circular dependency found: ${path.join(' > ')}`);
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

    function resolve(depMap, options) {
        let result = [];

        validateDepMap(depMap, options);

        for (let node in depMap) {
            if (!depMap.hasOwnProperty(node)) {
                continue;
            }
            resolveSpecific(depMap, result, node, [node]);
        }

        return result;
    }

    resolve.DepResolverError = DepResolverError;

    /*eslint-env node,browser*/
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = resolve;
    } else if (typeof define === 'function' && this.define.amd) {
        this.define([], function () {
            return resolve;
        });
    } else {
        window.DepResolver = resolve;
    }
}());
