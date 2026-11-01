import { about, enquiry, project, service, siteSettings } from "./documents";
import { breakdownModule, filmModule, media, modelModule, spec, styleframesModule, textModule } from "./objects";

export const schemaTypes = [
  siteSettings,
  project,
  service,
  about,
  enquiry,
  media,
  spec,
  filmModule,
  breakdownModule,
  modelModule,
  styleframesModule,
  textModule,
];

export const singletonTypes = new Set(["siteSettings", "about"]);
