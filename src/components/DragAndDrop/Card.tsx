import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDrag, useDrop } from "react-dnd";
import { FaCirclePlus, FaRegTrashCan } from "react-icons/fa6";
import "animate.css";
import { convertSlideDataToHtml } from "../../utils/ConvertSlideDataToHtml";
import DeleteModal from "../NotificationModal/DeleteModal";

export const ItemTypes = {
  CARD: "card",
};

const list = [
  '<h2><strong>Introduction to ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>What is ClustalW?</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span><strong>C</strong>onserved <strong>L</strong>ocality <strong>U</strong>tilizing <strong>S</strong>imilarity <strong>T</strong>ables <strong>A</strong>nd <strong>L</strong>inear <strong>W</strong>eighting</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>A widely used program for <strong>multiple sequence alignment (MSA)</strong>.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Aligns DNA, RNA, and protein sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Purpose of MSA:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Identify conserved regions.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Infer evolutionary relationships (phylogenetic analysis).</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Predict protein structure and function.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Developed by:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Des Higgins and colleagues at the European Molecular Biology Laboratory (EMBL).</li></ul><p><strong>Image Suggestion:</strong> ClustalW logo, multiple sequence alignment example</p>',
  '<h2><strong>The Algorithm Behind ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Progressive Alignment Method:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Starts with the most similar sequences.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Gradually adds more distantly related sequences.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Three Main Steps:</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span><strong>1. Pairwise Alignment:</strong></li><li data-list="bullet" class="ql-indent-2"><span class="ql-ui" contenteditable="false"></span>Calculates a distance matrix based on pairwise alignments of all sequences.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span><strong>2. Guide Tree Construction:</strong></li><li data-list="bullet" class="ql-indent-2"><span class="ql-ui" contenteditable="false"></span>Uses the distance matrix to create a guide tree (neighbor-joining method).</li><li data-list="bullet" class="ql-indent-2"><span class="ql-ui" contenteditable="false"></span>The guide tree represents the evolutionary relationships between sequences.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span><strong>3. Progressive Alignment:</strong></li><li data-list="bullet" class="ql-indent-2"><span class="ql-ui" contenteditable="false"></span>Sequences are aligned progressively, guided by the branching order of the tree.</li><li data-list="bullet" class="ql-indent-2"><span class="ql-ui" contenteditable="false"></span>Profiles (alignments of groups of sequences) are aligned to each other.</li></ul><p><strong>Image Suggestion:</strong> Flowchart of the ClustalW algorithm, example of a guide tree</p>',
  '<h2><strong>Key Features of ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Weighting Schemes:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Sequence weighting to down-weight near-identical sequences.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Position-specific gap penalties to reflect the likelihood of insertions/deletions in certain regions.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Substitution Matrices:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Uses different substitution matrices (e.g., BLOSUM, PAM) for protein alignments.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>These matrices reflect the probability of amino acid substitutions based on evolutionary data.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Gap Penalties:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Gap opening penalty.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Gap extension penalty.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Adjustable parameters that influence the placement of gaps in the alignment.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Delay Divergent Sequence:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Ability to delay the alignment of highly divergent sequences until the end of the process.</li></ul><p><strong>Image Suggestion:</strong> Example of a substitution matrix, screenshot of ClustalW parameter options</p>',
  '<h2><strong>How to Use ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Input:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>A set of unaligned sequences in a supported format (e.g., FASTA, PIR, GenBank).</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Interface:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Command-line interface.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Web-based servers (e.g., EBI ClustalW, GenomeNet ClustalW).</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Parameters:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Users can adjust various parameters, such as gap penalties and substitution matrices.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Default parameters are generally suitable for most alignments.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Output:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Multiple sequence alignment in various formats (e.g., Clustal, Phylip, GCG/MSF).</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>A guide tree file (optional).</li></ul><p><strong>Image Suggestion:</strong> Screenshot of a ClustalW web server input form, example of ClustalW output format</p>',
  '<h2><strong>Applications of ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Phylogenetic Analysis:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Constructing phylogenetic trees to infer evolutionary relationships between species or genes.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Protein Structure Prediction:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Identifying conserved residues that may be important for protein structure or function.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Functional Genomics:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Analyzing gene families and identifying conserved domains.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Primer Design:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Designing PCR primers that target conserved regions of DNA.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Comparative Genomics:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Comparing the genomes of different organisms to identify conserved regions and evolutionary changes.</li></ul><p><strong>Image Suggestion:</strong> Example of a phylogenetic tree based on ClustalW alignment, protein structure with highlighted conserved residues</p>',
  '<h2><strong>Limitations of ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Progressive Alignment Errors:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Errors introduced in early alignment steps can propagate and affect the final alignment.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Sensitive to the order of sequences in the input.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Local Alignment Issues:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>ClustalW is primarily a global alignment algorithm.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>May not be suitable for aligning sequences with large regions of dissimilarity.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Computational Cost:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Can be computationally intensive for very large datasets.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Accuracy:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>While generally accurate, ClustalW may not always produce the optimal alignment, especially for highly divergent sequences.</li></ul><p><strong>Image Suggestion:</strong> Diagram illustrating error propagation in progressive alignment</p>',
  '<h2><strong>Alternatives to ClustalW</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>T-Coffee:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Combines global and local alignment information.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Generally more accurate than ClustalW but slower.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>MUSCLE:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Iterative refinement approach.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Faster and often more accurate than ClustalW.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>MAFFT:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Offers various algorithms, including iterative refinement and FFT-based methods.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Known for its speed and accuracy, especially for large datasets.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Kalign:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Fast and accurate, particularly for sequences with large insertions/deletions.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Clustal Omega:</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Successor to ClustalW.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Improved accuracy and scalability for large datasets.</li></ul><p><strong>Image Suggestion:</strong> Logos of alternative MSA programs (T-Coffee, MUSCLE, MAFFT, Kalign, Clustal Omega)</p>',
  '<h2><strong>Conclusion</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>ClustalW is a powerful and widely used tool for multiple sequence alignment.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>It has been instrumental in advancing our understanding of molecular evolution and protein structure/function.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>While newer and potentially more accurate methods exist, ClustalW remains a valuable tool, especially for smaller datasets and preliminary analyses.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Understanding its strengths and limitations is crucial for choosing the appropriate alignment method for a given task.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>The choice of MSA method depends on factors such as dataset size, sequence divergence, and the specific research question.</li></ul><p><strong>Image Suggestion:</strong> Collage of images related to MSA applications (phylogenetic tree, protein structure, genome browser)</p>',
  '<h2><strong>Q&amp;A</strong></h2><ul><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>This is time for the audience to ask questions about the ClustalW.</li></ul><p><strong>Image Suggestion:</strong>&nbsp;Q&amp;A icon, people raising hands</p>',
];

export interface CardProps {
  index: number;
  heading: string;
  bulletPoints: (string | string[])[];
  images: string[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addCard: (index: number) => void;
  deleteCard: (index: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: FC<CardProps> = ({
  index,
  heading,
  bulletPoints,
  images,
  moveCard,
  addCard,
  deleteCard,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
  ];

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.8 : 1;

  drag(dragRef);
  drop(dropRef);

  const handleAddCard = () => {
    setIsClicked(true);
    addCard(index);
    setTimeout(() => {
      setIsClicked(false);
    }, 300); // Duration of the click effect
  };

  const handleDeleteCard = () => {
    deleteCard(index);
    setDeleteCardModalOpen(false);
  };

  return (
    <>
      {deleteCardModalOpen && (
        <DeleteModal
          open={deleteCardModalOpen}
          setOpen={setDeleteCardModalOpen}
          modalInformation={{
            title: "Delete slide",
            content:
              "Are you sure you want to delete this slide card? All of your data will be permanently removed. This action cannot be undone.",
          }}
          handleDelete={handleDeleteCard}
        />
      )}
      <div className="w-full flex flex-col items-center">
        <div
          ref={dropRef}
          data-handler-id={handlerId}
          className={`relative flex items-stretch w-full h-auto bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg ${
            isDragging ? "border-2 border-purple-500" : ""
          }`}
          style={{ opacity }}
        >
          <FaRegTrashCan
            className={`absolute top-5 right-5 hover:text-purple-700 hover:cursor-pointer transform hover:scale-125 transition-transform duration-200 ease-in-out hover:shadow-lg`}
            onClick={() => setDeleteCardModalOpen(true)}
          />
          <div
            ref={dragRef}
            className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 hover:cursor-pointer font-bold text-gray-700"
          >
            {/* {isDragging ? <FiMove /> : index + 1} */}
            {index + 1}
          </div>
          <div className="w-full p-4 overflow-auto">
            <textarea
              className="border-none w-full text-lg font-semibold resize-none focus:outline-none focus:ring-0"
              rows={1}
              value={heading}
              onChange={(e) => console.log(e.target.value)}
            />
            <ReactQuill
              modules={modules}
              formats={formats}
              value={convertSlideDataToHtml([
                { heading, bulletPoints, images },
              ])}
              onChange={(e) => console.log(e)}
            ></ReactQuill>
          </div>
        </div>
        <div
          className={`relative flex items-center w-2/3 group hover:cursor-pointer transition-transform duration-300 ${
            isClicked ? "scale-95" : ""
          }`}
          onClick={handleAddCard}
        >
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FaCirclePlus className="mx-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </>
  );
};
