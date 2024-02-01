"use client";
import Bounded from "@/components/Bounded";
import { Shapes } from "@/slices/Hero/Shapes";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".name-animation",
        {
          x: -100,
          opacity: 0,
          rotate: -10,
        },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          ease: "elastic.inOut(1,0.2)",
          transformOrigin: "left bottom",
          stagger: {
            each: 0.1,
            from: "random",
          },
        }
      );
      tl.fromTo(
        ".job-title",
        {
          y: -100,
          opacity: 0,
          scale: 0.5,
        },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          scale: 1,
        }
      );
    }, component);
    return () => ctx.revert();
  }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key} inline-block opacity-0`}
      >
        {letter}
      </span>
    ));
  };
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <div className="row-start-1 md:col-start-1">
          <Shapes />
        </div>
        <div className="row-start-2 md:col-start-2 md:row-start-1">
          <h1
            className="mb-8 text-[clamp(3rem,18vmin,20rem)] font-extrabold leading-none 
          tracking-tighter"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="block text-slate-200">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="-mt-[0.2em] block text-blue-600">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
            <span
              className="block bg-gradient-to-tr from-violet-500 via-indigo-200 to-pink-200
            bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent opacity-0 
            md:text-4xl job-title"
            >
              {slice.primary.tag_line}
            </span>
          </h1>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
