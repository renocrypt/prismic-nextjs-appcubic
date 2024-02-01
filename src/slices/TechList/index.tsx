"use client";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ slice }: TechListProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // create as many GSAP animations and/or ScrollTriggers here as you want...
      const tl = gsap.timeline({
        scrollTrigger: {
          pin: true, // pin the trigger element while active
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
        },
      });

      tl.fromTo(
        ".tech-row",
        {
          x: (i) => {
            return i % 2 === 0
              ? gsap.utils.random(650, 350)
              : gsap.utils.random(-650, -350);
          },
        },
        {
          x: (i) => {
            return i % 2 === 0
              ? gsap.utils.random(-650, -350)
              : gsap.utils.random(650, 350);
          },
          ease: "power1.inOut",
        }
      );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
      ref={component}
    >
      <Bounded as={"div"}>
        <Heading size="lg" as="h2" className="mb-6">
          {slice.primary.heading}
        </Heading>
      </Bounded>
      {slice.items.map(({ tech_name, color }, idx) => (
        <div
          key={idx}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-800"
          aria-label={tech_name || "undefined"}
        >
          {Array.from({ length: 14 }, (_, idx) => (
            <React.Fragment key={idx}>
              <span
                className="tech-item text-8xl font-extrabold uppercase tracking-tight"
                style={{
                  color: idx === 6 && color ? color : "inherit",
                }}
              >
                {tech_name}
              </span>
              <span className="text-4xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;
