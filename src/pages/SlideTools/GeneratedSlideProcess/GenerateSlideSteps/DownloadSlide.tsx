import { useEffect } from "react";
import { useParams } from "react-router";
import PptxGenJS from "pptxgenjs";
import example from "../../../../assets/images/templates/example.png";
import htmlToPptxText from "../../../../utils/HtmlToPptxText";
import templateSlide from "../../../../assets/templates/template1.pptx";
import SlidePresentation from "../../../../shared/templates/SlidePresentation";

function DownloadSlide() {
  const { id } = useParams();
  const docs = [
    { uri: templateSlide }, // Local File
  ];

  const tmpCardList = [
    '<h2><strong>Introduction to ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW is a widely used, general purpose multiple sequence alignment (MSA) program for DNA or proteins.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Developed in 1994 by Thompson, Higgins, and Gibson.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>"W" stands for "Weights", as it incorporates sequence weighting.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It uses a progressive alignment approach.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Available as a command-line tool and with a graphical user interface.</li></ul><p><strong>Image suggestion:</strong> ClustalW logo, screenshot of ClustalW interface</p>',
    '<h2><strong>What is Multiple Sequence Alignment (MSA)?</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>MSA is a way of arranging three or more biological sequences (DNA, RNA, or protein) to identify regions of similarity.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Similarities may be a consequence of functional, structural, or evolutionary relationships between the sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Aligned sequences are represented as rows within a matrix.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Gaps (-) are inserted to align residues with the same or similar properties.</li></ul><p><strong>Image suggestion:</strong> Example of a multiple sequence alignment</p>',
    '<h2><strong>The Progressive Alignment Method</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW employs a progressive alignment algorithm.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It builds up the final MSA by combining pairwise alignments, starting with the most similar pair and progressing to the most distantly related.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Involves three main steps:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Calculate a distance matrix based on pairwise alignments.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Construct a guide tree based on the distance matrix (e.g., using the neighbor-joining method).</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Progressively align sequences/alignments according to the branching order of the guide tree.</li></ul><p><strong>Image suggestion:</strong> Diagram illustrating the progressive alignment method</p>',
    '<h2><strong>Step 1: Pairwise Alignment and Distance Matrix</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW first performs pairwise alignments of all sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It calculates the similarity or distance between each pair of sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>These distances are used to create a distance matrix.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The distance matrix reflects the evolutionary distance between sequences.</li></ul><p><strong>Image suggestion:</strong> Example of a distance matrix</p>',
    '<h2><strong>Step 2: Guide Tree Construction</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>A guide tree is constructed from the distance matrix.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The guide tree is a phylogenetic tree that estimates the evolutionary relationships between sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW typically uses the neighbor-joining method to build the tree.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The tree\'s branching order guides the subsequent progressive alignment steps.</li></ul><p><strong>Image suggestion:</strong> Example of a guide tree (neighbor-joining tree)</p>',
    '<h2><strong>Step 3: Progressive Alignment</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Sequences are progressively aligned based on the guide tree\'s branching order.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The most closely related sequences are aligned first.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Profiles (alignments of already aligned sequences) are then aligned to each other.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Gaps are introduced to maximize alignment scores.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Sequence weighting is used to downweight the contribution of highly similar sequences and upweight divergent ones.</li></ul><p><strong>Image suggestion:</strong> Diagram showing sequences being aligned progressively according to a guide tree</p>',
    '<h2><strong>ClustalW Parameters</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW offers various parameters that can be adjusted, including:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Gap opening penalty: Cost of introducing a new gap.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Gap extension penalty: Cost of extending an existing gap.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Substitution matrix (e.g., BLOSUM, PAM): Scores the similarity between amino acids.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Delay divergent sequences: Sets a sequence identity threshold below which alignment is delayed.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Choosing appropriate parameters is important for obtaining accurate alignments.</li></ul><p><strong>Image suggestion:</strong> Screenshot of ClustalW parameter options</p>',
    '<h2><strong>Applications of ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Phylogenetic analysis: Inferring evolutionary relationships between species.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Identifying conserved regions: Finding functional domains or motifs in proteins.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Primer design: Designing PCR primers that bind to conserved regions.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Structural prediction: Aligning sequences with known structures to predict the structure of a new protein.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Analyzing protein families: Studying the evolution and function of related proteins.</li></ul><p><strong>Image suggestion:</strong> Icons representing different applications (e.g., phylogenetic tree, protein structure, DNA sequence)</p>',
    '<h2><strong>Limitations of ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Progressive alignment can be sensitive to the order of sequence addition.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The initial alignments are "frozen", meaning errors made early on propagate through the entire alignment.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Not ideal for sequences with large insertions/deletions or rearrangements.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Computationally intensive for a very large number of sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Newer methods (e.g., MUSCLE, MAFFT) often outperform ClustalW in accuracy and speed.</li></ul>',
    '<h2><strong>ClustalW vs. Clustal Omega</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Clustal Omega is a newer version of Clustal.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It can handle a much larger number of sequences than ClustalW (thousands vs. hundreds).</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Uses seeded guide trees and a modified progressive alignment method.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Generally more accurate and faster than ClustalW, especially for large datasets.</li></ul><p><strong>Image suggestion:</strong> Comparison table of ClustalW and Clustal Omega features</p>',
    '<h2><strong>Summary</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW is a classic and widely used program for multiple sequence alignment.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It uses a progressive alignment algorithm guided by a phylogenetic tree.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It has been instrumental in many areas of biological research.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>While newer tools exist, understanding ClustalW remains valuable for bioinformatics.</li></ul>',
  ];

  const downloadSlide = () => {
    // STEP 1: Create a new Presentation
    let pptx = new PptxGenJS();

    const items = tmpCardList.map((item) => htmlToPptxText(item));

    items.map((item) =>
      pptx.addSlide().addText(item, { x: 1, y: 1, w: "90%", h: "90%" })
    );

    pptx.writeFile({ fileName: "PptxGenJs-Basic-Slide-Demo" });
  };

  return (
    <>
      {/* <DocViewer documents={docs} /> */}
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Download your presentation
      </h1>
      <p className="font-degular text-xl mb-4">
        Preview your presentation and download it as a PPTX or PDF file
      </p>
      <SlidePresentation templateCode="minimalist-01" />
      {/* <button
        className="border bg-green-600 w-[100px] text-white"
        onClick={downloadSlide}
      >
        TEST PPTX
      </button> */}
      {/* <img className="mt-8 rounded-lg" src={example} alt="" /> */}
      {/* <iframe
        src="https://docs.google.com/presentation/d/1VJpqD1qkAJT0E2vcDRYDzMzDlybyFYQY/preview#slide=id.p1"
        width="100%"
        height="600px"
        frameBorder="0"
        title="Google Slides Viewer"
      ></iframe> */}
    </>
  );
}

export default DownloadSlide;
