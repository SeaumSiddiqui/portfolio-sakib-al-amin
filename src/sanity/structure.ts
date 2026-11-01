import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.listItem().title("About").id("about").child(S.document().schemaType("about").documentId("about")),
      S.divider(),
      S.documentTypeListItem("enquiry").title("Enquiries"),
    ]);
