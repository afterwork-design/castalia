import siteJson from "./site.json";
import resourceJson from "./resource.json";

export interface Site {
    title: string;
    description: string;
    keywords: string[];
}
export interface ResourceItem {
    name: string;
    description?: string;
    url: string;
    image?: string;
}
export interface Resource {
    name: string;
    site: ResourceItem[];
    icon: string;
}

export const site = siteJson as Site;
export const resource = resourceJson as Resource[];
