declare module "pdf-parse" {
  const pdfParse: any;
  export default pdfParse;
}
declare module "pdf-parse" {
  function pdf(input: Buffer): Promise<{ text: string }>;
  export = pdf;
}
