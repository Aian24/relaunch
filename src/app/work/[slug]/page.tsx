import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
  caseStudiesData,
} from "@/data/caseStudies";
import CaseStudyDetailClient from "@/components/CaseStudyDetailClient";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const slugs = getAllCaseStudySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const study = getCaseStudyBySlug(params.slug);

  if (!study) {
    return {
      title: "Case Study Not Found | ReLaunch",
      description: "The requested case study could not be found.",
    };
  }

  return {
    title: `${study.title} Case Study | ReLaunch Agency`,
    description: `${study.description} Discover how ReLaunch helped ${study.client} achieve ${study.headlineNumber}.`,
    openGraph: {
      title: `${study.title} | ReLaunch Case Study`,
      description: study.description,
      images: [
        {
          url: study.image,
          width: 1200,
          height: 630,
          alt: study.title,
        },
      ],
    },
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = getCaseStudyBySlug(params.slug);

  if (!study) {
    notFound();
  }

  // Find index in master list to provide next and previous links
  const currentIndex = caseStudiesData.findIndex(
    (cs) => cs.id === study.id || cs.slug === study.slug
  );

  const prevStudy =
    currentIndex > 0 ? caseStudiesData[currentIndex - 1] : undefined;
  const nextStudy =
    currentIndex < caseStudiesData.length - 1
      ? caseStudiesData[currentIndex + 1]
      : undefined;

  return (
    <CaseStudyDetailClient
      study={study}
      prevStudy={prevStudy}
      nextStudy={nextStudy}
    />
  );
}
