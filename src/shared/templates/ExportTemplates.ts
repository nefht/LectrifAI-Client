import MinimalistTemplate01 from "./Minimalist/MinimalistTemplate01";

interface TemplateMap {
  [key: string]: (data: any) => JSX.Element[];
}

const templates: TemplateMap = {
  "minimalist-01":  MinimalistTemplate01,
};

export default templates;
