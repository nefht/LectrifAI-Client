export function convertSlideDataToHtml(
  slideData: {
    heading: string;
    bulletPoints: (string | string[])[];
    images: string[];
  }[]
): string {
  const convertToHtml = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  return slideData
    .map((slide) => {
      const bulletPointsHtml = slide.bulletPoints
        .map((bulletPoint) => {
          if (typeof bulletPoint === "string") {
            return `<li style="color: red">${convertToHtml(bulletPoint)}</li>`;
          } else {
            const subBulletPointsHtml = bulletPoint
              .map(
                (subBulletPoint) => `<li>${convertToHtml(subBulletPoint)}</li>`
              )
              .join("");
            return `<li><ul>${subBulletPointsHtml}</ul></li>`;
          }
        })
        .join("");

      return `
        <div>
          <h2><b>${convertToHtml(slide.heading)}</b></h2>
          <ul>${bulletPointsHtml}</ul>
        </div>
      `;
    })
    .join("");
}
