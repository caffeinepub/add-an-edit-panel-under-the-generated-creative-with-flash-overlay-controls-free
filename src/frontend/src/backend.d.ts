import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Logo {
    logo: ExternalBlob;
    name: string;
}
export interface Color {
    hex: string;
    name: string;
}
export interface Reference {
    name: string;
    reference: ExternalBlob;
}
export interface BrandKit {
    references: Array<Reference>;
    logo?: Logo;
    name: string;
    colors: Array<Color>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkBrandKitExists(user: Principal): Promise<boolean>;
    clearColors(): Promise<void>;
    clearLogo(): Promise<void>;
    clearReferences(): Promise<void>;
    getBrandKit(user: Principal): Promise<BrandKit | null>;
    getCallerBrandKit(): Promise<BrandKit | null>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerBrandKit(brandKit: BrandKit): Promise<void>;
}
