let DepResolver = require('../src/dep-res');
let DepResolverError = DepResolver.DepResolverError;

describe('Dependencies resolver', function () {

    it('should resolve shallow dep-map', function () {
        let depMap = {a: ['b'], b: []};
        expect(DepResolver(depMap)).toEqual(['b', 'a']);
    });

    it('should resolve shallow dep-map with duplicate deps', function () {
        let depMap = {a: ['c'], b: ['c'], c: []};
        expect(DepResolver(depMap)).toEqual(['c', 'a', 'b']);
    });

    it('should resolve 1-level-deep dep-map', function () {
        let depMap = {a: ['b'], b: ['c'], c: []};
        expect(DepResolver(depMap)).toEqual(['c', 'b', 'a']);
    });

    it('should resolve 2-level-deep dep-map', function () {
        let depMap = {a: ['b'], b: ['c'], c: ['d'], d: []};
        expect(DepResolver(depMap)).toEqual(['d', 'c', 'b', 'a']);
    });

    it('should resolve 2-level-deep complicated dep-map', function () {
        let depMap = {a: [], b: ['c', 'd'], c: ['d'], d: ['a']};
        expect(DepResolver(depMap)).toEqual(['a', 'd', 'c', 'b']);
    });

    it('should resolve complex dep-map', function () {
        let depMap = {a: ['b', 'c'], b: ['d'], c: ['d'], d: ['e', 'f'], e: ['f'], f: []};
        expect(DepResolver(depMap)).toEqual(['f', 'e', 'd', 'b', 'c', 'a']);
    });

    it('should throw error if circular dependency is found', function () {
        let depMap = {a: ['b'], b: ['c'], c: ['a'], d: ['e'], e: ['d']};
        expect(DepResolver.bind(null, depMap)).toThrow(new DepResolverError('circular dependency found: a > b > c > a'));
    });

    it('should throw error if circular dependency is found for non-root item', function () {
        let depMap = {a: ['b'], b: ['c'], c: ['d'], d: ['e'], e: ['c']};
        expect(DepResolver.bind(null, depMap)).toThrow(new DepResolverError('circular dependency found: a > b > c > d > e > c'));
    });

    it('should throw error if unknown dependency is found', function () {
        let depMap = {a: ['b'], b: ['d']};
        expect(DepResolver.bind(null, depMap)).toThrow(new DepResolverError('"b" has an unknown dependency "d"'));
    });

    it('should ignore invalid dependency if explicitly excluded', function () {
        let depMap = {a: ['b'], b: ['d']};
        expect(DepResolver(depMap, {exclude: ['d']})).toEqual(['b', 'a']);
    });

});
