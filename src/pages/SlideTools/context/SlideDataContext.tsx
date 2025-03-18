import { createContext, useState } from "react";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

interface SlideDataContextProps {
  slideData: SlideData;
  setSlideData: React.Dispatch<React.SetStateAction<SlideData>>;
}

const mockData = {
  title: "ClustalW: A Powerful Tool for Multiple Sequence Alignment",
  slides: [
    {
      heading: "Introduction to Multiple Sequence Alignment (MSA)",
      bulletPoints: [
        "What is Multiple Sequence Alignment?",
        [
          "Arrangement of three or more biological sequences (DNA, RNA, or protein)",
          "Residues with common evolutionary ancestry are aligned in columns",
        ],
        "Why is MSA important?",
        [
          "Identifying conserved regions and motifs",
          "Inferring evolutionary relationships (phylogenetic analysis)",
          "Predicting protein structure and function",
          "Designing PCR primers",
        ],
        "Challenges in MSA:",
        [
          "Computational complexity increases with sequence number and length",
          "Handling insertions, deletions, and substitutions",
        ],
      ],
      imageSuggestions: [
        "Example of multiple sequence alignment",
        "Phylogenetic tree based on MSA",
      ],
      imageUrls: ["https://example.com/alignment.png"],
    },
    {
      heading: "Introducing ClustalW",
      bulletPoints: [
        "ClustalW is a widely used program for MSA",
        "**Clustal** refers to **Clust**er analysis",
        "**W** signifies **W**eighting (for improved accuracy)",
        "Developed as an improvement over its predecessor, ClustalV",
        "Employs a progressive alignment strategy",
        "Command-line based but many web interfaces and GUI wrappers are available",
      ],
      imageSuggestions: [
        "ClustalW logo",
        "Screenshot of ClustalW command-line interface",
      ],
      imageUrls: ["https://example.com/clustalw-logo.png"],
    },
    {
      heading: "The Progressive Alignment Approach",
      bulletPoints: [
        "ClustalW uses a three-step progressive alignment algorithm:",
        [
          "**1. Pairwise Alignment:** Calculate pairwise distances between all sequences",
          "**2. Guide Tree Construction:** Build a guide tree based on pairwise distances (using a method like Neighbor-Joining)",
          "**3. Progressive Alignment:** Align sequences/profiles progressively, guided by the branching order of the tree (most similar aligned first)",
        ],
        "Advantages:",
        ["Computationally efficient", "Handles large datasets relatively well"],
        "Disadvantages:",
        [
          "Dependent on the initial pairwise alignments (errors propagate)",
          "May not always find the globally optimal alignment",
        ],
      ],
      imageSuggestions: [
        "Diagram illustrating progressive alignment",
        "Example of a guide tree",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "Key Features of ClustalW",
      bulletPoints: [
        "**Sequence Weighting:**",
        [
          "Down-weights closely related sequences to reduce bias",
          "Up-weights divergent sequences to emphasize their contribution",
        ],
        "**Gap Penalties:**",
        [
          "Position-specific gap penalties (e.g., penalties reduced in hydrophilic regions for protein sequences)",
          "Gap opening and extension penalties can be adjusted",
        ],
        "**Substitution Matrices:**",
        [
          "Offers various substitution matrices (e.g., BLOSUM, PAM) for protein alignments",
          "Different matrices are suitable for different levels of sequence divergence",
        ],
        "**Delayed alignment of highly divergent sequences:**",
        [
          "Distant sequences only added to the alignment after more similar ones are already aligned.",
        ],
      ],
      imageSuggestions: [
        "Example of BLOSUM substitution matrix",
        "Illustration of gap opening vs. gap extension",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "How to Use ClustalW",
      bulletPoints: [
        "**Input:**",
        [
          "Multiple sequences in a supported format (e.g., FASTA, PIR, GenBank)",
        ],
        "**Running ClustalW:**",
        [
          "Command-line execution with various options (e.g., `-INFILE`, `-OUTFILE`, `-MATRIX`, `-GAPOPEN`, `-GAPEXT`)",
          "Web-based interfaces (e.g., EBI ClustalW, GenomeNet ClustalW)",
        ],
        "**Output:**",
        [
          "Aligned sequences in various formats (e.g., Clustal format, FASTA, GCG/MSF)",
          "Guide tree file",
        ],
      ],
      imageSuggestions: [
        "Screenshot of a web-based ClustalW interface",
        "Example of ClustalW output file",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "Interpreting ClustalW Output",
      bulletPoints: [
        "**Alignment Symbols:**",
        [
          "**`*` (asterisk):** Indicates fully conserved residues",
          "**`:` (colon):** Indicates conservation between groups of strongly similar properties",
          "**`.` (period):** Indicates conservation between groups of weakly similar properties",
          "**`-` (hyphen):** Represents gaps introduced to optimize the alignment",
        ],
        "**Conserved Regions:**",
        [
          "Long stretches of asterisks indicate highly conserved regions",
          "May correspond to functional domains or active sites",
        ],
        "**Guide Tree:**",
        [
          "Reflects the inferred evolutionary relationships between sequences",
          "Branch lengths represent evolutionary distance",
        ],
      ],
      imageSuggestions: [
        "Zoomed-in view of ClustalW alignment showing symbols",
        "Highlighting conserved regions in a multiple sequence alignment",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "Limitations of ClustalW",
      bulletPoints: [
        "**Heuristic nature:** ClustalW does not guarantee finding the optimal alignment",
        "**Sensitivity to parameters:** Alignment quality can be affected by the choice of parameters (e.g., gap penalties, substitution matrix)",
        "**Computational resources:** Can be time-consuming for very large datasets",
        "**Accuracy:**",
        [
          "Generally less accurate than newer methods, especially for distantly related or highly divergent sequences",
        ],
      ],
      imageSuggestions: [
        "Comparison of alignments generated with different parameters",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "Alternatives to ClustalW",
      bulletPoints: [
        "**Muscle:**",
        ["Offers improved speed and accuracy compared to ClustalW"],
        "**T-Coffee:**",
        [
          "Uses a consistency-based approach, combining pairwise alignments",
          "Often more accurate than ClustalW, especially for difficult alignments",
        ],
        "**MAFFT:**",
        [
          "Uses fast Fourier transform to identify homologous regions",
          "Highly accurate and efficient",
        ],
        "**Kalign:**",
        ["Very fast and memory-efficient algorithm"],
        "**PRANK:**",
        [
          "Phylogeny-aware algorithm that differentiates between insertions and deletions",
          "Especially useful for evolutionary studies",
        ],
        "**Other Programs**: Many other programs are available to perform MSA. The best choice is highly dependent on the user's specific needs.",
      ],
      imageSuggestions: ["Logos of Muscle, T-Coffee, MAFFT, and Kalign"],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
    {
      heading: "Conclusion",
      bulletPoints: [
        "ClustalW is a classic and widely used tool for multiple sequence alignment",
        "Its progressive alignment algorithm is relatively fast and efficient",
        "Understanding its features, parameters, and limitations is crucial for obtaining meaningful results",
        "While newer and often more accurate methods exist, ClustalW remains a valuable tool for many applications",
        "Choosing the right MSA tool depends on the specific needs of the research question and the characteristics of the sequences being analyzed",
      ],
      imageSuggestions: [
        "Image representing sequence alignment and bioinformatics",
      ],
      imageUrls: ["https://example.com/progressive-alignment.png"],
    },
  ],
};

export const SlideDataContext = createContext<
  SlideDataContextProps | undefined
>(undefined);

export const SlideDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [slideData, setSlideData] = useState<SlideData>({} as SlideData);

  return (
    <SlideDataContext.Provider value={{ slideData, setSlideData }}>
      {children}
    </SlideDataContext.Provider>
  );
};
