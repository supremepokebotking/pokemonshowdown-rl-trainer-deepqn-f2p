/**
 * @ignore
 */
export declare class Node {
    obj: any;
    left: any;
    right: any;
    parent: any;
    dimension: any;
    constructor(obj: any, dimension: any, parent: any);
}
/**
 * @ignore
 */
export default class KDTree {
    dimensions: any;
    root: any;
    private metric;
    constructor(points: any, metric: any);
    toJSON(): Node;
    nearest(point: any, maxNodes: any, maxDistance: any): any[];
}
