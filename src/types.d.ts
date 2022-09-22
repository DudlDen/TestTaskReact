declare module '*.css' {
    const classNames: Record<string, string>;
    export default classNames;
}
declare module "*.png" {
    const value: any;
    export = value;
}
declare module "*.svg" {
    const value: any;
    export = value;
}