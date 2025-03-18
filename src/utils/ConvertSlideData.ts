export function convertSlideDataToHtml(
  slideData: {
    // heading: string;
    bulletPoints: (string | string[])[];
    imageUrls: { title: string; imageUrl: string }[];
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
          <ul>${bulletPointsHtml}</ul>
        </div>
      `;
    })
    .join("");
}

export function convertHtmlToBulletPoints(html: string): (string | string[])[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const bulletPoints: (string | string[])[] = [];

  // Select all ordered list items
  const listItems = doc.querySelectorAll("ol > li");

  let currentBulletPoint: string | null = null;
  let subBulletPoints: string[] = [];

  listItems.forEach((item) => {
    // Replace any class with "ql-indent-*" with "ql-indent-1"
    item.classList.forEach((className) => {
      if (className.startsWith("ql-indent-")) {
        item.classList.replace(className, "ql-indent-1");
      }
    });
    
    const isIndented = item.classList.contains("ql-indent-1");
    const textContent = item.textContent?.trim();

    if (isIndented) {
      // Add sub-bullet points
      if (textContent) {
        subBulletPoints.push(textContent);
      }
    } else {
      // When encountering a non-indented item, push previous bullet points and reset
      if (currentBulletPoint) {
        bulletPoints.push(currentBulletPoint);
      }
      if (subBulletPoints.length > 0) {
        bulletPoints.push(subBulletPoints);
        subBulletPoints = []; // reset sub-bullet points
      }

      // Set new main bullet point
      currentBulletPoint = textContent || "";
    }
  });

  // Push last bullet point and sub-points if any
  if (currentBulletPoint) {
    bulletPoints.push(currentBulletPoint);
  }
  if (subBulletPoints.length > 0) {
    bulletPoints.push(subBulletPoints);
  }

  return bulletPoints;
}

