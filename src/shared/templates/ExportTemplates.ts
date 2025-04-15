import MinimalistTemplate01 from "./Minimalist/MinimalistTemplate01";
import MinimalistTemplate02 from "./Minimalist/MinimalistTemplate02";
import MinimalistTemplate03 from "./Minimalist/MinimalistTemplate03";

interface TemplateMap {
  [key: string]: (data: any) => JSX.Element[];
}

const templates: TemplateMap = {
  "minimalist-01":  MinimalistTemplate01,
  "minimalist-02":  MinimalistTemplate02,
  "minimalist-03":  MinimalistTemplate03,
};

export default templates;
