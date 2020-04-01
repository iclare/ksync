/// <reference no-default-lib="false"/>

declare const __DEV__: boolean;

declare module '*';

declare type StrRecord = Record<string, string>;

declare type Entry = Readonly<StrRecord>;
