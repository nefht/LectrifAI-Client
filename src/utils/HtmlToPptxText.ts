// // Copyright 2020 BeyondIt S.r.l.
// //
// // Use of this source code is governed by an MIT-style license that can be found
// // in the LICENSE file or at https://opensource.org/licenses/MIT.

// import cssparser from "css";
// import parsecolor from "parse-color";
// import { Parser } from "htmlparser2";

// interface ContextOptions {
//   fontFace?: string;
//   fontSize?: number;
//   css?: string;
//   preFontFace?: string;
//   paraSpaceBefore?: number;
//   paraSpaceAfter?: number;
// }

// interface StyleRule {
//   property: string;
//   value: string;
// }

// class Context {
//   indent: number;
//   fontFace: string;
//   fontSize: number;
//   options: ContextOptions;
//   cssRules: any[];
//   color?: string;
//   fill?: string;
//   outline?: { size: number; color: string };
//   align?: string;
//   i?: boolean;
//   b?: boolean;
//   break?: boolean;
//   margin?: number;
//   shadow?: any;
//   bullet?: boolean | { type: string };
//   bulletOptions?: { type: string } | true;
//   href?: string;
//   href_title?: string;
//   s?: boolean;
//   sub?: boolean;
//   sup?: boolean;
//   u?: boolean;
//   paraSpaceBefore?: number;
//   paraSpaceAfter?: number;
//   pre?: boolean;

//   constructor(options: ContextOptions) {
//     this.indent = -1;
//     this.fontFace = options.fontFace || "Arial";
//     this.fontSize = options.fontSize || 12;
//     this.options = options;
//     this.cssRules = [];

//     if (options.css) {
//       const obj = cssparser.parse(options.css);
//       this.cssRules = obj.stylesheet ? obj.stylesheet.rules : [];
//     }
//   }

//   setColor(value: string): void {
//     const color = this.parseColor(value);
//     if (color) this.color = color;
//   }

//   setFontFace(value: string): void {
//     if (value) this.fontFace = value;
//   }

//   parseColor(value: string): string | undefined {
//     const color = parsecolor(value);
//     return color.hex?.substring(1);
//   }

//   parseSize(value: string, stack: Context[]): number | undefined {
//     const parts = value.trim().match(/([\d\.]+)(%|em|pt|rem)/);
//     let scale: number | undefined;

//     switch (value) {
//       case "7":
//         scale = 3;
//         break;
//       case "h1":
//       case "xx-large":
//       case "6":
//         scale = 2;
//         break;
//       case "h2":
//       case "x-large":
//       case "5":
//         scale = 1.5;
//         break;
//       case "h3":
//       case "large":
//       case "4":
//         scale = 1.17;
//         break;
//       case "h4":
//       case "medium":
//       case "3":
//         scale = 1;
//         break;
//       case "h5":
//       case "small":
//       case "2":
//         scale = 0.83;
//         break;
//       case "h6":
//       case "x-small":
//       case "1":
//         scale = 0.67;
//         break;
//       case "xx-small":
//         scale = 0.5;
//         break;
//     }

//     if (scale) {
//       return Math.round(this.fontSize * scale);
//     } else if (parts) {
//       const size = parseFloat(parts[1]);
//       const unit = parts[2];

//       switch (unit) {
//         case "%":
//           return Math.round(stack[stack.length - 1].fontSize * size);
//         case "em":
//           return Math.round(this.fontSize * size);
//         case "pt":
//           return size;
//         case "rem":
//           return Math.round(stack[0].fontSize * size);
//       }
//     }

//     return undefined;
//   }

//   setFontSize(value: string, stack: Context[]): void {
//     const size = this.parseSize(value, stack);
//     if (size) this.fontSize = size;
//   }

//   applyStyleRules(rules: StyleRule[]): void {
//     rules.forEach((rule) => {
//       const value = rule.value;
//       const parts = value.split(/\s+/);

//       switch (rule.property) {
//         case "background":
//         case "background-color": {
//           const color = this.parseColor(value);
//           if (color) this.fill = color;
//           break;
//         }
//         case "border": {
//           const size = this.parseSize(parts[0], []);
//           const color = this.parseColor(parts[1]) || this.parseColor(parts[2]);
//           if (size && color) this.outline = { size, color };
//           break;
//         }
//         case "color":
//           this.setColor(value);
//           break;
//         case "font-family":
//           this.setFontFace(value.split(",")[0].trim());
//           break;
//         case "font-size":
//           this.setFontSize(value, []);
//           break;
//         case "font-style":
//           this.i = value === "italic";
//           break;
//         case "font-weight":
//           this.b =
//             value === "bold" ||
//             value === "bolder" ||
//             parseInt(value, 10) >= 700;
//           break;
//         case "margin": {
//           const size = this.parseSize(parts[0], []);
//           if (size) this.margin = size;
//           break;
//         }
//         case "text-align":
//           this.align = value;
//           break;
//         case "text-shadow": {
//           const hpos = this.parseSize(parts[0], []);
//           const vpos = this.parseSize(parts[1], []);
//           const blur = this.parseSize(parts[2], []);
//           const color = parsecolor(parts[3]);
//           const angle =
//             (270 + (Math.atan2(hpos || 0, vpos || 0) * 180) / Math.PI) % 360;
//           const offset = Math.sqrt((hpos || 0) ** 2 + (vpos || 0) ** 2);

//           if (blur != null && color && offset != null) {
//             this.shadow = {
//               type: "outer",
//               angle,
//               blur,
//               color: color.hex?.substring(1),
//               offset,
//               opacity: color.rgba?.[3],
//             };
//           }
//           break;
//         }
//       }
//     });
//   }

//   setClass(tag: string, classList?: string): void {
//     this.cssRules.forEach((rule) => {
//       if (rule.type === "rule") {
//         const hasTag = rule.selectors.includes(tag);
//         let hasClass = false;

//         if (classList) {
//           classList.split(" ").forEach((c) => {
//             hasClass ||= c && rule.selectors.includes("." + c);
//           });
//         }

//         if (hasTag || hasClass) {
//           this.applyStyleRules(rule.declarations);
//         }
//       }
//     });
//   }

//   setStyle(style: string): void {
//     const obj = cssparser.parse("e {" + style + "}");
//     const rules = obj.stylesheet?.rules?.[0]?.declarations || [];
//     this.applyStyleRules(rules);
//   }

//   toPptxTextOptions(): Record<string, any> {
//     const options: Record<string, any> = {};

//     options.align = this.align;
//     options.bold = !!this.b;
//     options.breakLine = !!this.break;
//     options.color = this.color;
//     if (this.fill) options.fill = this.fill;
//     options.fontFace = this.fontFace;
//     options.fontSize = this.fontSize || this.options.fontSize;
//     options.italic = !!this.i;
//     if (this.shadow) options.shadow = this.shadow;
//     options.strike = !!this.s;
//     options.subscript = !!this.sub;
//     options.superscript = !!this.sup;
//     options.underline = !!this.u;

//     if (this.bullet !== undefined) {
//       if (this.bullet === true) {
//         options.bullet = this.bulletOptions;
//         options.indentLevel = this.indent;
//       } else {
//         options.bullet = false;
//       }
//     }

//     if (this.href) {
//       const target = /\d+/.test(this.href) ? "slide" : "url";

//       options.hyperlink = {
//         tooltip: this.href_title,
//       };
//       options.hyperlink[target] = this.href;
//     }

//     return options;
//   }
// }

// interface TextItem {
//   text: string;
//   options: Record<string, any>;
// }

// export function htmlToPptxText(
//   html: string,
//   options: ContextOptions = {}
// ): TextItem[] {
//   const textItems: TextItem[] = [];
//   const contextStack: Context[] = [new Context(options)];

//   function currentContext(): Context {
//     return contextStack[contextStack.length - 1];
//   }

//   function addText(text: string): void {
//     textItems.push({ text, options: currentContext().toPptxTextOptions() });

//     contextStack.forEach((c) => {
//       c.bullet = undefined;
//     });
//   }

//   function addBreak(): void {
//     const context = currentContext();
//     context.break = true;
//     addText("");
//     context.break = false;
//   }

//   const parser = new Parser(
//     {
//       onopentag(
//         name: string | number,
//         attr: {
//           [x: string]: any;
//           href: any;
//           title: any;
//           color: any;
//           face: any;
//           size: any;
//           align: any;
//           style: any;
//         }
//       ) {
//         const context = Object.create(currentContext());
//         contextStack.push(context);

//         switch (name) {
//           case "a":
//             context.href = attr.href;
//             context.href_title = attr.title;
//             break;
//           case "b":
//           case "i":
//           case "s":
//           case "sub":
//           case "sup":
//           case "u":
//             context[name] = true;
//             break;
//           case "del":
//           case "strike":
//             context.s = true;
//             break;
//           case "br":
//             addBreak();
//             break;
//           case "p":
//             context.paraSpaceBefore =
//               options.paraSpaceBefore || context.fontSize;
//             addBreak();
//             context.paraSpaceBefore = 0;
//             break;
//           case "ol":
//             context.indent++;
//             context.bulletOptions = { type: "number" };
//             break;
//           case "ul":
//             context.indent++;
//             context.bulletOptions = true;
//             break;
//           case "li":
//             context.bullet = true;
//             break;
//           case "h1":
//           case "h2":
//           case "h3":
//           case "h4":
//           case "h5":
//           case "h6":
//             context.b = true;
//             context.setFontSize(name);
//             break;
//           case "pre":
//             context.pre = true;
//             context.setFontFace(options.preFontFace || "Courier New");
//             break;
//           case "font":
//             context.setColor(attr.color);
//             context.setFontFace(attr.face);
//             context.setFontSize(attr.size);
//             break;
//         }

//         if (attr.align) context.align = attr.align;
//         context.setClass(name, attr["class"]);
//         if (attr.style) context.setStyle(attr.style);
//       },
//       ontext(text: string) {
//         const context = currentContext();

//         if (!context.pre) {
//           text = text.replace(/\s+/g, " ");
//         }

//         if (text) {
//           addText(text);
//         }
//       },
//       onclosetag(name: any) {
//         const context = currentContext();

//         switch (name) {
//           case "h1":
//           case "h2":
//           case "h3":
//           case "h4":
//           case "h5":
//           case "h6":
//           case "pre":
//             addBreak();
//             break;
//           case "ol":
//           case "ul":
//             if (context.indent === 0) {
//               context.bullet = false;
//               addText("");
//             }
//             break;
//           case "p":
//             context.paraSpaceAfter = options.paraSpaceAfter || context.fontSize;
//             addBreak();
//             break;
//         }

//         if (context.align) {
//           context.align = "left";
//           addText("");
//         }

//         contextStack.pop();
//       },
//     },
//     {
//       decodeEntities: true,
//     }
//   );

//   parser.write(html);
//   parser.end();

//   return textItems;
// }

// export default htmlToPptxText;

// Copyright 2020 BeyondIt S.r.l.
//
// Use of this source code is governed by an MIT-style license that can be found
// in the LICENSE file or at https://opensource.org/licenses/MIT.

import cssparser from 'css';
import parsecolor from 'parse-color';
import { Parser } from 'htmlparser2';

interface ContextOptions {
    fontFace?: string;
    fontSize?: number;
    css?: string;
    preFontFace?: string;
    paraSpaceBefore?: number;
    paraSpaceAfter?: number;
}

interface StyleRule {
    property: string;
    value: string;
}

class Context {
    indent: number;
    fontFace: string;
    fontSize: number;
    options: ContextOptions;
    cssRules: any[];
    color?: string;
    fill?: string;
    outline?: { size: number; color: string };
    align?: string;
    i?: boolean;
    b?: boolean;
    break?: boolean;
    margin?: number;
    shadow?: any;
    bullet?: boolean | { type: string };
    bulletOptions?: { type: string } | true;
    href?: string;
    href_title?: string;
    s?: boolean;
    sub?: boolean;
    sup?: boolean;
    u?: boolean;
    paraSpaceBefore?: number;
    paraSpaceAfter?: number;
    pre?: boolean;

    constructor(options: ContextOptions) {
        this.indent = -1;
        this.fontFace = options.fontFace || 'Arial';
        this.fontSize = options.fontSize || 12;
        this.options = options;
        this.cssRules = [];

        if (options.css) {
            const obj = cssparser.parse(options.css);
            this.cssRules = obj.stylesheet ? obj.stylesheet.rules : [];
        }
    }

    setColor(value: string): void {
        const color = this.parseColor(value);
        if (color) this.color = color;
    }

    setFontFace(value: string): void {
        if (value) this.fontFace = value;
    }

    parseColor(value: string): string | undefined {
        const color = parsecolor(value);
        return color.hex?.substring(1);
    }

    parseSize(value: string, stack: Context[]): number | undefined {
        const parts = value.trim().match(/([\d\.]+)(%|em|pt|rem)/);
        let scale: number | undefined;

        switch (value) {
            case '7':
                scale = 3;
                break;
            case 'h1':
            case 'xx-large':
            case '6':
                scale = 2;
                break;
            case 'h2':
            case 'x-large':
            case '5':
                scale = 1.5;
                break;
            case 'h3':
            case 'large':
            case '4':
                scale = 1.17;
                break;
            case 'h4':
            case 'medium':
            case '3':
                scale = 1;
                break;
            case 'h5':
            case 'small':
            case '2':
                scale = 0.83;
                break;
            case 'h6':
            case 'x-small':
            case '1':
                scale = 0.67;
                break;
            case 'xx-small':
                scale = 0.5;
                break;
        }

        if (scale) {
            return Math.round(this.fontSize * scale);
        } else if (parts) {
            const size = parseFloat(parts[1]);
            const unit = parts[2];

            switch (unit) {
                case '%':
                    return Math.round(stack[stack.length - 1].fontSize * size);
                case 'em':
                    return Math.round(this.fontSize * size);
                case 'pt':
                    return size;
                case 'rem':
                    return Math.round(stack[0].fontSize * size);
            }
        }

        return undefined;
    }

    setFontSize(value: string, stack: Context[]): void {
        const size = this.parseSize(value, stack);
        if (size) this.fontSize = size;
    }

    applyStyleRules(rules: StyleRule[]): void {
        rules.forEach(rule => {
            const value = rule.value;
            const parts = value.split(/\s+/);

            switch (rule.property) {
                case 'background':
                case 'background-color': {
                    const color = this.parseColor(value);
                    if (color) this.fill = color;
                    break;
                }
                case 'border': {
                    const size = this.parseSize(parts[0], []);
                    const color = this.parseColor(parts[1]) || this.parseColor(parts[2]);
                    if (size && color) this.outline = { size, color };
                    break;
                }
                case 'color':
                    this.setColor(value);
                    break;
                case 'font-family':
                    this.setFontFace(value.split(',')[0].trim());
                    break;
                case 'font-size':
                    this.setFontSize(value, []);
                    break;
                case 'font-style':
                    this.i = value === 'italic';
                    break;
                case 'font-weight':
                    this.b = value === 'bold' || value === 'bolder' || parseInt(value, 10) >= 700;
                    break;
                case 'margin': {
                    const size = this.parseSize(parts[0], []);
                    if (size) this.margin = size;
                    break;
                }
                case 'text-align':
                    this.align = value;
                    break;
                case 'text-shadow': {
                    const hpos = this.parseSize(parts[0], []);
                    const vpos = this.parseSize(parts[1], []);
                    const blur = this.parseSize(parts[2], []);
                    const color = parsecolor(parts[3]);
                    const angle = (270 + Math.atan2(hpos || 0, vpos || 0) * 180 / Math.PI) % 360;
                    const offset = Math.sqrt((hpos || 0) ** 2 + (vpos || 0) ** 2);

                    if (blur != null && color && offset != null) {
                        this.shadow = {
                            type: 'outer',
                            angle,
                            blur,
                            color: color.hex?.substring(1),
                            offset,
                            opacity: color.rgba?.[3]
                        };
                    }
                    break;
                }
            }
        });
    }

    setClass(tag: string, classList?: string): void {
        this.cssRules.forEach(rule => {
            if (rule.type === 'rule') {
                const hasTag = rule.selectors.includes(tag);
                let hasClass = false;

                if (classList) {
                    classList.split(' ').forEach(c => {
                        hasClass ||= c && rule.selectors.includes('.' + c);
                    });
                }

                if (hasTag || hasClass) {
                    this.applyStyleRules(rule.declarations);
                }
            }
        });
    }

    setStyle(style: string): void {
        const obj = cssparser.parse('e {' + style + '}');
        const rules = obj?.stylesheet?.rules[0]?.type === 'rule' ? obj.stylesheet.rules[0].declarations : [];
        if (rules) {
            const styleRules = rules.filter(rule => rule.type === 'declaration') as StyleRule[];
            this.applyStyleRules(styleRules);
        }
    }

    toPptxTextOptions(): Record<string, any> {
        const options: Record<string, any> = {};

        options.align = this.align;
        options.bold = !!this.b;
        options.breakLine = !!this.break;
        options.color = this.color;
        if (this.fill) options.fill = this.fill;
        options.fontFace = this.fontFace;
        options.fontSize = this.fontSize || this.options.fontSize;
        options.italic = !!this.i;
        if (this.shadow) options.shadow = this.shadow;
        options.strike = !!this.s;
        options.subscript = !!this.sub;
        options.superscript = !!this.sup;
        options.underline = !!this.u;
        options.indentLevel = this.indent;

        if (this.bullet !== undefined) {
            if (this.bullet === true) {
                options.bullet = this.bulletOptions;
                options.indentLevel = this.indent;
            } else {
                options.bullet = false;
            }
        }

        if (this.href) {
            const target = /\d+/.test(this.href) ? 'slide' : 'url';

            options.hyperlink = {
                tooltip: this.href_title
            };
            options.hyperlink[target] = this.href;
        }

        return options;
    }
}

interface TextItem {
    text: string;
    options: Record<string, any>;
}

export function htmlToPptxText(html: string, options: ContextOptions = {}): TextItem[] {
    const textItems: TextItem[] = [];
    const contextStack: Context[] = [new Context(options)];

    function currentContext(): Context {
        return contextStack[contextStack.length - 1];
    }

    function addText(text: string): void {
        textItems.push({ text, options: currentContext().toPptxTextOptions() });

        contextStack.forEach(c => {
            c.bullet = undefined;
        });
    }

    function addBreak(): void {
        const context = currentContext();
        context.break = true;
        addText('');
        context.break = false;
    }

    const parser = new Parser({
        onopentag(name, attr) {
            const context = Object.create(currentContext());
            contextStack.push(context);

            switch (name) {
                case 'a':
                    context.href = attr.href;
                    context.href_title = attr.title;
                    break;
                case 'b':
                case 'i':
                case 's':
                case 'sub':
                case 'sup':
                case 'u':
                    context[name] = true;
                    break;
                case 'del':
                case 'strike':
                    context.s = true;
                    break;
                case 'br':
                    addBreak();
                    break;
                case 'p':
                    context.paraSpaceBefore = options.paraSpaceBefore || context.fontSize;
                    addBreak();
                    context.paraSpaceBefore = 0;
                    break;
                case 'ol':
                    context.indent++;
                    context.bulletOptions = { type: 'number' };
                    break;
                case 'ul':
                    context.indent++;
                    context.bulletOptions = true;
                    break;
                case 'li':
                    context.bullet = true;
                    context.indent = parseInt(attr['class']?.match(/ql-indent-(\d+)/)?.[1] || '0', 10);
                    break;
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    context.b = true;
                    context.setFontSize(name);
                    break;
                case 'pre':
                    context.pre = true;
                    context.setFontFace(options.preFontFace || 'Courier New');
                    break;
                case 'font':
                    context.setColor(attr.color);
                    context.setFontFace(attr.face);
                    context.setFontSize(attr.size);
                    break;
            }

            if (attr.align) context.align = attr.align;
            context.setClass(name, attr['class']);
            if (attr.style) context.setStyle(attr.style);
        },
        ontext(text) {
            const context = currentContext();

            if (!context.pre) {
                text = text.replace(/\s+/g, ' ');
            }

            if (text) {
                addText(text);
            }
        },
        onclosetag(name) {
            const context = currentContext();

            switch (name) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'pre':
                    addBreak();
                    break;
                case 'ol':
                case 'ul':
                    if (context.indent === 0) {
                        context.bullet = false;
                        addText('');
                    }
                    break;
                case 'p':
                    context.paraSpaceAfter = options.paraSpaceAfter || context.fontSize;
                    addBreak();
                    break;
            }

            if (context.align) {
                context.align = 'left';
                addText('');
            }

            contextStack.pop();
        }
    }, {
        decodeEntities: true
    });

    parser.write(html);
    parser.end();

    return textItems;
}

export default htmlToPptxText;
