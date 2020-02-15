export function CustomInjectable(annotation: any) {
    return function (target: Function) {
        const parentTarget = Object.getPrototypeOf(target.prototype).constructor;
        const parentParamTypes = Reflect.getMetadata('design:paramtypes', parentTarget);
        const parentParameters = Reflect.getMetadata('parameters', parentTarget);

        Reflect.defineMetadata('design:paramtypes', parentParamTypes, target);
        Reflect.defineMetadata('parameters', parentParameters, target);
    };
}
