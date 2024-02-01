import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { DateField, isFilled } from "@prismicio/client";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  function formateDate(date: DateField) {
    if (isFilled.date(date)) {
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", dateOptions).format(
        new Date(date),
      );
    }
  }

  const formattedDate = formateDate(page.data.date);

  return (
    <Bounded as={"article"}>
      <div className="rounded-3xl border-2 border-zinc-950 bg-zinc-800 p-5">
        <Heading as="h2">{page.data.title}</Heading>
        <div className="mt-4 flex gap-4 font-bold text-sky-500">
          {page.tags.map((tag, _) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="mt-2 border-b border-sky-300">{formattedDate}</p>
        <div className="prose prose-lg prose-invert mt-8 w-full max-w-none md:mt-12">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
