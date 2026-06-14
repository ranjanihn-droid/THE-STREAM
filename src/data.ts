import { TrainingProgram, ParentTrack, PartnerSchool, GalleryItem } from "./types";

// Import images directly for Vite asset bundling
import dialogueCircleImg from "./assets/images/peepal_tree_aranyaani_interactive_learning_1780834838044.png";
import gardenLearningImg from "./assets/images/indian_garden_learning_1780824999538.png";
import earthyClassroomImg from "./assets/images/indian_earthy_classroom_1780825030997.png";
import natureTrailImg from "./assets/images/indian_nature_trail_1780825014977.png";
import forestCanopyImg from "./assets/images/forest_canopy_1780813761222.png";

import imgGardenLearning from "./assets/images/garden_learning_1780813709307.png";
import imgIndianDialogueCircle from "./assets/images/indian_dialogue_circle_1780824983112.png";
import imgIndianNatureTrail from "./assets/images/indian_nature_trail_1780825014977.png";
import imgIndianEarthyClassroom from "./assets/images/indian_earthy_classroom_1780825030997.png";
import imgPeepalTreeInteractive from "./assets/images/peepal_tree_aranyaani_interactive_learning_1780834838044.png";
import imgIndianGardenLearning from "./assets/images/indian_garden_learning_1780824999538.png";
import imgForestCanopy from "./assets/images/forest_canopy_1780813761222.png";
import imgEarthyClassroom from "./assets/images/earthy_classroom_1780813726565.png";
import imgPeepalTreeAranyaani from "./assets/images/peepal_tree_aranyaani_learning_1780834301478.png";
import imgDialogueCircle from "./assets/images/dialogue_circle_1780813676857.png";
import imgNatureTrail from "./assets/images/nature_trail_1780813743029.png";
import imgPeepalTreeLearning from "./assets/images/peepal_tree_learning_1780833942917.png";

// Static paths for generated assets
export const IMAGES = {
  dialogueCircle: dialogueCircleImg,
  gardenLearning: gardenLearningImg,
  earthyClassroom: earthyClassroomImg,
  natureTrail: natureTrailImg,
  forestCanopy: forestCanopyImg,
};

export const HOME_INTRO = {
  headline: "Teaching-Learning Exploration for the Educator in You",
  subHeadline: "A transformative 9-month journey into Right Education, facilitated by NeeAr.",
  welcomeTitle: "Welcome to The Stream",
  welcomeText: "We are a dedicated training environment for individuals who are deeply drawn to the integrated \"teaching-learning\" process. To be a true educator is not merely to transmit academic information; it is to engage in a continuous, active state of observation and inner learning alongside the child.",
  welcomeSecondaryText: "In association with NeeAr—the primary facilitating body of our curriculum—we guide prospective and transitioning teachers through a rigorous journey of unlearning and pedagogical discovery. Our ultimate vision is to cultivate educators who are capable of stepping into environments that explore Right Education unbound by time."
};

export const ABOUT_CONTENT = {
  philosophicalAnchor: "The foundation of our approach is deeply inspired by the educational philosophy of J. Krishnamurti. We recognize that global transformation begins in the classroom, which demands a radical shift in the educator's own consciousness. If an adult's mind is bound by fear, comparison, and rigid authority, they unconsciously pass that mechanical existence on to the student. Education here is a shared space for both the teacher and the learner to explore the totality of life with a free and inquiring mind.",
  
  foreTrustTitle: "The Foundation for Right Education",
  foreTrustText: "The Stream is an initiative of The Foundation for Right Education. The Trust is committed to challenging the assembly-line model of conventional schooling by nurturing unhurried environments where educators, parents and their children are respected, intellectually stimulated, and psychologically free.",

  partners: [
    {
      title: "The Vision of Right Education",
      role: "An Unconditioned Journey",
      desc: "Our curriculum prepares prospective and transitioning teachers through a rigorous journey of unlearning and pedagogical discovery, establishing fear-free educational ecosystems."
    },
    {
      title: "The Founders",
      role: "Visionary & Administrative Leadership",
      desc: "Founded by Murali Gotur and Srinivasan HS, operating under the organizational umbrella of The Chalk & Stream Pvt Ltd, dedicated to establishing fearless, conscious educational ecosystems."
    }
  ]
};

export const CORE_PROGRAM = {
  title: "The Core Educator Training Program",
  duration: "9-Month Certification Program",
  tagline: "Facilitated in association with NeeAr (STREAM _ NeeAr_TTP)",
  framework: "Facilitated in association with NeeAr (STREAM _ NeeAr_TTP), designed around a powerful developmental framework: MSKTW (Mindset, Skill set, Knowledge set, Tool set, and Wisdom set).",
  description: "This is a 9-months, course that culminates with a valued certification.",
  phase1Title: "Phase 1",
  phase1Duration: "The Core Modules",
  phase1Description: "A shared journey empowering teachers to evolve into mindful educators. You will build the right mindset, hone your skill sets for alternative education, and develop the right knowledge set regarding learning philosophy, methodology, and pedagogy. Participants will also learn the essential tool set needed for effective and efficient facilitation.",
  phase2Title: "Phase 2",
  phase2Duration: "The Wisdom Set",
  phase2Description: "The final three months feature a well-curated internship to help build the wisdom set for mindful learning environments. Trainees will undergo rigorous, hands-on internships in chosen pedagogical schools in and around Bangalore."
};

export const INCLUSIVE_PROGRAM = {
  title: "Teacher to Educator – Inclusive Educator Programme",
  tagline: "STREAM _ NeeAr_TTP Specialty Track",
  description: "A specialized track for those drawn to neuro-affirmative spaces.",
  points: [
    "Helps you understand the 4Ds of NeuroDivergence.",
    "Explores the MSKTW of Inclusion, viewing inclusion as a way of Learning and Living.",
    "Improves your communication and vocabulary of the inclusive alternative journey.",
    "Provides hands-on experience in an alternative learning space, creating the opportunity to be employed in your dream school."
  ]
};

export const PARENT_PROGRAM = {
  title: "Inclusive Education – A Parent Programme",
  description: "We offer a focused, highly interactive intensive to help parents align their home environment with holistic learning.",
  details: {
    format: "10 to 12 deep-dive sessions over 4 weeks (Rolling intake every 6 weeks).",
    focus: "Understanding learning difficulties through the 4Ds of inclusive education, and learning how to choose a supportive learning journey for your child.",
    application: "Guidance on how to engage kids at home, supported by classroom observations and understanding.",
    growth: "Fosters mindful parenting through open conversations to develop the MSKTW of inclusive parenting."
  }
};

export const PLACEMENT_CONTENT = {
  intro: "The goal of The Stream is not just to train, but to actively place conscious educators where they are needed most. Upon successful completion of the 9-month program and rigorous internship, our objective is to integrate our trainees into pioneering schools that create their own path to explore Right Education.",
  ctaText: "If your school aligns with the philosophy of fearless, unhurried education, we welcome you to partner with our placement network.",
  schools: [
    {
      name: "Aranyaani",
      logoText: "Aranyaani Logo",
      tagline: "Nature-First Learning",
      description: "A pioneering forest school environment dedicated to natural and space-unbound learning in Bangalore."
    },
    {
      name: "Aarohi",
      logoText: "Aarohi Logo",
      tagline: "Self-Directed Community Learning",
      description: "An open learning community for lifelong learners where freedom accompanies deep responsibility."
    },
    {
      name: "Other Partner Alternative Schools",
      logoText: "Partner Alternative Spaces",
      tagline: "Unconstrained Pedagogies",
      description: "A loose collective of alternative, democratic spaces and experiential educational setups in Bangalore."
    }
  ] as PartnerSchool[]
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    imageSrc: "https://1drv.ms/i/c/4dae11835575d5c1/IQRSCwewcPnWTIh4SEaCj3geAXfU0n8bz11N3QL3UkIHE-8",
    title: "Philosophy of Right Education (Wide Portrait)",
    description: "The primary high-resolution inspiration artwork. Dedicated to continuous inquiry, observation, and inner learning.",
    mediaType: "image"
  },
  {
    imageSrc: "https://1drv.ms/i/c/4dae11835575d5c1/IQRokX3W6yx3RpGScH9d1OZ1AZmjs1IxqHziMPganZkvASI",
    title: "Insightful Teachings (Mobile Portrait Layout)",
    description: "The mobile-optimized presentation of J. Krishnamurti's quote: 'You have to be your own TEACHER'.",
    mediaType: "image"
  },
  {
    imageSrc: "https://1drv.ms/i/c/4dae11835575d5c1/IQRk2lquIovgQJVv1mzhRRJKAQnA_MsIYtlRS5q5Kkv03Tk",
    title: "The Stream Official Crest",
    description: "Authentic logo design of The Stream representing integrated, unhurried, fearless learning paradigms.",
    mediaType: "image"
  },
  {
    imageSrc: "https://1drv.ms/v/c/4dae11835575d5c1/IQRQl9Ix7av7R4lz4RoX0MghASpRpmDpOTQ-50QLiPMlvoo",
    title: "Unhurried Dialogue - Video Stream I",
    description: "Active video footage showing trainers and trainees dialoguing under the open canopy, practicing direct diagnostic awareness.",
    mediaType: "video"
  },
  {
    imageSrc: "https://youtu.be/IEEg6dwYrxk?si=vCJjcOOZsFMuWcII",
    title: "What is the Purpose of Education?",
    description: "An intense inquiry by J. Krishnamurti into whether education is merely acquiring skills and career security or the awakening of intelligence.",
    mediaType: "video"
  },
  {
    imageSrc: "https://youtu.be/5fRbafjn12Y?si=_V-7CN86478JiZ3J",
    title: "To Learn, You Must Have a Quiet Mind",
    description: "J. Krishnamurti discusses how a mind burdened with comparison, competition, and authority cannot learn. Real learning demands freedom.",
    mediaType: "video"
  },
  {
    imageSrc: "https://youtu.be/DEBE_PXCb_Y?si=kMjqPGKBSPXKBRPr",
    title: "Observation Without the Observer",
    description: "Investigating the deep division between the thinker and the thought. Discovering how a state of pure observing unlocks deep awareness.",
    mediaType: "video"
  }
];

export const CONTACT_INFO = {
  title: "JOIN THE STREAM",
  subtitle: "Begin your journey into fearless, conscious education.",
  website: "www.thestream.co.in",
  email: "info@thestream.co.in",
  contactPerson: "Sreenivasan",
  phone: "+91 70229 73023",
  legalEntity: "THE CHALK & STREAM PVT LTD"
};
